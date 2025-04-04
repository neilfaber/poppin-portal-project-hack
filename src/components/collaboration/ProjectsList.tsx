
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Project } from "@/types/project";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareDialog } from "./ShareDialog";
import { Users, Clock, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProjectsListProps {
  projects: Project[];
}

const ProjectsList = ({ projects }: ProjectsListProps) => {
  const navigate = useNavigate();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleShareClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
    setShareDialogOpen(true);
  };

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card 
          key={project.id} 
          className="cosmic-card cursor-pointer hover:border-cosmic-500 transition-all"
          onClick={() => navigate(`/project/${project.id}`)}
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <span className="truncate">{project.name}</span>
              <Badge variant="outline" className="ml-2 shrink-0">
                New
              </Badge>
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description || "No description provided."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>Created {formatDistanceToNow(new Date(project.created_at))} ago</span>
            </div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              <span>
                {!project.project_collaborators || project.project_collaborators.length === 0
                  ? "No collaborators yet"
                  : `${project.project_collaborators.length} collaborator${project.project_collaborators.length !== 1 ? "s" : ""}`}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto gap-2"
              onClick={(e) => handleShareClick(project, e)}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </Card>
      ))}

      {selectedProject && (
        <ShareDialog
          project={selectedProject}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
        />
      )}
    </div>
  );
};

export default ProjectsList;
