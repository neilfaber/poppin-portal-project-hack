
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";

export async function getUserProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_collaborators (
          id,
          user_id,
          role
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_collaborators (
          id,
          user_id,
          role
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function createProject(name: string, description: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({ name, description })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    return false;
  }
}

export async function addCollaborator(projectId: string, email: string): Promise<boolean> {
  try {
    // In a real app, you would lookup the user ID from the email
    // For demo purposes, we'll simulate this
    const mockUserId = "mock-user-id"; // In real app: getUserIdFromEmail(email)
    
    const { error } = await supabase
      .from('project_collaborators')
      .insert({
        project_id: projectId,
        user_id: mockUserId,
        role: 'editor'
      });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error adding collaborator:', error);
    return false;
  }
}
