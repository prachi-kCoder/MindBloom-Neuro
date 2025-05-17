
import { useRef } from 'react';

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play calculation sound effect
  const playCalculationSound = (animation: string = 'processing') => {
    // Use different sounds based on the animation type
    let soundEffect = '/sounds/machine-calculation.mp3'; // Default sound
    
    switch (animation) {
      case 'add':
        soundEffect = '/sounds/add.mp3';
        break;
      case 'subtract':
        soundEffect = '/sounds/subtract.mp3';
        break;
      case 'multiply':
        soundEffect = '/sounds/multiply.mp3';
        break;
      case 'divide':
        soundEffect = '/sounds/divide.mp3';
        break;
      case 'success':
        soundEffect = '/sounds/success.mp3';
        break;
      default:
        soundEffect = '/sounds/machine-calculation.mp3';
    }
    
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(soundEffect);
    } else {
      audioRef.current.src = soundEffect;
    }
    
    audioRef.current.play().catch(e => console.log("Audio playback failed", e));
  };

  return { playCalculationSound };
};
