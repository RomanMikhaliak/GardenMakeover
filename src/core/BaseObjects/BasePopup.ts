import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { playSound } from '../Utils/Sound';
import gsap from 'gsap';
import { POPUP_CONFIG } from '../../config';

export class Popup extends Container {
  constructor(message: string) {
    super();
    this.createPopup(message);
    playSound('sound_win'); // або інший звук вітання
  }

  public close(): void {
    gsap.to(this, {
      alpha: 0,
      duration: 0.5,
      onComplete: () => this.destroy()
    });
  }

  private createPopup(message: string): void {
    const background = this.createBackground();
    this.addChild(background);

    const messageText = this.createMessageText(message);
    messageText.x = (POPUP_CONFIG.width - messageText.width) / 2;
    messageText.y = (POPUP_CONFIG.height - messageText.height) / 2;
    this.addChild(messageText);

    this.x = (window.innerWidth - POPUP_CONFIG.width) / 2;
    this.y = (window.innerHeight - POPUP_CONFIG.height) / 2;

    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.on('pointerdown', () => this.close());
  }

  private createBackground(): Graphics {
    const bg = new Graphics();
    bg.lineStyle(POPUP_CONFIG.borderThickness, POPUP_CONFIG.borderColor);
    bg.beginFill(POPUP_CONFIG.backgroundColor);
    bg.drawRoundedRect(0, 0, POPUP_CONFIG.width, POPUP_CONFIG.height, 10);
    bg.endFill();
    return bg;
  }

  private createMessageText(message: string): Text {
    const style = new TextStyle(POPUP_CONFIG.textStyle);
    return new Text(message, style);
  }
}
