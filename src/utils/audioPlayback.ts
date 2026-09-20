// Audio synthesis and playback controller for Civic Ledger

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  progressPercent: number;
  elapsedSeconds: number;
  totalDurationSeconds: number;
  activeLanguage: 'sw' | 'lg' | 'en';
}

class AudioPlayerEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private timerInterval: number | null = null;
  private isSynthesizing = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // Play an authentic civic broadcast intro chime (reminiscent of East African news chimes e.g. KBC / UBC)
  public playBroadcastChime(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // 3-note harmonic chime (F4 - A4 - C5)
      const notes = [349.23, 440.0, 523.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.38);
      });
    } catch {
      // AudioContext might be muted or blocked by policy
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  // Select the most appropriate voice for Swahili, Luganda, or English
  public pickVoiceForLanguage(lang: 'sw' | 'lg' | 'en'): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    if (lang === 'sw') {
      // Look for Swahili voices
      const swahiliVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('sw') ||
          v.name.toLowerCase().includes('swahili') ||
          v.name.toLowerCase().includes('kenya') ||
          v.name.toLowerCase().includes('tanzania')
      );
      if (swahiliVoice) return swahiliVoice;
    }

    if (lang === 'lg') {
      // Look for Luganda or African English/Bantu voices
      const lugandaVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('lg') ||
          v.name.toLowerCase().includes('uganda') ||
          v.name.toLowerCase().includes('luganda')
      );
      if (lugandaVoice) return lugandaVoice;
      // Fallback: Swahili voice or South African / Kenyan English voice
      const africanVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('ke') ||
          v.lang.toLowerCase().includes('za') ||
          v.lang.toLowerCase().includes('ng')
      );
      if (africanVoice) return africanVoice;
    }

    // Default fallback: clear high quality English / multilingual voice
    const naturalVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('premium')
    );
    return naturalVoice || voices[0] || null;
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.timerInterval) {
      window.clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isSynthesizing = false;
  }

  public pause(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public speakSentences({
    sentences,
    language,
    rate = 1.0,
    volume = 1.0,
    startIndex = 0,
    onSentenceChange,
    onProgress,
    onEnd,
    onError,
  }: {
    sentences: string[];
    language: 'sw' | 'lg' | 'en';
    rate?: number;
    volume?: number;
    startIndex?: number;
    onSentenceChange: (index: number) => void;
    onProgress: (elapsed: number, percent: number) => void;
    onEnd: () => void;
    onError: (err: unknown) => void;
  }): void {
    this.stop();

    if (!this.synth || sentences.length === 0) {
      onEnd();
      return;
    }

    // Play pleasant broadcast announcement chime first
    this.playBroadcastChime();

    let currentIndex = Math.max(0, Math.min(startIndex, sentences.length - 1));
    this.isSynthesizing = true;

    // Calculate approximate speech time per sentence
    const totalWords = sentences.join(' ').split(/\s+/).length;
    const wordsPerMinute = 135 * rate;
    const estimatedTotalSeconds = Math.max(20, Math.round((totalWords / wordsPerMinute) * 60));

    let elapsedSeconds = 0;
    this.timerInterval = window.setInterval(() => {
      elapsedSeconds += 1;
      const progress = Math.min(99, Math.round((elapsedSeconds / estimatedTotalSeconds) * 100));
      onProgress(elapsedSeconds, progress);
    }, 1000);

    const speakCurrent = () => {
      if (currentIndex >= sentences.length) {
        if (this.timerInterval) {
          window.clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
        this.isSynthesizing = false;
        onProgress(estimatedTotalSeconds, 100);
        onEnd();
        return;
      }

      onSentenceChange(currentIndex);
      const sentenceText = sentences[currentIndex];
      const utterance = new SpeechSynthesisUtterance(sentenceText);

      // Tune voice parameters
      const voice = this.pickVoiceForLanguage(language);
      if (voice) {
        utterance.voice = voice;
      }

      if (language === 'sw') {
        utterance.lang = 'sw-KE';
        utterance.rate = rate * 0.95;
        utterance.pitch = 1.0;
      } else if (language === 'lg') {
        // Luganda has rhythmic tonal cadence; pacing slightly slower ensures high intelligibility
        utterance.lang = 'lg';
        utterance.rate = rate * 0.90;
        utterance.pitch = 1.05;
      } else {
        utterance.lang = 'en-US';
        utterance.rate = rate;
        utterance.pitch = 1.0;
      }

      utterance.volume = Math.max(0, Math.min(1, volume));

      utterance.onend = () => {
        currentIndex++;
        // Small pause between sentences for clarity
        setTimeout(() => {
          if (this.isSynthesizing) {
            speakCurrent();
          }
        }, 320);
      };

      utterance.onerror = (e) => {
        // If error or interrupted, try moving on or report
        if (e.error === 'interrupted' || e.error === 'canceled') {
          return;
        }
        console.warn('Speech synthesis notice:', e);
        // Continue to next sentence anyway so audio playback doesn't freeze
        currentIndex++;
        if (currentIndex < sentences.length && this.isSynthesizing) {
          speakCurrent();
        } else {
          if (this.timerInterval) {
            window.clearInterval(this.timerInterval);
            this.timerInterval = null;
          }
          this.isSynthesizing = false;
          onEnd();
        }
      };

      this.currentUtterance = utterance;
      try {
        this.synth?.speak(utterance);
      } catch (err) {
        onError(err);
      }
    };

    // Small delay to let the chime ring
    setTimeout(() => {
      speakCurrent();
    }, 380);
  }
}

export const audioEngine = new AudioPlayerEngine();
