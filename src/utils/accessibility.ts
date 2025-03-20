interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  item(index: number): SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  item(index: number): SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

class AccessibilityManager {
  private speechSynthesis: SpeechSynthesis;
  private recognition: any;
  private isListening: boolean = false;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results as unknown as SpeechRecognitionResult[])
        .map(result => result.item(0)?.transcript || '')
        .join('');
      
      this.handleVoiceCommand(transcript.toLowerCase());
    };
  }

  speakText(text: string): void {
    console.log("Speaking:", text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    this.speechSynthesis.speak(utterance);
  }

  startScreenReader(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    this.speechSynthesis.speak(utterance);
  }

  stopScreenReader(): void {
    this.speechSynthesis.cancel();
  }

  startVoiceCommands(callback: (command: string) => void): void {
    if (!this.recognition) {
      console.error('Speech recognition not supported');
      return;
    }

    this.isListening = true;
    this.recognition.start();
  }

  stopVoiceCommands(): void {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
    }
  }

  private handleVoiceCommand(transcript: string): void {
    const commands = {
      'next question': () => (document.querySelector('[data-action="next-question"]') as HTMLElement)?.click(),
      'previous question': () => (document.querySelector('[data-action="prev-question"]') as HTMLElement)?.click(),
      'submit assessment': () => (document.querySelector('[data-action="submit-assessment"]') as HTMLElement)?.click(),
      'select option': (option: string) => {
        const options = document.querySelectorAll('[data-option]');
        options.forEach(opt => {
          if (opt.textContent?.toLowerCase().includes(option.toLowerCase())) {
            (opt as HTMLElement).click();
          }
        });
      },
      'start assessment': () => (window.location.href = '/assessment'),
      'go home': () => (window.location.href = '/'),
      'increase font': () => {
        document.body.style.fontSize = 
          (parseInt(getComputedStyle(document.body).fontSize) + 2) + 'px';
      }
    };

    Object.entries(commands).forEach(([command, action]) => {
      if (transcript.includes(command)) {
        action(transcript);
        return;
      }
    });
  }

  startGestureControl(): void {
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());
  }

  stopGestureControl(): void {
    document.removeEventListener('gesturestart', (e) => e.preventDefault());
    document.removeEventListener('gesturechange', (e) => e.preventDefault());
    document.removeEventListener('gestureend', (e) => e.preventDefault());
  }

  enableKeyboardNavigation(): void {
    document.body.classList.add('keyboard-nav');
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-focus');
      }
    });
  }

  disableKeyboardNavigation(): void {
    document.body.classList.remove('keyboard-nav');
    document.body.classList.remove('keyboard-focus');
  }
}

export const accessibilityManager = new AccessibilityManager();
