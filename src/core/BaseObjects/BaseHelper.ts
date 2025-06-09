import { Container, Sprite, Text, Assets, Texture, TextStyle } from 'pixi.js';
import { Event } from '../Managers/EventManager';
import gsap from 'gsap';

export interface LoopAnimationConfig {
  scaleMin: number;
  scaleMax: number;
  duration: number;
}

const textStyle = {
  fontFamily: 'Arial',
  fontSize: 27,
  fill: '#ffffff',
  stroke: { color: '#4a1850', width: 3, lineJoin: 'round' },
};

export interface HelperConfig {
  steps: HelperStep[];
  handAnimationDuration?: number;
  loopAnimation?: LoopAnimationConfig;
}

export interface HelperStep {
  position: { x: number; y: number };
  text: string;
}

export interface HelperConfig {
  steps: HelperStep[];
  handAnimationDuration?: number;
  loopAnimation?: {
    scaleMin: number;
    scaleMax: number;
    duration: number;
  };
}

export class Helper {
  public container: Container;
  public hand: Sprite;
  public text: Text;
  private steps: HelperStep[];
  private currentStepIndex: number = 0;
  private handAnimationDuration: number;
  private loopAnimationConfig: { scaleMin: number; scaleMax: number; duration: number };

  constructor(config: HelperConfig) {
    const texHand: Texture = Assets.get('finger');
    this.container = new Container();
    this.hand = new Sprite(texHand);
    if (config.loopAnimation) this.hand.scale.set(config.loopAnimation.scaleMin || 1);
    this.hand.anchor.set(0.5);
    this.hand.rotation = Math.PI * 1.75;
    this.hand.visible = false;

    this.text = new Text('', new TextStyle(textStyle));

    this.container.addChild(this.hand, this.text);
    this.steps = config.steps;
    this.handAnimationDuration = config.handAnimationDuration || 0.5;
    this.loopAnimationConfig = config.loopAnimation || { scaleMin: 0.9, scaleMax: 1.1, duration: 1 };
    this.createSignals();
  }

  private createSignals(): void {
    Event.once('HELPER:SHOW', () => {
      this.hand.visible = true;
      this.setupInitialStep();
    });

    Event.once('HELPER:HIDE', () => {
      this.container.visible = false;
    });

    Event.on('HELPER:NEXT:STEP', () => {
      this.nextStep();
    });
  }

  private setupInitialStep(): void {
    if (this.steps.length > 0) {
      const step = this.steps[0];
      this.hand.position.set(step.position.x, step.position.y);
      this.text.text = step.text;
      this.text.position.set(step.position.x + 80, step.position.y - 25);
      this.startLoopAnimation();
    }
  }

  private startLoopAnimation(): void {
    gsap.to(this.hand.scale, {
      x: this.loopAnimationConfig.scaleMax,
      y: this.loopAnimationConfig.scaleMax,
      duration: this.loopAnimationConfig.duration,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
    });
  }

  public nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      const step = this.steps[this.currentStepIndex];
      gsap.to(this.hand.position, {
        x: step.position.x,
        y: step.position.y,
        duration: this.handAnimationDuration,
        ease: 'power2.out',
      });
      gsap.to(this.text, {
        x: step.position.x + 80,
        y: step.position.y - 25,
        duration: this.handAnimationDuration,
        ease: 'power2.out',
        onComplete: () => {
          this.text.text = step.text;
        },
      });
    }
  }
}
