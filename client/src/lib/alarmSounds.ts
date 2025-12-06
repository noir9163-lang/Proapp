export type SoundType = "bell" | "chime" | "buzz" | "piano";

class AlarmSoundManager {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  async playSound(soundType: SoundType, duration: number = 60000): Promise<void> {
    if (this.isPlaying) return;
    this.isPlaying = true;

    try {
      // Initialize audio context on first use
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = this.audioContext;

      if (soundType === "bell") {
        await this.playBell(ctx, duration);
      } else if (soundType === "chime") {
        await this.playChime(ctx, duration);
      } else if (soundType === "buzz") {
        await this.playBuzz(ctx, duration);
      } else if (soundType === "piano") {
        await this.playPiano(ctx, duration);
      }
    } catch (error) {
      console.error("Failed to play alarm sound:", error);
      this.isPlaying = false;
    }
  }

  private playBell(ctx: AudioContext, duration: number): void {
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    const frequencies = [800, 1200, 1600];
    let stopTime = ctx.currentTime + duration / 1000;

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq;
      osc.type = "sine";
      osc.connect(gainNode);

      const delay = idx * 0.05;
      osc.start(ctx.currentTime + delay);
      osc.stop(stopTime);
    });

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, stopTime);
  }

  private playChime(ctx: AudioContext, duration: number): void {
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    const notes = [
      { freq: 523.25, duration: 0.5 }, // C5
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 783.99, duration: 1 },   // G5
    ];

    let time = ctx.currentTime;
    let totalDuration = 0;
    const maxDuration = duration / 1000;

    while (totalDuration < maxDuration) {
      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        osc.frequency.value = note.freq;
        osc.type = "sine";
        osc.connect(gainNode);

        osc.start(time);
        osc.stop(time + note.duration);
        time += note.duration + 0.1;
      });
      totalDuration = time - ctx.currentTime;
    }

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + maxDuration);
  }

  private playBuzz(ctx: AudioContext, duration: number): void {
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.frequency.value = 1000;
    osc.type = "square";
    osc.connect(gainNode);

    const stopTime = ctx.currentTime + duration / 1000;
    osc.start(ctx.currentTime);
    osc.stop(stopTime);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, stopTime);
  }

  private playPiano(ctx: AudioContext, duration: number): void {
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    const pianoNotes = [261.63, 293.66, 329.63, 349.23]; // C, D, E, F

    let time = ctx.currentTime;
    const stopTime = ctx.currentTime + duration / 1000;

    while (time < stopTime) {
      pianoNotes.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.frequency.value = freq;
        osc.type = "sine";
        osc.connect(gainNode);

        osc.start(time);
        osc.stop(time + 0.3);
      });
      time += 0.5;
    }

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, stopTime);
  }

  stopSound(): void {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
      } catch (e) {
        // Already stopped
      }
      this.oscillator = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isPlaying = false;
  }
}

export const alarmSounds = new AlarmSoundManager();