
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/dashboard/Navbar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import TextGenerator from "@/components/dashboard/TextGenerator";
import ImageGenerator from "@/components/dashboard/ImageGenerator";
import MusicGenerator from "@/components/dashboard/MusicGenerator";
import MultiModalGenerator from "@/components/dashboard/MultiModalGenerator";
import { FileText, Image as ImageIcon, Music, Layers } from "lucide-react";

const Dashboard = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("dashboard");
  
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    setCurrentPage(path || "dashboard");
    
    // Create stars in the background
    const createStars = () => {
      const container = document.querySelector('body');
      if (!container) return;
      
      const existingStars = document.querySelectorAll('.star');
      existingStars.forEach(star => star.remove());
      
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random positions
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        
        // Random sizes (some stars bigger than others)
        const size = `${0.1 + Math.random() * 0.4}rem`;
        star.style.width = size;
        star.style.height = size;
        
        // Random opacity
        star.style.opacity = `${0.3 + Math.random() * 0.7}`;
        
        container.appendChild(star);
      }
    };
    
    createStars();
    
    // Recreate stars on window resize
    window.addEventListener('resize', createStars);
    
    return () => {
      window.removeEventListener('resize', createStars);
      const stars = document.querySelectorAll('.star');
      stars.forEach(star => star.remove());
    };
  }, [location.pathname]);
  
  const renderContent = () => {
    switch(currentPage) {
      case "text":
        return <TextGenerator />;
      case "image":
        return <ImageGenerator />;
      case "music":
        return <MusicGenerator />;
      case "multimodal":
        return <MultiModalGenerator />;
      default:
        return (
          <div className="container my-8">
            <h2 className="text-3xl font-bold mb-8">AI Creative Suite</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Text Generator"
                description="Create blog posts, articles, and creative writing"
                icon={<FileText className="h-6 w-6 text-cosmic-400" />}
                href="/dashboard/text"
              />
              
              <DashboardCard
                title="Image Creator"
                description="Generate stunning visuals and artwork"
                icon={<ImageIcon className="h-6 w-6 text-cosmic-400" />}
                href="/dashboard/image"
              />
              
              <DashboardCard
                title="Music Composer"
                description="Compose melodies and soundtracks"
                icon={<Music className="h-6 w-6 text-cosmic-400" />}
                href="/dashboard/music"
              />
              
              <DashboardCard
                title="Multi-Modal Studio"
                description="Combine text, image, and music generation"
                icon={<Layers className="h-6 w-6 text-cosmic-400" />}
                href="/dashboard/multimodal"
                variant="gradient"
              />
            </div>
            
            <div className="mt-12 cosmic-card p-6 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Welcome to CreativeAI Portal</h3>
              <p className="mb-4">
                This AI-powered creative suite gives you the tools to generate amazing content across multiple modalities:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Generate blog posts, articles, and creative writing with the Text Generator</li>
                <li>Create stunning visuals and artwork with the Image Creator</li>
                <li>Compose original melodies and soundtracks with the Music Composer</li>
                <li>Combine all three for immersive multi-modal content in the Multi-Modal Studio</li>
              </ul>
              <p>
                All tools feature real-time AI fine-tuning capabilities to help you refine and improve generated content.
              </p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      {renderContent()}
    </div>
  );
};

export default Dashboard;
