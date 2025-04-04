
import { supabase } from "@/integrations/supabase/client";

export type ContentType = 'text' | 'image' | 'music';

export interface GenerationSettings {
  [key: string]: any;
}

export interface GenerationResult {
  id?: string;
  prompt: string;
  result: string | null;
  settings: GenerationSettings;
  error?: string;
}

export async function generateContent(
  contentType: ContentType, 
  prompt: string, 
  settings: GenerationSettings = {},
  projectId?: string
): Promise<GenerationResult> {
  try {
    // Call the appropriate edge function
    const { data: generationData, error: generationError } = await supabase.functions.invoke(
      `generate-${contentType}`,
      {
        body: { prompt, settings }
      }
    );

    if (generationError) {
      throw new Error(`Error calling generate-${contentType}: ${generationError.message}`);
    }

    if (!generationData?.result) {
      throw new Error('No result returned from generation function');
    }

    // Store the result in Supabase
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    // If we have a logged-in user, save the generated content
    if (userData?.user) {
      const { data, error } = await supabase
        .from('generated_content')
        .insert({
          user_id: userData.user.id,
          project_id: projectId,
          content_type: contentType,
          prompt: prompt,
          result: generationData.result,
          settings: settings
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving generated content:', error);
      }

      return {
        id: data?.id,
        prompt,
        result: generationData.result,
        settings
      };
    }

    // If user is not logged in, just return the result without storing
    return {
      prompt,
      result: generationData.result,
      settings
    };
  } catch (error: any) {
    console.error(`Error in generateContent for ${contentType}:`, error);
    return {
      prompt,
      result: null,
      settings,
      error: error.message
    };
  }
}

export async function getUserGeneratedContent(contentType?: ContentType) {
  try {
    let query = supabase.from('generated_content').select('*');
    
    if (contentType) {
      query = query.eq('content_type', contentType);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user generated content:', error);
    return [];
  }
}

export async function getProjectGeneratedContent(projectId: string, contentType?: ContentType) {
  try {
    let query = supabase
      .from('generated_content')
      .select('*')
      .eq('project_id', projectId);
    
    if (contentType) {
      query = query.eq('content_type', contentType);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching project generated content:', error);
    return [];
  }
}
