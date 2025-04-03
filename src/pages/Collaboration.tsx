
import { useState } from "react";
import Navbar from "@/components/dashboard/Navbar";
import ProjectsList from "@/components/collaboration/ProjectsList";
import CreateProjectDialog from "@/components/collaboration/CreateProjectDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  collaborators: string[];
}

const Collaboration = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateProject = (project: Omit<Project, 'id' | 'createdAt' | 'createdBy' | 'collaborators'>) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: project.name,
      description: project.description,
      createdAt: new Date().toISOString(),
      createdBy: 'John Doe', // This would be the current user in a real app
      collaborators: []
    };
    
    setProjects([...projects, newProject]);
    toast({
      title: "Project created",
      description: `${project.name} has been created successfully.`
    });
    setOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container my-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Collaboration Projects</h2>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="size-4" />
            New Project
          </Button>
        </div>
        
        <ProjectsList projects={projects} />
        
        <CreateProjectDialog 
          open={open} 
          onOpenChange={setOpen} 
          onCreateProject={handleCreateProject}
        />
        
        {projects.length === 0 && (
          <div className="cosmic-card p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first collaborative project to get started
            </p>
            <Button onClick={() => setOpen(true)}>Create Project</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collaboration;
