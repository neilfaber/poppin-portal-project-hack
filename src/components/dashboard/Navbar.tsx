
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Rocket, Menu, X, User, Settings, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-cosmic-400" />
            <span className="font-bold text-xl hidden sm:block">CreativeAI Portal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link to="/dashboard/text" className="text-sm font-medium hover:text-primary">
              Text Generator
            </Link>
            <Link to="/dashboard/image" className="text-sm font-medium hover:text-primary">
              Image Creator
            </Link>
            <Link to="/dashboard/music" className="text-sm font-medium hover:text-primary">
              Music Composer
            </Link>
            <Link to="/dashboard/multimodal" className="text-sm font-medium hover:text-primary">
              Multi-Modal Studio
            </Link>
            <Link to="/collaboration" className="text-sm font-medium hover:text-primary flex items-center gap-1">
              <Users className="h-4 w-4" />
              Collaboration
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => navigate('/collaboration')}>
            New Project
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/')}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden px-4 py-4 space-y-2 border-t border-border">
          <Link 
            to="/dashboard" 
            className="block py-2 px-4 rounded-md hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/dashboard/text" 
            className="block py-2 px-4 rounded-md hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            Text Generator
          </Link>
          <Link 
            to="/dashboard/image" 
            className="block py-2 px-4 rounded-md hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            Image Creator
          </Link>
          <Link 
            to="/dashboard/music" 
            className="block py-2 px-4 rounded-md hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            Music Composer
          </Link>
          <Link 
            to="/dashboard/multimodal" 
            className="block py-2 px-4 rounded-md hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            Multi-Modal Studio
          </Link>
          <Link 
            to="/collaboration" 
            className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Users className="h-4 w-4" />
            Collaboration
          </Link>
          <div className="pt-2">
            <Button className="w-full" onClick={() => {
              navigate('/collaboration');
              setMobileMenuOpen(false);
            }}>
              New Project
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
