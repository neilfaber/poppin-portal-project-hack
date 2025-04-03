
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Loader2, Download, RefreshCw } from "lucide-react";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [resolution, setResolution] = useState("512x512");
  const [style, setStyle] = useState("realistic");
  const [detailLevel, setDetailLevel] = useState([7]);
  const { toast } = useToast();

  const placeholderImageUrl = "https://placehold.co/600x400/1a1a2e/FFFFFF?text=Generated+Image+Will+Appear+Here";

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate an image",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // In a real implementation, this would call an AI image generation API
      // For demo, we'll use a placeholder image
      setGeneratedImage(placeholderImageUrl);
      
      toast({
        title: "Image Generated",
        description: "Your AI-powered image has been created!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-8">
      <h2 className="text-3xl font-bold mb-8">AI Image Creator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle>Create Your Image</CardTitle>
            <CardDescription>
              Describe the image you want to generate with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Image Description</Label>
              <Textarea 
                id="prompt"
                placeholder="Describe the image you want to create in detail..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 pt-4">
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
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="negativePrompt">Negative Prompt</Label>
                  <Textarea 
                    id="negativePrompt"
                    placeholder="Elements you want to exclude from the image..."
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seed">Seed (optional)</Label>
                    <Input id="seed" placeholder="Random seed" type="number" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="steps">Steps</Label>
                    <Input id="steps" placeholder="20" type="number" defaultValue="20" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={generateImage} 
              className="w-full"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Image"
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
            <CardDescription>
              Your AI-generated artwork will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={1}>
              <div className="h-full w-full rounded-md overflow-hidden flex items-center justify-center bg-cosmic-900/50">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="h-10 w-10 animate-spin text-cosmic-400 mb-4" />
                    <p className="text-sm text-muted-foreground">Generating your masterpiece...</p>
                  </div>
                ) : (
                  <img 
                    src={generatedImage || placeholderImageUrl} 
                    alt="AI generated" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </AspectRatio>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" disabled={!generatedImage || generatedImage === placeholderImageUrl}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Variations
            </Button>
            <Button variant="outline" disabled={!generatedImage || generatedImage === placeholderImageUrl}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ImageGenerator;
