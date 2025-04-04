
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Copy, Save, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateContent, getUserGeneratedContent } from "@/services/aiGeneration";

export function TextGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [style, setStyle] = useState("informative");
  const [wordCount, setWordCount] = useState("300");
  const [previousGenerations, setPreviousGenerations] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadPreviousGenerations();
  }, []);

  const loadPreviousGenerations = async () => {
    const content = await getUserGeneratedContent('text');
    setPreviousGenerations(content);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate text",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateContent('text', prompt, {
        style,
        wordCount: parseInt(wordCount),
      });

      if (result.error) {
        toast({
          title: "Generation Failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      setGeneratedText(result.result || "");
      loadPreviousGenerations();
      
      toast({
        title: "Text Generated",
        description: "Your AI-powered text has been created!",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "There was an error generating your text",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setIsCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Text has been copied to your clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadAsText = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([generatedText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `generated-text-${new Date().getTime()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: "Download Started",
        description: "Your text file is being downloaded",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download text file",
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
              Describe the text content you want to generate with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Text Description</Label>
              <Textarea 
                id="prompt"
                placeholder="Describe the text you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="style">Writing Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wordCount">Word Count</Label>
                <Select value={wordCount} onValueChange={setWordCount}>
                  <SelectTrigger id="wordCount">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150">Short (~150 words)</SelectItem>
                    <SelectItem value="300">Medium (~300 words)</SelectItem>
                    <SelectItem value="600">Long (~600 words)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              className="w-full"
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
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
            <CardTitle>Generated Text</CardTitle>
            <CardDescription>
              Your AI-generated content will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px] bg-cosmic-900/50 rounded-md p-4 overflow-auto whitespace-pre-wrap">
              {isGenerating ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Generating your content...</p>
                  </div>
                </div>
              ) : generatedText ? (
                <div className="text-sm">{generatedText}</div>
              ) : (
                <div className="text-muted-foreground flex justify-center items-center h-full">
                  <p className="text-center">Your generated text will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              disabled={!generatedText} 
              onClick={copyToClipboard}
            >
              {isCopied ? (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              disabled={!generatedText}
              onClick={downloadAsText}
            >
              <Download className="mr-2 h-4 w-4" />
              Export as .txt
            </Button>
          </CardFooter>
        </Card>

        {previousGenerations.length > 0 && (
          <Card className="cosmic-card lg:col-span-2 mt-4">
            <CardHeader>
              <CardTitle>Your Previous Generations</CardTitle>
              <CardDescription>
                Previously generated text content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previousGenerations.slice(0, 5).map((gen) => (
                  <div key={gen.id} className="border border-border p-4 rounded-md">
                    <div className="font-medium mb-2">"{gen.prompt}"</div>
                    <div className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {gen.result}
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setPrompt(gen.prompt);
                          setGeneratedText(gen.result);
                          const settings = gen.settings || {};
                          if (settings.style) setStyle(settings.style);
                          if (settings.wordCount) setWordCount(settings.wordCount.toString());
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Use Again
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default TextGenerator;
