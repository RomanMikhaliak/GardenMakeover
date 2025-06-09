import * as THREE from 'three';
import gsap from 'gsap';
import { Event } from './EventManager';
import { DEFAULT_CAMERA_ANIMATION_CONFIG } from '../../config';

export class CameraManager {
  private camera: THREE.PerspectiveCamera;
  private cameraPosition: THREE.Vector3;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.cameraPosition = camera.position.clone();

    Event.on('CAMERA:RESET', () => {
      this.resetCameraPosition();
    });

    Event.on('CAMERA:ZOOM', () => {
      this.moveCameraToPosition(new THREE.Vector3(this.cameraPosition.x, this.cameraPosition.y - 10, this.cameraPosition.z - 20));
    });

    Event.on('CAMERA:SHAKE', () => {
      this.shakeCamera();
    });
  }

  moveCameraToPosition(position: THREE.Vector3, duration: number = 1, delay: number = 0) {
    gsap.to(this.camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration,
      ease: DEFAULT_CAMERA_ANIMATION_CONFIG.ease,
      delay,
    });
  }

  resetCameraPosition(duration: number = 1, delay: number = 0) {
    gsap.to(this.camera.position, {
      x: this.cameraPosition.x,
      y: this.cameraPosition.y,
      z: this.cameraPosition.z,
      duration,
      ease: DEFAULT_CAMERA_ANIMATION_CONFIG.ease,
      delay,
    });
  }

  shakeCamera(intensity: number = 0.5, duration: number = 0.5) {
    const originalPosition = this.camera.position.clone();
    const shakeTimeline = gsap.timeline({
      onComplete: () => {
        this.camera.position.set(originalPosition.x, originalPosition.y, originalPosition.z);
      },
    });

    const shakes = duration * 10;
    for (let i = 0; i < shakes; i++) {
      shakeTimeline.to(this.camera.position, {
        x: originalPosition.x + (Math.random() - 0.5) * intensity,
        y: originalPosition.y + (Math.random() - 0.5) * intensity,
        duration: duration / shakes,
        ease: 'power1.inOut',
      });
    }
  }
}
