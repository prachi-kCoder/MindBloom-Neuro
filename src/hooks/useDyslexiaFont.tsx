
import { useState, useEffect } from 'react';

interface UseDyslexiaFontOptions {
  saveToLocalStorage?: boolean;
  applyGlobally?: boolean;
}

// Custom hook to manage dyslexia font preference
export const useDyslexiaFont = (initialValue: boolean = false, options: UseDyslexiaFontOptions = {}) => {
  const { saveToLocalStorage = true, applyGlobally = true } = options;
  const [useDyslexicFont, setUseDyslexicFont] = useState(initialValue);
  
  // Load preference from localStorage on mount
  useEffect(() => {
    if (saveToLocalStorage) {
      const savedPreference = localStorage.getItem('useDyslexicFont');
      if (savedPreference !== null) {
        setUseDyslexicFont(savedPreference === 'true');
      }
    }
  }, [saveToLocalStorage]);
  
  // Save preference to localStorage when changed
  useEffect(() => {
    if (saveToLocalStorage) {
      localStorage.setItem('useDyslexicFont', String(useDyslexicFont));
    }
    
    // Apply font to body when setting changes
    if (applyGlobally) {
      if (useDyslexicFont) {
        document.documentElement.classList.add('use-dyslexic-font');
      } else {
        document.documentElement.classList.remove('use-dyslexic-font');
      }
    }
    
    return () => {
      // Clean up if not applying globally
      if (!applyGlobally && useDyslexicFont) {
        document.documentElement.classList.remove('use-dyslexic-font');
      }
    }
  }, [useDyslexicFont, saveToLocalStorage, applyGlobally]);
  
  return { useDyslexicFont, setUseDyslexicFont };
};

export default useDyslexiaFont;
