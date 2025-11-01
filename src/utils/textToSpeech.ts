
// TextToSpeech utility for accessibility
let speech: SpeechSynthesisUtterance | null = null;
let _isSpeaking = false; // Using underscore to avoid naming conflicts

// Check if speech synthesis is available
const isSpeechAvailable = (): boolean => {
  return 'speechSynthesis' in window;
};

// Stop any ongoing speech
export const stopSpeaking = (): void => {
  if (isSpeechAvailable()) {
    window.speechSynthesis.cancel();
    _isSpeaking = false;
  }
};

// Check if speaking is active
export const isSpeaking = (): boolean => {
  return _isSpeaking;
};

// Interface for speech options
interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

// Speak text with configurable options
export function speak(text: string): void;
export function speak(text: string, rate: number, pitch?: number, volume?: number): void;
export function speak(text: string, options: SpeechOptions): void;
export function speak(
  text: string, 
  rateOrOptions?: number | SpeechOptions, 
  pitch?: number, 
  volume?: number
): void {
  if (!isSpeechAvailable()) {
    console.warn("Speech synthesis is not available in this browser");
    return;
  }

  // Cancel any previous speech
  stopSpeaking();

  // Create a new utterance if one doesn't exist or reuse existing
  speech = new SpeechSynthesisUtterance(text);
  
  let options: SpeechOptions = {};
  
  // Handle different parameter formats
  if (typeof rateOrOptions === 'number') {
    // Legacy format: speak(text, rate, pitch, volume)
    options = {
      rate: rateOrOptions,
      pitch: pitch ?? 1.0,
      volume: volume ?? 1.0
    };
  } else if (rateOrOptions && typeof rateOrOptions === 'object') {
    // New format: speak(text, options)
    options = rateOrOptions;
  }
  
  // Configure speech settings
  speech.rate = options.rate ?? 1.0; // Speed: 0.1 to 10
  speech.pitch = options.pitch ?? 1.0; // Pitch: 0 to 2
  speech.volume = options.volume ?? 1.0; // Volume: 0 to 1
  speech.lang = options.lang ?? 'en-US'; // Language code
  
  try {
    // For better voice quality, try to get a voice matching the language
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      // Set default voice
      speech.voice = voices[0];
      
      // Try to find a voice matching the selected language
      const langVoice = voices.find(voice => 
        voice.lang.startsWith(options.lang?.split('-')[0] || 'en')
      );
      
      // As a fallback, try to find any voice with the exact lang code
      const exactLangVoice = voices.find(voice => 
        voice.lang === (options.lang ?? 'en-US')
      );
      
      if (exactLangVoice) {
        speech.voice = exactLangVoice;
      } else if (langVoice) {
        speech.voice = langVoice;
      }
    }
    
    // Set up event handlers if provided
    if (options.onStart) {
      speech.onstart = options.onStart;
    }
    
    if (options.onEnd) {
      speech.onend = () => {
        _isSpeaking = false;
        if (options.onEnd) options.onEnd();
      };
    } else {
      speech.onend = () => {
        _isSpeaking = false;
      };
    }
    
    if (options.onError) {
      speech.onerror = options.onError;
    }
    
    // Actually speak the text
    window.speechSynthesis.speak(speech);
    _isSpeaking = true;
  } catch (error) {
    _isSpeaking = false;
    console.error("Error using speech synthesis:", error);
  }
};

// Initialize voices when the page loads (fixes issues in some browsers)
export const initVoices = (): void => {
  if (isSpeechAvailable()) {
    // Force speechSynthesis to load voices
    window.speechSynthesis.getVoices();
    
    // Chrome and some browsers need this event
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }
};

// Initialize on import
initVoices();
