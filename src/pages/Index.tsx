
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Rocket, FileText, Image, Music, Layers } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen">
      <header className="container px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-cosmic-400" />
          <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-cosmic-400 to-cosmic-600">
            CreativeAI Portal
          </span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
          <Button onClick={() => navigate('/auth?tab=signup')}>
            Get Started
          </Button>
        </div>
      </header>

      <main>
        <section className="container px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <div className="cosmic-glow max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-cosmic-300 to-cosmic-500">AI-Powered</span> Content Across Multiple Modalities
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-300">
              Generate text, images, music, and multi-modal content with our advanced AI tools
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2">
              Start Creating <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              Explore Features
            </Button>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="cosmic-card p-6 text-center">
              <FileText className="h-10 w-10 text-cosmic-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Text Generation</h3>
              <p className="text-gray-300">Create blog articles, summaries, or personalized email drafts</p>
            </div>
            
            <div className="cosmic-card p-6 text-center">
              <Image className="h-10 w-10 text-cosmic-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Image Creation</h3>
              <p className="text-gray-300">Generate artwork, posters, or animations with AI</p>
            </div>
            
            <div className="cosmic-card p-6 text-center">
              <Music className="h-10 w-10 text-cosmic-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Music Composition</h3>
              <p className="text-gray-300">Create melodies based on mood or genre input</p>
            </div>
            
            <div className="cosmic-card cosmic-glow p-6 text-center">
              <Layers className="h-10 w-10 text-cosmic-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Multi-Modal Creation</h3>
              <p className="text-gray-300">Combine text, image, and music generation in one system</p>
            </div>
          </div>
        </section>
        
        <section className="container px-4 py-20">
          <div className="cosmic-card p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Real-Time AI Fine-Tuning</h2>
                <p className="text-lg mb-6">
                  Our platform allows you to refine and improve AI-generated content in real-time.
                  Adjust parameters, provide feedback, and iterate until you achieve perfect results.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-cosmic-400 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-cosmic-900"></div>
                    </div>
                    <span>Adjust creativity levels and other parameters</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-cosmic-400 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-cosmic-900"></div>
                    </div>
                    <span>Get multiple variations of generated content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-cosmic-400 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-cosmic-900"></div>
                    </div>
                    <span>Combine different modalities seamlessly</span>
                  </li>
                </ul>
                <Button className="mt-8" onClick={() => navigate('/auth')}>
                  Try It Now
                </Button>
              </div>
              
              <div className="rounded-xl overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 w-full h-60 lg:h-80 bg-cosmic-800 rounded-xl flex items-center justify-center">
                  <div className="animate-glow text-center">
                    <p className="text-lg mb-3">AI Content Preview</p>
                    <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="h-12 w-full bg-cosmic-700/50 rounded animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="container px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Creative Process?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join CreativeAI Portal today and unleash the power of AI-driven content creation.
          </p>
          <Button size="lg" onClick={() => navigate('/auth')}>
            Get Started for Free
          </Button>
        </section>
      </main>
      
      <footer className="container px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-cosmic-700 pt-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Rocket className="h-5 w-5 text-cosmic-400" />
            <span className="font-bold">CreativeAI Portal</span>
          </div>
          <div className="text-sm text-gray-400">
            © 2025 CreativeAI Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
