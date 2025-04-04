
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/dashboard/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShareDialog } from "@/components/collaboration/ShareDialog";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";
import { toast } from "@/hooks/use-toast";
import { generateContent, getProjectGeneratedContent } from "@/services/aiGeneration";
import { getProjectById } from "@/services/projects";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Image as ImageIcon, Music, Layers, ArrowLeft, Share2, Users, Loader2, Upload, Video, Save, RefreshCw, Copy, Check, FileDown, Play, Pause } from "lucide-react";

type TabType = "text" | "image" | "music" | "multimodal";

// Type definitions for collaborative users
interface CollaborativeUser {
  id: string;
  name: string;
  avatar?: string;
  isActive: boolean;
  lastActive: Date;
}

const ProjectWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("text");
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Text collaboration state
  const [noteContent, setNoteContent] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Image collaboration state
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [style, setStyle] = useState("realistic");
  const [resolution, setResolution] = useState("512x512");
  const [detailLevel, setDetailLevel] = useState([7]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // Music collaboration state
  const [musicPrompt, setMusicPrompt] = useState("");
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicGenerated, setMusicGenerated] = useState(false);
  const [genre, setGenre] = useState("electronic");
  const [duration, setDuration] = useState([30]);
  const [musicData, setMusicData] = useState<any>(null);
  
  // Multimodal collaboration state
  const [multimodalPrompt, setMultimodalPrompt] = useState("");
  const [uploadedText, setUploadedText] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [uploadedMusic, setUploadedMusic] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoGenerated, setVideoGenerated] = useState(false);
  
  // Project content
  const [projectContent, setProjectContent] = useState<any[]>([]);
  
  // Active users in the project - would be from Supabase Presence in a production app
  const [activeUsers, setActiveUsers] = useState<CollaborativeUser[]>([]);

  useEffect(() => {
    loadProjectData();
    // Set up real-time subscriptions for project changes
    if (projectId) {
      const channel = supabase
        .channel(`project-${projectId}`)
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'generated_content',
            filter: `project_id=eq.${projectId}`
          },
          () => {
            loadProjectContent();
          }
        )
        .subscribe();

      // In a real app, this would use Supabase Presence
      setupPresenceSimulation();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [projectId]);
  
  // Simulate collaborative user presence
  const setupPresenceSimulation = () => {
    // In a real app, this would use Supabase Presence
    const mockUsers: CollaborativeUser[] = [
      { 
        id: '1', 
        name: 'John Doe', 
        isActive: true, 
        lastActive: new Date() 
      },
      { 
        id: '2', 
        name: 'Jane Smith', 
        isActive: Math.random() > 0.5, 
        lastActive: new Date() 
      },
      { 
        id: '3', 
        name: 'Mike Johnson', 
        isActive: Math.random() > 0.7, 
        lastActive: new Date(Date.now() - 1000 * 60 * 5) 
      }
    ];
    
    setActiveUsers(mockUsers);

    // Simulate users joining/leaving
    const presenceInterval = setInterval(() => {
      const updatedUsers = mockUsers.map(user => ({
        ...user,
        isActive: user.id === '1' ? true : Math.random() > 0.3,
        lastActive: user.id === '1' ? new Date() : 
          Math.random() > 0.5 ? new Date() : user.lastActive
      }));
      
      setActiveUsers(updatedUsers);
    }, 10000);
    
    return () => clearInterval(presenceInterval);
  };

  // Simulate collaborative typing in text mode
  useEffect(() => {
    if (activeTab === "text" && !editingUser) {
      // Simulate another user typing occasionally
      const simulateTypingInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          const collaborator = activeUsers.find(user => user.id !== '1' && user.isActive);
          if (collaborator) {
            setEditingUser(collaborator.name);
            setTimeout(() => setEditingUser(null), 2000);
          }
        }
      }, 5000);
      
      return () => clearInterval(simulateTypingInterval);
    }
  }, [activeTab, activeUsers, editingUser]);

  const loadProjectData = async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }
    
    try {
      const projectData = await getProjectById(projectId);
      
      if (!projectData) {
        setIsLoading(false);
        return;
      }
      
      setProject(projectData);
      
      // Load project content
      await loadProjectContent();
    } catch (error) {
      console.error("Error loading project:", error);
      toast({
        title: "Error",
        description: "Failed to load project data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjectContent = async () => {
    if (!projectId) return;
    
    try {
      const content = await getProjectGeneratedContent(projectId);
      setProjectContent(content);
      
      // Initialize content from the most recent items
      const textContent = content.find(item => item.content_type === 'text');
      if (textContent) {
        setNoteContent(textContent.result);
      } else {
        setNoteContent("Welcome to our collaborative project! Let's create something amazing together.\n\nFeel free to edit this text and collaborate in real-time.");
      }
      
      const imageContent = content.find(item => item.content_type === 'image');
      if (imageContent) {
        setImagePrompt(imageContent.prompt);
        setGeneratedImage(imageContent.result);
        const settings = imageContent.settings || {};
        if (settings.style) setStyle(settings.style);
        if (settings.resolution) setResolution(settings.resolution);
        if (settings.detailLevel) setDetailLevel([settings.detailLevel]);
      }
      
      const musicContent = content.find(item => item.content_type === 'music');
      if (musicContent) {
        setMusicPrompt(musicContent.prompt);
        setMusicGenerated(true);
        try {
          const parsedData = JSON.parse(musicContent.result);
          setMusicData(parsedData);
        } catch (e) {
          console.error("Error parsing music data:", e);
        }
        const settings = musicContent.settings || {};
        if (settings.genre) setGenre(settings.genre);
        if (settings.duration) setDuration([settings.duration]);
      }
    } catch (error) {
      console.error("Error loading project content:", error);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(e.target.value);
    // In a real application, this would send the update to a real-time database
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(noteContent);
      setCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Text has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const exportAsText = () => {
    try {
      const blob = new Blob([noteContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project?.name || 'project'}-notes.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your text has been exported as a .txt file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export text as file.",
        variant: "destructive",
      });
    }
  };
  
  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description to generate an image",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const result = await generateContent('image', imagePrompt, {
        style,
        resolution,
        detailLevel: detailLevel[0]
      }, projectId);
      
      if (result.error) {
        toast({
          title: "Generation Failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      
      setGeneratedImage(result.result || "");
      
      toast({
        title: "Image Generated",
        description: "Your collaborative AI image has been created!",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "There was an error generating your image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  const generateMusic = async () => {
    if (!musicPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description to generate music",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingMusic(true);
    try {
      const result = await generateContent('music', musicPrompt, {
        genre,
        duration: duration[0]
      }, projectId);
      
      if (result.error) {
        toast({
          title: "Generation Failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      
      try {
        const parsedData = JSON.parse(result.result || "{}");
        setMusicData(parsedData);
      } catch (e) {
        console.error("Error parsing music data:", e);
      }
      
      setMusicGenerated(true);
      
      toast({
        title: "Music Generated",
        description: "Your collaborative AI music has been created!",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "There was an error generating your music",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMusic(false);
    }
  };
  
  const handleFileUpload = (type: 'text' | 'image' | 'music') => {
    // In a real app, this would handle file uploads
    // For demo purposes, we'll simulate uploads
    
    switch (type) {
      case 'text':
        setTimeout(() => {
          setUploadedText("Example uploaded text content that would be used for video generation.");
          toast({
            title: "Text Uploaded",
            description: "Your text file has been uploaded successfully.",
          });
        }, 1000);
        break;
      case 'image':
        setTimeout(() => {
          setUploadedImage("https://placehold.co/600x400/1a1a2e/FFFFFF?text=Uploaded+Image");
          toast({
            title: "Image Uploaded",
            description: "Your image has been uploaded successfully.",
          });
        }, 1000);
        break;
      case 'music':
        setTimeout(() => {
          setUploadedMusic(true);
          toast({
            title: "Music Uploaded",
            description: "Your music file has been uploaded successfully.",
          });
        }, 1000);
        break;
    }
  };
  
  const generateVideo = async () => {
    if (!uploadedText && !uploadedImage && !uploadedMusic) {
      toast({
        title: "Content Required",
        description: "Please upload at least one media file (text, image, or music)",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingVideo(true);
    try {
      // In a real app, this would call an AI video generation API
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      setVideoGenerated(true);
      
      toast({
        title: "Video Generated",
        description: "Your collaborative AI video has been created!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingVideo(false);
    }
  };
  
  const generateText = async () => {
    if (!noteContent.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some text to use as context for AI generation",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await generateContent('text', noteContent, {
        style: "creative",
        wordCount: 300
      }, projectId);
      
      if (result.error) {
        toast({
          title: "Generation Failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      
      setNoteContent(result.result || "");
      
      toast({
        title: "Text Generated",
        description: "AI has enhanced your text content!",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "There was an error generating your text",
        variant: "destructive",
      });
    }
  };
  
  const saveProject = async () => {
    // In a real app, this would save the current project state
    try {
      if (activeTab === 'text') {
        await generateContent('text', "Text content save", {
          content: noteContent
        }, projectId);
      }
      
      toast({
        title: "Project Saved",
        description: "Your changes have been saved and shared with collaborators.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your project. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mt-8 flex justify-center">
          <div className="cosmic-card p-8 text-center w-full max-w-md">
            <Loader2 className="h-8 w-8 animate-spin text-cosmic-400 mx-auto mb-4" />
            <p className="text-lg">Loading project workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mt-8 flex justify-center">
          <div className="cosmic-card p-8 text-center w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <p className="mb-6">The project you're looking for doesn't exist or you don't have access.</p>
            <Button onClick={() => navigate("/collaboration")}>
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container my-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/collaboration")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{project.name}</h2>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex -space-x-2">
              {activeUsers.map((user, i) => (
                <div key={user.id} className="relative">
                  <Avatar className="border-2 border-background">
                    <AvatarImage src="" />
                    <AvatarFallback className={user.isActive ? "bg-green-500/20" : ""}>
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {user.isActive && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                  )}
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="gap-2" onClick={() => setShareDialogOpen(true)}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="cosmic-card p-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="text" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Image</span>
              </TabsTrigger>
              <TabsTrigger value="music" className="gap-2">
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">Music</span>
              </TabsTrigger>
              <TabsTrigger value="multimodal" className="gap-2">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Multi-Modal</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Text Collaboration Tab */}
            <TabsContent value="text" className="p-2">
              <div className="space-y-4">
                <div className="relative">
                  <Textarea 
                    placeholder="Start writing your collaborative text content..." 
                    className="min-h-[400px]"
                    value={noteContent}
                    onChange={handleTextChange}
                  />
                  {editingUser && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="animate-pulse bg-cosmic-400/10 text-cosmic-400">
                        {editingUser} is typing...
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex justify-between gap-3">
                  <div>
                    <Button variant="outline" onClick={copyToClipboard} className="mr-2">
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      Copy
                    </Button>
                    <Button variant="outline" onClick={exportAsText}>
                      <FileDown className="h-4 w-4 mr-2" /> 
                      Export as .txt
                    </Button>
                  </div>
                  <div>
                    <Button variant="outline" className="mr-2" onClick={saveProject}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button onClick={generateText}>Generate with AI</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Image Collaboration Tab */}
            <TabsContent value="image" className="p-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imagePrompt">Image Description</Label>
                    <Textarea 
                      id="imagePrompt"
                      placeholder="Describe the image you want to create in detail..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="style">Style</Label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger id="style">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realistic">Realistic</SelectItem>
                          <SelectItem value="abstract">Abstract</SelectItem>
                          <SelectItem value="anime">Anime</SelectItem>
                          <SelectItem value="digital-art">Digital Art</SelectItem>
                          <SelectItem value="oil-painting">Oil Painting</SelectItem>
                          <SelectItem value="watercolor">Watercolor</SelectItem>
                          <SelectItem value="pixel-art">Pixel Art</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resolution">Resolution</Label>
                      <Select value={resolution} onValueChange={setResolution}>
                        <SelectTrigger id="resolution">
                          <SelectValue placeholder="Select resolution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="512x512">512x512</SelectItem>
                          <SelectItem value="768x768">768x768</SelectItem>
                          <SelectItem value="1024x1024">1024x1024</SelectItem>
                          <SelectItem value="512x768">512x768 (Portrait)</SelectItem>
                          <SelectItem value="768x512">768x512 (Landscape)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="detailLevel">Detail Level</Label>
                        <span>{detailLevel[0]}/10</span>
                      </div>
                      <Slider 
                        id="detailLevel"
                        min={1} 
                        max={10} 
                        step={1} 
                        value={detailLevel} 
                        onValueChange={setDetailLevel} 
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={generateImage} 
                    className="w-full"
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Image"
                    )}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <AspectRatio ratio={1}>
                    <div className="h-full w-full rounded-md overflow-hidden flex items-center justify-center bg-cosmic-900/50">
                      {isGeneratingImage ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <Loader2 className="h-10 w-10 animate-spin text-cosmic-400 mb-4" />
                          <p className="text-sm text-muted-foreground">Generating your collaborative image...</p>
                        </div>
                      ) : generatedImage ? (
                        <img 
                          src={generatedImage} 
                          alt="AI generated" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <p className="mb-2">Your collaborative image will appear here</p>
                          <p className="text-sm">Enter a prompt and click "Generate Image"</p>
                        </div>
                      )}
                    </div>
                  </AspectRatio>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" disabled={!generatedImage} onClick={generateImage}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Variations
                    </Button>
                    <Button variant="outline" disabled={!generatedImage} onClick={saveProject}>
                      <Save className="mr-2 h-4 w-4" />
                      Save to Project
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Music Collaboration Tab */}
            <TabsContent value="music" className="p-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="musicPrompt">Music Description</Label>
                    <Textarea 
                      id="musicPrompt"
                      placeholder="Describe the music you want to create (e.g., 'A calm piano melody with ambient sounds')..."
                      value={musicPrompt}
                      onChange={(e) => setMusicPrompt(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="genre">Genre</Label>
                      <Select value={genre} onValueChange={setGenre}>
                        <SelectTrigger id="genre">
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronic">Electronic</SelectItem>
                          <SelectItem value="ambient">Ambient</SelectItem>
                          <SelectItem value="classical">Classical</SelectItem>
                          <SelectItem value="jazz">Jazz</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="hiphop">Hip Hop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="duration">Duration (seconds)</Label>
                        <span>{duration[0]}</span>
                      </div>
                      <Slider 
                        id="duration"
                        min={15} 
                        max={60} 
                        step={5} 
                        value={duration} 
                        onValueChange={setDuration} 
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={generateMusic} 
                    className="w-full"
                    disabled={isGeneratingMusic || !musicPrompt.trim()}
                  >
                    {isGeneratingMusic ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Composing...
                      </>
                    ) : (
                      "Generate Music"
                    )}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center min-h-[300px] p-4 bg-cosmic-900/50 rounded-md">
                    {isGeneratingMusic ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="h-10 w-10 animate-spin text-cosmic-400 mb-4" />
                        <p className="text-sm text-muted-foreground">Composing your collaborative melody...</p>
                      </div>
                    ) : musicGenerated ? (
                      <div className="w-full space-y-8">
                        <div className="w-full bg-cosmic-800/50 h-32 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0">
                            {/* Audio visualization bars (simulated) */}
                            <div className="flex items-end justify-center h-full gap-[2px] px-4">
                              {Array.from({ length: 60 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1 bg-cosmic-400 rounded-t ${
                                    isPlaying ? "animate-float" : ""
                                  }`}
                                  style={{ 
                                    height: `${Math.random() * 70 + 10}%`,
                                    animationDelay: `${i * 0.05}s`,
                                    animationDuration: `${0.7 + Math.random() * 0.5}s`
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="z-10 bg-cosmic-800/70 backdrop-blur-sm px-6 py-2 rounded-full">
                            {musicPrompt}
                          </div>
                        </div>
                        
                        <div className="flex justify-center space-x-4">
                          <Button 
                            variant="default" 
                            size="icon" 
                            className="h-12 w-12 rounded-full"
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            {isPlaying ? (
                              <Pause className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5 ml-1" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <p className="mb-2">No music generated yet</p>
                        <p className="text-sm">Enter a prompt and click "Generate Music" to create your AI composition</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" disabled={!musicGenerated} onClick={generateMusic}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button variant="outline" disabled={!musicGenerated} onClick={saveProject}>
                      <Save className="mr-2 h-4 w-4" />
                      Save to Project
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Multi-Modal Video Generation Tab */}
            <TabsContent value="multimodal" className="p-2">
              <div className="space-y-6">
                <div className="cosmic-card p-6">
                  <h3 className="text-xl font-semibold mb-4">Video Generation from Multiple Media</h3>
                  <p className="text-muted-foreground mb-6">
                    Upload text, images, and music to create an AI-generated video that combines all elements.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Text Upload */}
                    <div className={`p-4 rounded-md border-2 border-dashed ${uploadedText ? 'border-green-500/30' : 'border-border'} flex flex-col items-center justify-center min-h-[150px]`}>
                      <FileText className={`h-8 w-8 mb-2 ${uploadedText ? 'text-green-500' : 'text-muted-foreground'}`} />
                      <h4 className="font-medium mb-1">Text Content</h4>
                      {uploadedText ? (
                        <div className="text-center">
                          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 mb-2">Uploaded</Badge>
                          <p className="text-xs text-muted-foreground line-clamp-2">{uploadedText.substring(0, 50)}...</p>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => handleFileUpload('text')}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Text
                        </Button>
                      )}
                    </div>
                    
                    {/* Image Upload */}
                    <div className={`p-4 rounded-md border-2 border-dashed ${uploadedImage ? 'border-green-500/30' : 'border-border'} flex flex-col items-center justify-center min-h-[150px]`}>
                      <ImageIcon className={`h-8 w-8 mb-2 ${uploadedImage ? 'text-green-500' : 'text-muted-foreground'}`} />
                      <h4 className="font-medium mb-1">Image</h4>
                      {uploadedImage ? (
                        <div className="text-center">
                          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 mb-2">Uploaded</Badge>
                          <div className="w-16 h-16 rounded-md overflow-hidden mx-auto mt-1">
                            <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => handleFileUpload('image')}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                      )}
                    </div>
                    
                    {/* Music Upload */}
                    <div className={`p-4 rounded-md border-2 border-dashed ${uploadedMusic ? 'border-green-500/30' : 'border-border'} flex flex-col items-center justify-center min-h-[150px]`}>
                      <Music className={`h-8 w-8 mb-2 ${uploadedMusic ? 'text-green-500' : 'text-muted-foreground'}`} />
                      <h4 className="font-medium mb-1">Music</h4>
                      {uploadedMusic ? (
                        <div className="text-center">
                          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 mb-2">Uploaded</Badge>
                          <div className="flex justify-center mt-1">
                            <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => handleFileUpload('music')}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Music
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="multimodalPrompt">Video Description (Optional)</Label>
                      <Textarea 
                        id="multimodalPrompt"
                        placeholder="Add additional instructions for video generation..."
                        value={multimodalPrompt}
                        onChange={(e) => setMultimodalPrompt(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <Button 
                      onClick={generateVideo} 
                      className="w-full"
                      disabled={isGeneratingVideo || (!uploadedText && !uploadedImage && !uploadedMusic)}
                    >
                      {isGeneratingVideo ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Video...
                        </>
                      ) : (
                        <>
                          <Video className="mr-2 h-4 w-4" />
                          Generate Video
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Video Output */}
                {(isGeneratingVideo || videoGenerated) && (
                  <div className="cosmic-card p-6">
                    <h3 className="text-xl font-semibold mb-4">Generated Video</h3>
                    
                    <div className="aspect-video bg-cosmic-900/50 rounded-md overflow-hidden flex items-center justify-center">
                      {isGeneratingVideo ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <Loader2 className="h-12 w-12 animate-spin text-cosmic-400 mb-4" />
                          <p className="text-muted-foreground">Creating your collaborative video...</p>
                          <p className="text-xs text-muted-foreground mt-2">This may take several minutes</p>
                        </div>
                      ) : videoGenerated ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-cosmic-800/50">
                          <Video className="h-16 w-16 text-cosmic-400 mb-4" />
                          <p className="text-lg font-medium mb-2">Video Generated Successfully</p>
                          <p className="text-muted-foreground mb-4 text-center max-w-md">
                            Your collaborative video is ready. In a real application, the video would appear here for playback.
                          </p>
                          <div className="flex space-x-4">
                            <Button variant="outline">
                              <Play className="mr-2 h-4 w-4" />
                              Play Video
                            </Button>
                            <Button variant="outline">
                              <FileDown className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {project && (
        <ShareDialog
          project={project}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
        />
      )}
    </div>
  );
};

export default ProjectWorkspace;
