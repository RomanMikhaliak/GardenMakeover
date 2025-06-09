import { sound } from '@pixi/sound';

const audioManifest = [
  { alias: 'sound_chicken', src: 'assets/sounds/chicken.mp3' },
  { alias: 'sound_click', src: 'assets/sounds/click_003.mp3' },
  { alias: 'sound_cow', src: 'assets/sounds/cow.mp3' },
  { alias: 'sound_popup_chest', src: 'assets/sounds/popup_chest.mp3' },
  { alias: 'sound_sheep', src: 'assets/sounds/sheep.mp3' },
  { alias: 'sound_theme', src: 'assets/sounds/theme.mp3' },
  { alias: 'sound_throw_spear', src: 'assets/sounds/throw_spear.mp3' },
];

export async function loadSounds(): Promise<void> {
  const promises = audioManifest.map(({ alias, src }) => {
    return new Promise<void>((resolve) => {
      sound.add(alias, {
        url: src,
        preload: true,
        loaded: () => resolve(),
      });
    });
  });

  await Promise.all(promises);
}

export function playSound(alias: string, loop: boolean = false): void {
  if (sound.exists(alias)) {
    sound.play(alias, { loop });
  } else {
    console.warn(`🔇 Sound '${alias}' not found`);
  }
}
