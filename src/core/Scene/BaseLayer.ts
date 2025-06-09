import { Container } from 'pixi.js';
import { gsap } from 'gsap';

export class BaseLayer extends Container {
  public initialized = false;
  private animationDuration = 0.4;

  constructor() {
    super();
    this.visible = false;
    this.alpha = 0;
  }

  public init(): void {
    this.initialized = true;
  }

  public show(): void {
    this.visible = true;
    gsap.killTweensOf(this);
    gsap.to(this, {
      alpha: 1,
      duration: this.animationDuration,
      delay: 1,
      ease: 'power2.out',
    });
  }

  public hide(): void {
    gsap.killTweensOf(this);
    gsap.to(this, {
      alpha: 0,
      duration: this.animationDuration,
      ease: 'power2.in',
      onComplete: () => {
        this.visible = false;
      },
    });
  }

  public destroyLayer(): void {
    gsap.killTweensOf(this);
    this.removeChildren();
    this.destroy({ children: true, texture: false });
  }

  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public add<T extends Container>(displayObject: T): T {
    this.addChild(displayObject);
    return displayObject;
  }

  public remove<T extends Container>(displayObject: T): T {
    this.removeChild(displayObject);
    return displayObject;
  }
}
