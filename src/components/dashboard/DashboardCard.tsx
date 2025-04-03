
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
  variant?: "default" | "gradient";
}

export function DashboardCard({
  title,
  description,
  icon,
  href,
  className,
  variant = "default"
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "cosmic-card overflow-hidden transition-all duration-300 hover:scale-[1.02]",
        variant === "gradient" && "cosmic-glow",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{/* Add any content here if needed */}</CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={href}>Get Started</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DashboardCard;
