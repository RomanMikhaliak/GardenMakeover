import * as THREE from 'three';
import gsap from 'gsap';
import { LoaderManager } from './LoaderManager';
import { InteractiveGroup } from 'three/addons/interactive/InteractiveGroup.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { checkId, getAnimationById } from '../Utils/index';
import { Animations } from '../../config';

import { playSound } from '../Utils/Sound';

export type AnimationSet = {
  id: string;
  idle: string;
  action: string;
  sound: string;
};

export type AnimationsType = {
  chicken: AnimationSet;
  sheep: AnimationSet;
  cow: AnimationSet;
};

export interface ModelConfig {
  url: string;
  name: string;
  position?: [number, number, number];
}

export interface SceneConfig {
  name: string;
  models: ModelConfig[];
}

export interface SceneManagerConfig {
  scenes: SceneConfig[];
}

export class SceneManager {
  private scene: THREE.Scene;
  private loader = LoaderManager.getInstance();
  private loadedModels = new Map<string, THREE.Object3D>();

  public mixers: THREE.AnimationMixer[] = [];
  public scenes = new Map<string, InteractiveGroup>();
  public childrenMap = new Map<string, THREE.Object3D>();
  public models = new Map<string, THREE.Object3D>();
  public animations = new Map<string, THREE.AnimationClip[]>();
  public activeSceneName: string | null = null;
  public render: THREE.WebGLRenderer;

  constructor(scene: THREE.Scene, render: THREE.WebGLRenderer) {
    this.scene = scene;
    this.render = render;
  }

  async loadScene(config: SceneConfig): Promise<void> {
    if (this.scenes.has(config.name)) return;
    const texLoader: THREE.TextureLoader = new THREE.TextureLoader();
    const gradientMap: THREE.Texture = await new Promise((resolve) => {
      texLoader.load(
        'assets/images/gradient.png',
        (tex: THREE.Texture) => {
          tex.minFilter = THREE.NearestFilter;
          tex.magFilter = THREE.NearestFilter;
          tex.generateMipmaps = false;
          resolve(tex);
        },
        undefined,
      );
    });
    const group: InteractiveGroup = new InteractiveGroup();
    group.name = config.name;
    for (const modelConfig of config.models) {
      const model = await this.loader.loadGLTF(modelConfig.url);
      const modelAnimations: THREE.AnimationClip[] | undefined = model.animations;
      if (modelAnimations && modelAnimations.length) {
        this.animations.set(modelConfig.name, modelAnimations);
      }
      const modelScene: THREE.Object3D = model.scene;
      if (modelConfig.position) modelScene.position.set(...modelConfig.position);
      group.add(modelScene);
      if (modelConfig.name) this.models.set(modelConfig.name, modelScene);
      this.loadedModels.set(modelConfig.url, modelScene);
    }

    group.traverse((child: THREE.Object3D): void => {
      if (child instanceof THREE.Mesh && child.material) {
        this.updateMeshMaterial(child, gradientMap);
      }
    });
    group.visible = true;
    this.scene.add(group);
    this.scenes.set(config.name, group);
  }

  getChildFromScene(sceneName: string, childName: string): THREE.Object3D | undefined {
    const group: InteractiveGroup | undefined = this.scenes.get(sceneName);
    if (!group) return;
    return group.getObjectByName(childName) || undefined;
  }

  async showScene(sceneName: string): Promise<void> {
    const group: InteractiveGroup | undefined = this.scenes.get(sceneName);
    if (!group) return;
    if (this.activeSceneName && this.activeSceneName !== sceneName) {
      await this.hideScene(this.activeSceneName);
    }
    group.visible = true;
    await this.animateSceneMaterials(group, 1, 1);
    this.activeSceneName = sceneName;
  }

  async hideScene(sceneName: string): Promise<void> {
    const group: InteractiveGroup | undefined = this.scenes.get(sceneName);
    if (!group) return;
    await this.animateSceneMaterials(group, 0, 1);
    group.visible = false;
    if (this.activeSceneName === sceneName) this.activeSceneName = null;
  }

  async unloadScene(sceneName: string): Promise<void> {
    const group: InteractiveGroup | undefined = this.scenes.get(sceneName);
    if (!group) return;
    await this.animateSceneMaterials(group, 0, 0.6);
    this.scene.remove(group);
    group.traverse((child: THREE.Object3D): void => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((mat: THREE.Material): void => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    this.scenes.delete(sceneName);
    if (this.activeSceneName === sceneName) this.activeSceneName = null;
  }

  getModel(url: string): THREE.Object3D | undefined {
    return this.loadedModels.get(url);
  }

  private updateMeshMaterial(mesh: THREE.Mesh, gradientMap: THREE.Texture): void {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (mesh.material instanceof THREE.MeshStandardMaterial) {
      const originalMat = mesh.material;
      mesh.material = new THREE.MeshToonMaterial({
        color: originalMat.color || new THREE.Color(0xffffff),
        gradientMap,
        map: originalMat.map ?? null,
        alphaMap: originalMat.alphaMap ?? null,
        transparent: originalMat.transparent,
        opacity: originalMat.opacity,
        side: originalMat.side,
      });
    }
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((mat: THREE.Material & { attenuationColor?: THREE.Color }): void => {
        mat.transparent = true;
        if (!mat.attenuationColor) mat.attenuationColor = new THREE.Color(0xffffff);
        mat.depthWrite = true;
        mat.needsUpdate = true;
      });
    } else {
      mesh.material.transparent = true;
      mesh.material.depthWrite = true;
      mesh.material.needsUpdate = true;
    }
  }

  private animateSceneMaterials(group: THREE.Group, targetOpacity: number, duration: number): Promise<void> {
    return new Promise((resolve: () => void): void => {
      const materials: THREE.Material[] = [];
      group.traverse((child: THREE.Object3D): void => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            materials.push(...child.material);
          } else {
            materials.push(child.material);
          }
        }
      });
      gsap.to(materials, {
        opacity: targetOpacity,
        duration: duration,
        ease: 'power2.out',
        onComplete: resolve,
      });
    });
  }

  handleMouseClick(childName: string = 'chicken_1'): THREE.Object3D | undefined {
    const obj: THREE.Object3D | undefined = this.getChildFromScene('Base', childName);
    if (!obj) return;
    const clone: THREE.Object3D = SkeletonUtils.clone(obj);
    const randomY: number = Math.floor(Math.random() * 61) - 30;
    clone.rotation.set(0, randomY, 0);
    const objectAnimations: THREE.AnimationClip[] | undefined = this.animations.get('objects');
    if (!objectAnimations || objectAnimations.length === 0) return;
    if (!checkId(childName, Animations)) {
      playSound('sound_throw_spear');
      return clone;
    }
    const animationProps = getAnimationById(childName, Animations);
    if (!animationProps) return clone;
    const idleClip: THREE.AnimationClip | undefined = objectAnimations.find(
      (animation: THREE.AnimationClip): boolean => animation.name === animationProps.idle,
    );
    if (!idleClip) return clone;
    clone.animations = [idleClip];
    const mixer: THREE.AnimationMixer = new THREE.AnimationMixer(clone);
    this.mixers.push(mixer);
    const clip: THREE.AnimationClip | undefined = THREE.AnimationClip.findByName(clone.animations, animationProps.idle);
    if (clip) {
      const action = mixer.clipAction(clip);
      playSound(animationProps.sound);

      action.play();
    }
    clone.traverse((child: THREE.Object3D): void => {
      if (child instanceof THREE.Mesh && child.material) {
        this.setMeshDefaults(child);
      }
    });
    return clone;
  }

  private setMeshDefaults(mesh: THREE.Mesh): void {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((mat: THREE.Material & { transparent?: boolean; opacity?: number; depthWrite?: boolean; needsUpdate?: boolean }) => {
        mat.transparent = true;
        mat.opacity = 1;
        mat.depthWrite = true;
        mat.needsUpdate = true;
      });
    }
  }
}
