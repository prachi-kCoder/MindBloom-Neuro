
// TextToSpeech utility for accessibility
let speech: SpeechSynthesisUtterance | null = null;

// Check if speech synthesis is available
const isSpeechAvailable = (): boolean => {
  return 'speechSynthesis' in window;
};

// Stop any ongoing speech
export const stopSpeaking = (): void => {
  if (isSpeechAvailable()) {
    window.speechSynthesis.cancel();
  }
};

// Speak text with configurable options
export const speak = (text: string, rate: number = 1.0, pitch: number = 1.0, volume: number = 1.0): void => {
  if (!isSpeechAvailable()) {
    console.warn("Speech synthesis is not available in this browser");
    return;
  }

  // Cancel any previous speech
  stopSpeaking();

  // Create a new utterance if one doesn't exist or reuse existing
  speech = new SpeechSynthesisUtterance(text);
  
  // Configure speech settings
  speech.rate = rate; // Speed: 0.1 to 10
  speech.pitch = pitch; // Pitch: 0 to 2
  speech.volume = volume; // Volume: 0 to 1
  
  try {
    // For better voice quality, try to get a female voice (often better for children)
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      // Set default voice
      speech.voice = voices[0];
      
      // Try to find a female English voice
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') && 
        voice.lang.includes('en')
      );
      
      // As a fallback, any English voice
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en')
      );
      
      if (femaleVoice) {
        speech.voice = femaleVoice;
      } else if (englishVoice) {
        speech.voice = englishVoice;
      }
    }
    
    // Actually speak the text
    window.speechSynthesis.speak(speech);
  } catch (error) {
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
