// Background music manager — disabled (all music removed)
class BackgroundMusicManager {
  public subscribe(_listener: () => void): () => void { return () => {}; }
  public async play(): Promise<void> {}
  public pause(): void {}
  public toggleMute(): boolean { return false; }
  public isPlaying(): boolean { return false; }
  public isMuted(): boolean { return false; }
}

export const bgMusic = new BackgroundMusicManager();

