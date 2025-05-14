
/**
 * Simple text-to-speech utility using the Web Speech API
 */

// Configure speech synthesis
let speechSynthesis: SpeechSynthesis | null = null;
let voices: SpeechSynthesisVoice[] = [];

// Initialize speech synthesis
const initSpeech = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    speechSynthesis = window.speechSynthesis;
    voices = speechSynthesis.getVoices();
    
    // If voices aren't loaded yet, wait for them
    if (voices.length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
      };
    }
    
    return true;
  }
  
  console.warn("Speech synthesis not supported in this browser");
  return false;
};

/**
 * Speaks the provided text using the Web Speech API
 */
export const speak = (text: string, options: {
  rate?: number,  // 0.1 to 10
  pitch?: number, // 0 to 2
  volume?: number // 0 to 1
  lang?: string   // e.g., 'en-US'
} = {}) => {
  if (!speechSynthesis) {
    if (!initSpeech()) return;
  }
  
  // Cancel any ongoing speech
  speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set default options
  utterance.rate = options.rate || 0.9;
  utterance.pitch = options.pitch || 1;
  utterance.volume = options.volume || 1;
  utterance.lang = options.lang || 'en-US';
  
  // Try to find a more natural sounding voice
  const preferredVoice = voices.find(voice => 
    voice.name.includes('Daniel') || 
    voice.name.includes('Samantha') || 
    voice.name.includes('Google')
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  speechSynthesis.speak(utterance);
};

/**
 * Stops any ongoing speech
 */
export const stopSpeaking = () => {
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
};

// Initialize on import
if (typeof window !== 'undefined') {
  initSpeech();
}
