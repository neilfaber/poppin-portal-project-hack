
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play, Pause, SkipBack, Download } from "lucide-react";

export function MusicGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [duration, setDuration] = useState([30]);
  const [genre, setGenre] = useState("electronic");
  const [mood, setMood] = useState([5]);
  const { toast } = useToast();

  const generateMusic = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate music",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // In a real implementation, this would call an AI music generation API
      setHasGenerated(true);
      
      toast({
        title: "Music Generated",
        description: "Your AI-composed music has been created!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your music. Please try again.",
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
            
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 pt-4">
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
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="mood">Mood (Calm to Energetic)</Label>
                    <span>{mood[0]}/10</span>
                  </div>
                  <Slider 
                    id="mood"
                    min={1} 
                    max={10} 
                    step={1} 
                    value={mood} 
                    onValueChange={setMood} 
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instruments">Primary Instrument</Label>
                    <Select defaultValue="piano">
                      <SelectTrigger id="instruments">
                        <SelectValue placeholder="Select instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piano">Piano</SelectItem>
                        <SelectItem value="guitar">Guitar</SelectItem>
                        <SelectItem value="strings">Strings</SelectItem>
                        <SelectItem value="synth">Synthesizer</SelectItem>
                        <SelectItem value="drums">Drums</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tempo">Tempo (BPM)</Label>
                    <Select defaultValue="120">
                      <SelectTrigger id="tempo">
                        <SelectValue placeholder="Select tempo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">60 BPM (Very Slow)</SelectItem>
                        <SelectItem value="90">90 BPM (Slow)</SelectItem>
                        <SelectItem value="120">120 BPM (Moderate)</SelectItem>
                        <SelectItem value="140">140 BPM (Fast)</SelectItem>
                        <SelectItem value="180">180 BPM (Very Fast)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="key">Key</Label>
                    <Select defaultValue="c_major">
                      <SelectTrigger id="key">
                        <SelectValue placeholder="Select key" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="c_major">C Major</SelectItem>
                        <SelectItem value="a_minor">A Minor</SelectItem>
                        <SelectItem value="g_major">G Major</SelectItem>
                        <SelectItem value="e_minor">E Minor</SelectItem>
                        <SelectItem value="d_major">D Major</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="structure">Structure</Label>
                    <Select defaultValue="verse_chorus">
                      <SelectTrigger id="structure">
                        <SelectValue placeholder="Select structure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ambient">Ambient/No Structure</SelectItem>
                        <SelectItem value="verse_chorus">Verse-Chorus</SelectItem>
                        <SelectItem value="aaba">AABA Form</SelectItem>
                        <SelectItem value="loop">Loop-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={generateMusic} 
              className="w-full"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
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
              Your AI-composed music will be ready to play here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center min-h-[300px] p-4 bg-cosmic-900/50 rounded-md">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-10 w-10 animate-spin text-cosmic-400 mb-4" />
                  <p className="text-sm text-muted-foreground">Composing your melody...</p>
                </div>
              ) : hasGenerated ? (
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
                      {prompt}
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="icon">
                      <SkipBack className="h-5 w-5" />
                    </Button>
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
                    <Button variant="outline" size="icon">
                      <Download className="h-5 w-5" />
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
          <CardFooter>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>0:00</span>
                <span>{duration[0]}s</span>
              </div>
              <div className="h-1 w-full bg-cosmic-700 rounded-full overflow-hidden">
                {isPlaying && hasGenerated && (
                  <div 
                    className="h-full bg-cosmic-400"
                    style={{ 
                      width: '50%',
                      transition: 'width 1s linear'
                    }}
                  ></div>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default MusicGenerator;
