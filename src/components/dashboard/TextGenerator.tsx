
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Save, FileDown, Check } from "lucide-react";

export function TextGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [editableText, setEditableText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [creativity, setCreativity] = useState([0.7]);
  const [length, setLength] = useState([500]);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateText = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate text",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // In a real application, this would be a fetch call to an AI text generation API
      const demoText = `# ${prompt}\n\nArtificial intelligence has rapidly evolved over the past decade, transforming industries and creating new possibilities for creative expression. The integration of AI in content creation tools has empowered creators to explore new horizons and push the boundaries of what's possible.\n\nAs we continue to develop more sophisticated algorithms and models, the relationship between human creativity and machine assistance becomes increasingly symbiotic. Rather than replacing human ingenuity, these tools amplify our capabilities and open doors to new forms of expression.\n\nThe future of AI-assisted creation is promising, with ongoing research focused on improving context understanding, generating more coherent narratives, and maintaining consistent style throughout longer texts. These advancements will further enhance the collaborative potential between humans and AI systems.`;
      
      setGeneratedText(demoText);
      setEditableText(demoText);
      toast({
        title: "Text Generated",
        description: "Your AI-powered text has been created!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleEditableTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableText(e.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveEdit = () => {
    setGeneratedText(editableText);
    setIsEditing(false);
    toast({
      title: "Changes Saved",
      description: "Your edits have been saved successfully.",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
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
      const blob = new Blob([generatedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${prompt.substring(0, 20) || 'generated'}-text.txt`;
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

  return (
    <div className="container my-8">
      <h2 className="text-3xl font-bold mb-8">AI Text Generator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle>Create Your Text</CardTitle>
            <CardDescription>
              Enter a prompt and adjust settings to generate AI-powered text content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Your Prompt</Label>
              <Textarea 
                id="prompt"
                placeholder="Enter a detailed description of the text you want to generate..."
                value={prompt}
                onChange={handlePromptChange}
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
                  <div className="flex justify-between">
                    <Label htmlFor="creativity">Creativity</Label>
                    <span>{creativity[0]}</span>
                  </div>
                  <Slider 
                    id="creativity"
                    min={0} 
                    max={1} 
                    step={0.1} 
                    value={creativity} 
                    onValueChange={setCreativity} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="length">Length (words)</Label>
                    <span>{length[0]}</span>
                  </div>
                  <Slider 
                    id="length"
                    min={100} 
                    max={2000} 
                    step={100} 
                    value={length} 
                    onValueChange={setLength} 
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Input id="tone" placeholder="Professional" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="style">Writing Style</Label>
                    <Input id="style" placeholder="Blog post" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Input id="audience" placeholder="Professionals" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Input id="format" placeholder="Article" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={generateText} 
              className="w-full"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Text"
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              Your AI-generated text will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px] p-4 bg-cosmic-900/50 rounded-md overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-cosmic-400" />
                </div>
              ) : isEditing ? (
                <Textarea 
                  value={editableText} 
                  onChange={handleEditableTextChange} 
                  className="min-h-[380px] bg-transparent border-0 focus-visible:ring-0 resize-none"
                  placeholder="Edit your generated text here..."
                />
              ) : generatedText ? (
                <div className="text-left whitespace-pre-line">{generatedText}</div>
              ) : (
                <div className="text-muted-foreground h-full flex items-center justify-center">
                  Your generated content will appear here
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={toggleEdit}>
                  Cancel
                </Button>
                <Button onClick={saveEdit}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={toggleEdit} disabled={!generatedText}>
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  onClick={exportAsText} 
                  disabled={!generatedText}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export as .txt
                </Button>
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard} 
                  disabled={!generatedText}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default TextGenerator;
