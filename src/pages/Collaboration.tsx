
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/dashboard/Navbar";
import ProjectsList from "@/components/collaboration/ProjectsList";
import CreateProjectDialog from "@/components/collaboration/CreateProjectDialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types/project";
import { getUserProjects, createProject } from "@/services/projects";
import { supabase } from "@/integrations/supabase/client";

const Collaboration = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
    
    // Subscribe to real-time updates for projects
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          loadProjects();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const userProjects = await getUserProjects();
    setProjects(userProjects);
    setLoading(false);
  };

  const handleCreateProject = async (projectData: { name: string, description: string }) => {
    try {
      const newProject = await createProject(projectData.name, projectData.description);
      
      if (!newProject) {
        throw new Error("Failed to create project");
      }
      
      toast({
        title: "Project created",
        description: `${projectData.name} has been created successfully.`
      });
      setOpen(false);
      
      // Navigate to the new project
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Project creation failed",
        description: "There was an error creating your project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create and manage projects.",
        variant: "destructive"
      });
      navigate("/auth");
      return false;
    }
    return true;
  };

  const handleNewProjectClick = async () => {
    if (await checkAuth()) {
      setOpen(true);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container my-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Collaboration Projects</h2>
          <Button onClick={handleNewProjectClick} className="gap-2">
            <Plus className="size-4" />
            New Project
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cosmic-400" />
          </div>
        ) : (
          <>
            <ProjectsList projects={projects} />
            
            {projects.length === 0 && (
              <div className="cosmic-card p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first collaborative project to get started
                </p>
                <Button onClick={handleNewProjectClick}>Create Project</Button>
              </div>
            )}
          </>
        )}
        
        <CreateProjectDialog 
          open={open} 
          onOpenChange={setOpen} 
          onCreateProject={handleCreateProject}
        />
      </div>
    </div>
  );
};

export default Collaboration;
