import { humanizeAction } from './humanizeAction';

export class TTS {
  private static utterance: SpeechSynthesisUtterance | null = null;

  static speak(
    actionHeadline: string,
    severity: string,
    reasons: string[] = [],
    prohibitedActions: string[] = [],
    steps: string[] = [],
    onEnd?: () => void
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }

    // Cancel any active speech
    window.speechSynthesis.cancel();

    const humanAction = humanizeAction(actionHeadline);
    const speechChunks: string[] = [
      `Emergency directive. Severity: ${severity}. Priority action: ${humanAction}.`,
    ];

    if (steps && steps.length > 0) {
      speechChunks.push('Follow these tactical steps:');
      steps.forEach((step, idx) => {
        speechChunks.push(`Step ${idx + 1}: ${step}`);
      });
    }

    if (prohibitedActions && prohibitedActions.length > 0) {
      speechChunks.push('Strict life safety prohibitions:');
      prohibitedActions.forEach((p) => {
        speechChunks.push(`Do not: ${p}`);
      });
    }

    const fullText = speechChunks.join(' ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    TTS.utterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  static stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  static isSpeaking(): boolean {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.speaking;
    }
    return false;
  }
}
