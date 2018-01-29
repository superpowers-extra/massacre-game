namespace AudioManager {
  let activeTrack: Sup.Sound;
  let trackPlayer: Sup.Audio.SoundPlayer;
  
  export function ensurePlayTrack(name: string) {
    const track = Sup.get(`Audio/Tracks/${name}`, Sup.Sound);
    
    if (activeTrack !== track) {
      activeTrack = track;

      if (trackPlayer != null) trackPlayer.stop();
      trackPlayer = Sup.Audio.playSound(track, 0.5, { loop: true});
    }
  }
  
  export function playSound(name: string, volume = 1) {
    const sound = Sup.get(`Audio/Sounds/${name}`, Sup.Sound);
    
    Sup.Audio.playSound(sound, volume);
  }
}
