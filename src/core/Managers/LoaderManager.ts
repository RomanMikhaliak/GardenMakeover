import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';

export class LoaderManager {
  private static instance: LoaderManager;

  private gltfLoader: GLTFLoader;
  private textureLoader: THREE.TextureLoader;
  private cache: Map<string, GLTF | THREE.Texture>;

  private constructor() {
    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.cache = new Map();
  }

  public static getInstance(): LoaderManager {
    if (!LoaderManager.instance) {
      LoaderManager.instance = new LoaderManager();
    }
    return LoaderManager.instance;
  }

  async loadGLTF(path: string): Promise<GLTF> {
    if (this.cache.has(path)) return this.cache.get(path) as GLTF;

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        (gltf: GLTF) => {
          this.cache.set(path, gltf);

          const animations = gltf.animations;

          if (animations && animations.length) {
            console.log(`[LoaderManager] Loaded ${animations.length} animations.`);
          }

          resolve(gltf);
        },
        undefined,
        reject,
      );
    });
  }

  async loadTexture(path: string): Promise<THREE.Texture> {
    if (this.cache.has(path)) return this.cache.get(path) as THREE.Texture;

    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        path,
        (texture) => {
          this.cache.set(path, texture);
          resolve(texture);
        },
        undefined,
        reject,
      );
    });
  }

  getCached(path: string) {
    return this.cache.get(path);
  }

  clearCache() {
    this.cache.clear();
  }
}
