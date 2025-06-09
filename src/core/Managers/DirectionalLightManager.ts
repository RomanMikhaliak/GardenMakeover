import * as THREE from 'three';
import gsap from 'gsap';
import { DIRECTIONAL_LIGHT_PRESETS, TWEENS } from '../../config';
import { tweenLightColor } from '../Utils';

export interface LightPreset {
  color: string | number;
  intensity: number;
  position: { x: number; y: number; z: number };
  shadow: {
    bias: number;
    normalBias: number;
    mapSize: { x: number; y: number };
    camera: {
      left: number;
      right: number;
      top: number;
      bottom: number;
      near: number;
      far: number;
    };
  };
}

export class DirectionalLightManager {
  public light: THREE.DirectionalLight;
  private activeTweens: gsap.core.Tween[] = [];
  private tweenDuration = TWEENS.ligthChange.duration;
  private tweenEase = TWEENS.ligthChange.ease;

  constructor(private scene: THREE.Scene) {
    const preset = DIRECTIONAL_LIGHT_PRESETS.morning;
    this.light = new THREE.DirectionalLight(preset.color, preset.intensity);
    this.light.position.set(preset.position.x, preset.position.y, preset.position.z);
    this.light.castShadow = true;

    Object.assign(this.light.shadow.camera, preset.shadow.camera);
    this.light.shadow.bias = preset.shadow.bias;
    this.light.shadow.normalBias = preset.shadow.normalBias;
    this.light.shadow.mapSize.set(preset.shadow.mapSize.x, preset.shadow.mapSize.y);

    this.scene.add(this.light);
  }

  private clearTweens() {
    this.activeTweens.forEach((t) => t.kill());
    this.activeTweens = [];
  }

  private tweenToPreset(preset: LightPreset): void {
    this.clearTweens();

    const positionTween = gsap.to(this.light.position, {
      x: preset.position.x,
      y: preset.position.y,
      z: preset.position.z,
      duration: this.tweenDuration,
      ease: this.tweenEase,
    });

    const intensityTween = gsap.to(this.light, {
      intensity: preset.intensity,
      duration: this.tweenDuration,
      ease: this.tweenEase,
    });

    const biasTween = gsap.to(this.light.shadow, {
      bias: preset.shadow.bias,
      normalBias: preset.shadow.normalBias,
      duration: this.tweenDuration,
      ease: this.tweenEase,
      onUpdate: () => {
        this.light.shadow.camera.updateProjectionMatrix();
      },
    });

    this.activeTweens.push(positionTween, intensityTween, biasTween);
    tweenLightColor(this.light, new THREE.Color(preset.color), this.tweenDuration);

    intensityTween.eventCallback('onComplete', () => {
      this.light.shadow.camera.updateProjectionMatrix();
    });
  }

  public switchToPreset(presetName: keyof typeof DIRECTIONAL_LIGHT_PRESETS) {
    const preset = DIRECTIONAL_LIGHT_PRESETS[presetName];
    this.tweenToPreset(preset);
  }
}

export function createLightSwitcherUI(manager: DirectionalLightManager) {
  const buttons = ['day', 'night', 'morning', 'dusk'];
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '100px';
  container.style.top = '10px';
  container.style.zIndex = '100';

  buttons.forEach((name) => {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.style.margin = '2px';
    btn.onclick = () => manager.switchToPreset(name as keyof typeof DIRECTIONAL_LIGHT_PRESETS);
    container.appendChild(btn);
  });

  document.body.appendChild(container);
}
