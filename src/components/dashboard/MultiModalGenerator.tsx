
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileText, Image as ImageIcon, Music, Play, Pause, RefreshCw } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function MultiModalGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    text: "",
    image: "",
    music: false,
  });
  const { toast } = useToast();

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate content",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 4000));
      
      // In a real implementation, this would call multiple AI generation APIs
      setGeneratedContent({
        text: `# ${prompt}\n\nThe integration of multiple AI modalities creates a rich tapestry of creative expression. By combining text, image, and audio generation, we can craft immersive experiences that engage multiple senses simultaneously.\n\nEach modality reinforces the others, creating a cohesive narrative that's greater than the sum of its parts. The visual elements provide context for the text, while the audio creates emotional resonance that enhances both.\n\nThis multi-modal approach represents the future of AI-assisted creativity, opening new avenues for storytelling, education, and entertainment.`,
        image: "https://placehold.co/600x400/1a1a2e/FFFFFF?text=AI+Generated+Image",
        music: true,
      });
      
      toast({
        title: "Content Generated",
        description: "Your multi-modal AI content has been created!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container my-8">
      <h2 className="text-3xl font-bold mb-8">Multi-Modal AI Studio</h2>
      
      <div className="space-y-8">
        <Card className="cosmic-card cosmic-glow">
          <CardHeader>
            <CardTitle>Create Multi-Modal Content</CardTitle>
            <CardDescription>
              Generate text, image, and music all from a single prompt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-lg">Your Creative Prompt</Label>
                <Textarea 
                  id="prompt"
                  placeholder="Describe what you want to create (e.g., 'A serene coastal landscape at sunset with gentle waves')..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] text-lg"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="h-5 w-5 text-cosmic-400" />
                  <span>Text Generation</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <ImageIcon className="h-5 w-5 text-cosmic-400" />
                  <span>Image Creation</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Music className="h-5 w-5 text-cosmic-400" />
                  <span>Music Composition</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={generateContent} 
              className="w-full text-lg"
              disabled={isLoading || !prompt.trim()}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Multi-Modal Content...
                </>
              ) : (
                "Generate Content"
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {(isLoading || generatedContent.text || generatedContent.image || generatedContent.music) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Text Output */}
            <Card className="cosmic-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cosmic-400" />
                    Generated Text
                  </CardTitle>
                  <CardDescription>
                    AI-written text based on your prompt
                  </CardDescription>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled={!generatedContent.text}>Copy</DropdownMenuItem>
                    <DropdownMenuItem disabled={!generatedContent.text}>Export as Markdown</DropdownMenuItem>
                    <DropdownMenuItem disabled={!generatedContent.text}>Refine</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              
              <CardContent>
                <div className="min-h-[250px] p-4 bg-cosmic-900/50 rounded-md overflow-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin text-cosmic-400" />
                    </div>
                  ) : generatedContent.text ? (
                    <div className="text-left whitespace-pre-line">{generatedContent.text}</div>
                  ) : (
                    <div className="text-muted-foreground h-full flex items-center justify-center">
                      Your generated text will appear here
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Image Output */}
            <Card className="cosmic-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-cosmic-400" />
                    Generated Image
                  </CardTitle>
                  <CardDescription>
                    AI-created visual based on your prompt
                  </CardDescription>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    disabled={!generatedContent.image}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    disabled={!generatedContent.image}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <AspectRatio ratio={4/3}>
                  <div className="h-full w-full rounded-md overflow-hidden flex items-center justify-center bg-cosmic-900/50">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-cosmic-400 mb-2" />
                        <p className="text-sm text-muted-foreground">Creating visual...</p>
                      </div>
                    ) : generatedContent.image ? (
                      <img 
                        src={generatedContent.image} 
                        alt="AI generated" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground">
                        Your generated image will appear here
                      </div>
                    )}
                  </div>
                </AspectRatio>
              </CardContent>
            </Card>
            
            {/* Music Output */}
            <Card className="cosmic-card lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-cosmic-400" />
                    Generated Music
                  </CardTitle>
                  <CardDescription>
                    AI-composed audio soundtrack
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col items-center justify-center h-24 p-4 bg-cosmic-900/50 rounded-md">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin text-cosmic-400" />
                    </div>
                  ) : generatedContent.music ? (
                    <div className="flex items-center justify-center w-full">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="mr-4"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <div className="w-full max-w-md">
                        <div className="w-full bg-cosmic-800/50 h-16 rounded-lg flex items-center justify-center relative overflow-hidden">
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
                        </div>
                      </div>
                      
                      <Button 
                        variant="default" 
                        size="icon" 
                        className="h-12 w-12 rounded-full ml-4"
                        onClick={togglePlayback}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-1" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      Your generated music will appear here
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiModalGenerator;
