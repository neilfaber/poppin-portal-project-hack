
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, settings } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In a real implementation, this would call an AI API like OpenAI
    // For now, we'll simulate text generation with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a response based on the prompt
    const wordCount = settings?.wordCount || 300;
    const style = settings?.style || 'informative';
    
    // Simple demo text generation
    let generatedText = `Generated text for prompt: "${prompt}"\n\n`;
    
    if (style === 'creative') {
      generatedText += `Once upon a time, in a world where ${prompt} was reality, the possibilities were endless. `;
      generatedText += `The concept of ${prompt} transformed how people thought about creativity and innovation. `;
    } else if (style === 'professional') {
      generatedText += `This analysis examines the implications of ${prompt} in a professional context. `;
      generatedText += `Several key factors must be considered when evaluating the impact of ${prompt} on organizational performance. `;
    } else {
      generatedText += `${prompt} is an interesting concept that warrants further exploration. `;
      generatedText += `Many experts have different perspectives on how ${prompt} can be applied in various situations. `;
    }
    
    // Add some lorem ipsum to reach approximate word count
    generatedText += `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

    console.log("Generated text for prompt:", prompt);
    
    return new Response(JSON.stringify({ result: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
