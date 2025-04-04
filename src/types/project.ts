
export interface ProjectCollaborator {
  id: string;
  user_id: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  project_collaborators?: ProjectCollaborator[];
}
