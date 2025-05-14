
import { useState, useEffect } from 'react';

// Custom hook to manage dyslexia font preference
export const useDyslexiaFont = (initialValue: boolean = false) => {
  const [useDyslexicFont, setUseDyslexicFont] = useState(initialValue);
  
  // Load preference from localStorage on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('useDyslexicFont');
    if (savedPreference !== null) {
      setUseDyslexicFont(savedPreference === 'true');
    }
  }, []);
  
  // Save preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('useDyslexicFont', String(useDyslexicFont));
    
    // Apply font to body when setting changes
    if (useDyslexicFont) {
      document.documentElement.classList.add('use-dyslexic-font');
    } else {
      document.documentElement.classList.remove('use-dyslexic-font');
    }
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('use-dyslexic-font');
    }
  }, [useDyslexicFont]);
  
  return { useDyslexicFont, setUseDyslexicFont };
};

export default useDyslexiaFont;
