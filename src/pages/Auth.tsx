
import { useEffect } from 'react';
import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Auth = () => {
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
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-cosmic-400 to-cosmic-600">
            CreativeAI Portal
          </span>
        </div>
        <Button variant="ghost" onClick={() => navigate('/')}>
          Home
        </Button>
      </header>
      
      <AuthForm />
    </div>
  );
};

export default Auth;
