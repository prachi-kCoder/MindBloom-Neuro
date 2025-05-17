
/**
 * Enhanced text-to-speech utility using the Web Speech API
 * with support for accessibility features
 */

// Configure speech synthesis
let speechSynthesis: SpeechSynthesis | null = null;
let voices: SpeechSynthesisVoice[] = [];
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Initialize speech synthesis
const initSpeech = (): boolean => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    speechSynthesis = window.speechSynthesis;
    
    // Get voices - this is important for browser compatibility
    const loadVoices = () => {
      voices = speechSynthesis.getVoices();
      console.log("Loaded voices:", voices.length);
    };
    
    // Some browsers need the onvoiceschanged event
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Load voices immediately as well (for browsers that don't fire the event)
    loadVoices();
    
    return true;
  }
  
  console.warn("Speech synthesis not supported in this browser");
  return false;
};

interface SpeechOptions {
  rate?: number;    // 0.1 to 10
  pitch?: number;   // 0 to 2
  volume?: number;  // 0 to 1
  lang?: string;    // e.g., 'en-US'
  voiceURI?: string; // Specific voice to use
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (e: SpeechSynthesisErrorEvent) => void;
  onPause?: () => void;
  onResume?: () => void;
}

/**
 * Get all available voices
 */
export const getVoices = (): SpeechSynthesisVoice[] => {
  if (!speechSynthesis) {
    if (!initSpeech()) return [];
  }
  
  return speechSynthesis.getVoices();
};

/**
 * Speaks the provided text using the Web Speech API
 */
export const speak = (text: string, options: SpeechOptions = {}): SpeechSynthesisUtterance | null => {
  if (!speechSynthesis) {
    if (!initSpeech()) return null;
  }
  
  // If there's an utterance already in progress, cancel it
  if (currentUtterance && speechSynthesis?.speaking) {
    speechSynthesis.cancel();
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set default options
  utterance.rate = options.rate !== undefined ? options.rate : 0.9;
  utterance.pitch = options.pitch !== undefined ? options.pitch : 1;
  utterance.volume = options.volume !== undefined ? options.volume : 1;
  utterance.lang = options.lang || 'en-US';
  
  // Set event callbacks if provided
  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;
  if (options.onError) utterance.onerror = options.onError;
  if (options.onPause) utterance.onpause = options.onPause;
  if (options.onResume) utterance.onresume = options.onResume;
  
  // Get available voices (in case they weren't loaded initially)
  if (voices.length === 0) {
    voices = speechSynthesis.getVoices();
  }
  
  // Try to find a specified voice
  if (options.voiceURI && voices.length > 0) {
    const requestedVoice = voices.find(voice => voice.voiceURI === options.voiceURI);
    if (requestedVoice) {
      utterance.voice = requestedVoice;
    }
  } else if (voices.length > 0) {
    // Try to find a more natural sounding voice
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Daniel') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Google') ||
      voice.name.includes('Natural')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
  }
  
  // Log for debugging
  console.log('Speaking text:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
  console.log('Using voice:', utterance.voice?.name || 'Default');
  console.log('Rate:', utterance.rate, 'Pitch:', utterance.pitch, 'Volume:', utterance.volume);
  
  // Save reference to current utterance
  currentUtterance = utterance;
  
  // Fix for Chrome issue where utterances aren't spoken after a while
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    setTimeout(() => {
      speechSynthesis.speak(utterance);
    }, 50);
  } else {
    speechSynthesis.speak(utterance);
  }
  
  return utterance;
};

/**
 * Stops any ongoing speech
 */
export const stopSpeaking = () => {
  if (speechSynthesis) {
    speechSynthesis.cancel();
    currentUtterance = null;
  }
};

/**
 * Pauses the current speech
 */
export const pauseSpeaking = () => {
  if (speechSynthesis && speechSynthesis.speaking) {
    speechSynthesis.pause();
  }
};

/**
 * Resumes the current speech if paused
 */
export const resumeSpeaking = () => {
  if (speechSynthesis && speechSynthesis.paused) {
    speechSynthesis.resume();
  }
};

/**
 * Checks if speech synthesis is currently speaking
 */
export const isSpeaking = (): boolean => {
  return speechSynthesis ? speechSynthesis.speaking : false;
};

/**
 * Checks if speech synthesis is currently paused
 */
export const isPaused = (): boolean => {
  return speechSynthesis ? speechSynthesis.paused : false;
};

// Initialize on import
if (typeof window !== 'undefined') {
  initSpeech();
}
