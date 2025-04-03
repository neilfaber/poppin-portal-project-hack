
import { useState } from "react";
import { Project } from "@/pages/Collaboration";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ShareDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ project, open, onOpenChange }: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const projectLink = `${window.location.origin}/project/${project.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(projectLink);
    setCopied(true);
    toast({
      title: "Link copied",
      description: "Project link has been copied to clipboard"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const inviteCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${email}`
    });
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="link">Project Link</Label>
            <div className="flex items-center gap-2">
              <Input
                id="link"
                value={projectLink}
                readOnly
                className="flex-1"
              />
              <Button size="icon" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Anyone with this link can view this project
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or invite directly
              </span>
            </div>
          </div>

          <form onSubmit={inviteCollaborator}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="coworker@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!email.trim()}>
                  Invite
                </Button>
              </div>
            </div>
          </form>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
