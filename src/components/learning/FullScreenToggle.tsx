
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize } from 'lucide-react';
import { motion } from 'framer-motion';

interface FullScreenToggleProps {
  containerId: string;
  className?: string;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

const FullScreenToggle: React.FC<FullScreenToggleProps> = ({ 
  containerId, 
  className = '',
  onFullscreenChange 
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    const container = document.getElementById(containerId);
    
    if (!document.fullscreenElement) {
      if (container?.requestFullscreen) {
        container.requestFullscreen()
          .then(() => {
            setIsFullScreen(true);
            if (onFullscreenChange) onFullscreenChange(true);
          })
          .catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message}`));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => {
            setIsFullScreen(false);
            if (onFullscreenChange) onFullscreenChange(false);
          })
          .catch(err => console.error(`Error attempting to exit full-screen mode: ${err.message}`));
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      const fullscreenState = Boolean(document.fullscreenElement);
      setIsFullScreen(fullscreenState);
      if (onFullscreenChange) onFullscreenChange(fullscreenState);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [onFullscreenChange]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFullScreen}
      className={`rounded-full ${className}`}
      title={isFullScreen ? "Exit full screen" : "Enter full screen"}
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
      </motion.div>
    </Button>
  );
};

export default FullScreenToggle;
