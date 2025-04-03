
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/dashboard/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShareDialog } from "@/components/collaboration/ShareDialog";
import { Project } from "./Collaboration";
import { FileText, Image as ImageIcon, Music, Layers, ArrowLeft, Share2, Users } from "lucide-react";

type TabType = "text" | "image" | "music" | "multimodal";

const ProjectWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("text");
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  // This would be replaced with a real API call in a production app
  useEffect(() => {
    // Simulate loading the project
    const timer = setTimeout(() => {
      // In a real app, you would fetch project data from an API
      const mockProject: Project = {
        id: projectId || "",
        name: "Sample Collaborative Project",
        description: "This is a collaborative workspace for team members to work together on creative content.",
        createdAt: new Date().toISOString(),
        createdBy: "John Doe",
        collaborators: ["Jane Smith", "Mike Johnson"]
      };
      
      setProject(mockProject);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mt-8 flex justify-center">
          <div className="cosmic-card p-8 text-center w-full max-w-md">
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
              {project.collaborators.length > 0 ? (
                project.collaborators.slice(0, 3).map((collaborator, i) => (
                  <Avatar key={i} className="border-2 border-background">
                    <AvatarImage src="" />
                    <AvatarFallback>{collaborator.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))
              ) : (
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setShareDialogOpen(true)}>
                  <Users className="h-4 w-4" />
                  Add Collaborators
                </Button>
              )}
              
              {project.collaborators.length > 3 && (
                <Avatar className="border-2 border-background">
                  <AvatarFallback>+{project.collaborators.length - 3}</AvatarFallback>
                </Avatar>
              )}
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
            
            <TabsContent value="text" className="p-2">
              <div className="space-y-4">
                <Textarea 
                  placeholder="Start writing your collaborative text content..." 
                  className="min-h-[400px]"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Generate with AI</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="image" className="p-2">
              <div className="cosmic-card p-6 text-center min-h-[400px] flex flex-col items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Image Collaboration</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Collaborate on image generation and editing with your team members.
                </p>
                <Button>Start Image Project</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="music" className="p-2">
              <div className="cosmic-card p-6 text-center min-h-[400px] flex flex-col items-center justify-center">
                <Music className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Music Collaboration</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Create and compose music together in real-time.
                </p>
                <Button>Start Music Project</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="multimodal" className="p-2">
              <div className="cosmic-card p-6 text-center min-h-[400px] flex flex-col items-center justify-center">
                <Layers className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Multi-Modal Collaboration</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Combine text, images, and music in a single collaborative project.
                </p>
                <Button>Start Multi-Modal Project</Button>
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
