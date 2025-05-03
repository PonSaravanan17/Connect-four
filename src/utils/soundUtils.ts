export function playSound(file: string) {
  const audio = new Audio(`/sounds/${file}`);
  audio.currentTime = 0;
  audio.play();
} 