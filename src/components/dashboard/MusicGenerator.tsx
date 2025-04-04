
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Play, Pause, Download, Save } from "lucide-react";
import { generateContent, getUserGeneratedContent } from "@/services/aiGeneration";

export function MusicGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [genre, setGenre] = useState("electronic");
  const [mood, setMood] = useState("relaxed");
  const [duration, setDuration] = useState([30]);
  const [musicGenerated, setMusicGenerated] = useState(false);
  const [musicData, setMusicData] = useState<any>(null);
  const [previousGenerations, setPreviousGenerations] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadPreviousGenerations();
  }, []);

  const loadPreviousGenerations = async () => {
    const content = await getUserGeneratedContent('music');
    setPreviousGenerations(content);
  };

  const generateMusic = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate music",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setIsPlaying(false);
    setMusicGenerated(false);
    
    try {
      const result = await generateContent('music', prompt, {
        genre,
        mood,
        duration: duration[0],
      });

      if (result.error) {
        toast({
          title: "Generation Failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      // In a real app, this would be a URL to an audio file
      // For demo, we set the JSON string that contains the music metadata
      const parsedData = JSON.parse(result.result || "{}");
      setMusicData(parsedData);
      setMusicGenerated(true);
      loadPreviousGenerations();
      
      toast({
        title: "Music Generated",
        description: "Your AI-composed music has been created!",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "There was an error generating your music",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!musicGenerated) return;
    setIsPlaying(!isPlaying);
  };

  const saveMusic = () => {
    if (!musicGenerated) return;
    
    toast({
      title: "Music Saved",
      description: "Your generated music has been saved to your library",
    });
  };

  return (
    <div className="container my-8">
      <h2 className="text-3xl font-bold mb-8">AI Music Composer</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle>Create Your Music</CardTitle>
            <CardDescription>
              Describe the music you want to generate with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Music Description</Label>
              <Textarea 
                id="prompt"
                placeholder="Describe the music you want to create (e.g., 'A calm piano melody with ambient sounds')..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="mood">Mood</Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger id="mood">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relaxed">Relaxed</SelectItem>
                      <SelectItem value="energetic">Energetic</SelectItem>
                      <SelectItem value="happy">Happy</SelectItem>
                      <SelectItem value="sad">Sad</SelectItem>
                      <SelectItem value="dramatic">Dramatic</SelectItem>
                      <SelectItem value="mysterious">Mysterious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
          </CardContent>
          <CardFooter>
            <Button 
              onClick={generateMusic} 
              className="w-full"
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Composing...
                </>
              ) : (
                "Generate Music"
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle>Generated Music</CardTitle>
            <CardDescription>
              Your AI-composed melody will be ready to play here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center min-h-[300px] p-4 bg-cosmic-900/50 rounded-md">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-10 w-10 animate-spin text-cosmic-400 mb-4" />
                  <p className="text-sm text-muted-foreground">Composing your melody...</p>
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
                      {musicData?.title || prompt}
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button 
                      variant="default" 
                      size="icon" 
                      className="h-12 w-12 rounded-full"
                      onClick={togglePlayback}
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" disabled={!musicGenerated} onClick={generateMusic}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            <Button variant="outline" disabled={!musicGenerated} onClick={saveMusic}>
              <Save className="mr-2 h-4 w-4" />
              Save to Library
            </Button>
          </CardFooter>
        </Card>

        {previousGenerations.length > 0 && (
          <Card className="cosmic-card lg:col-span-2 mt-4">
            <CardHeader>
              <CardTitle>Your Music Library</CardTitle>
              <CardDescription>
                Previously generated music compositions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {previousGenerations.slice(0, 5).map((gen) => {
                  const parsedData = JSON.parse(gen.result || "{}");
                  return (
                    <div key={gen.id} className="py-3 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{gen.prompt}</h4>
                        <p className="text-sm text-muted-foreground">
                          {parsedData.genre || 'Unknown genre'} • {parsedData.duration || '30'} seconds
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setPrompt(gen.prompt);
                            const settings = gen.settings || {};
                            if (settings.genre) setGenre(settings.genre);
                            if (settings.mood) setMood(settings.mood);
                            if (settings.duration) setDuration([settings.duration]);
                            setMusicData(parsedData);
                            setMusicGenerated(true);
                          }}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Use
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default MusicGenerator;
