import { Container, Sprite, Assets, Texture, Text, TextStyle, Graphics } from 'pixi.js';
import { playSound } from '../Utils/Sound';
import { ItemManager } from '../Managers/ItemsManager';
import { LIST } from '../../config';
import { Event } from '../Managers/EventManager';
import gsap from 'gsap';

export class List {
  public container: Container = new Container();
  public helperStart = false;
  public helperStepOne = false;
  public helperStepTwo = false;
  private clearModeActive = false;

  private itemButtons: { container: Container, bg: Graphics, id: string }[] = [];
  private toggleMarketBtn!: Sprite;
  private isOpen = false;
  private currentCell: { row: number; col: number; cube: any } | null = null;
  private clearButton!: Container;
  private clearAllButton!: Container;

  constructor() {
    this.init();
    Event.once('HELPER:SHOW', () => (this.helperStart = true));
  }

  private init() {
    this.initToggleButton();
    this.initItemList();
    this.initClearButton();
  }

  private initToggleButton() {
    this.toggleMarketBtn = this.createButton(LIST.texOpen, this.toggleList.bind(this));
    this.container.addChild(this.toggleMarketBtn);
  }

  private unselectAllItems() {
    const itemManager = ItemManager.getInstance();
    itemManager.selectedItem = null;
    this.currentCell = null;
    this.updateHighlight();
    Event.dispatch('MARKET:CLEAR_SELECTION');
  }

  private createButton(textureKey: string, onClick: () => void): Sprite {
    const texture = Assets.get(textureKey);
    const btn = new Sprite(texture);
    btn.anchor.set(0.5);
    btn.width = 80;
    btn.height = 80;
    btn.x = LIST.x;
    btn.y = LIST.y;
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    btn.on('pointerdown', () => {
      playSound('sound_click');
      onClick();
    });
    return btn;
  }

  private initItemList() {
    const itemManager = ItemManager.getInstance();
    const { listItems, listID } = LIST;

    listItems.forEach((labelText, i) => {
      const id = listID[i];
      const textureKey = id.split('_')[0];
      const texture = Assets.get(textureKey) || Texture.WHITE;

      const itemContainer = new Container();
      itemContainer.visible = false;

      const bg = new Graphics();
      this.setNormalBG(bg);
      itemContainer.addChild(bg);

      const btn = new Sprite(texture);
      btn.anchor.set(0.5);
      btn.width = btn.height = 50;
      btn.eventMode = 'static';
      btn.cursor = 'pointer';
      this.addButtonHoverEffect(btn);
      btn.on('pointerdown', () => this.onItemClick(id, itemManager));
      itemContainer.addChild(btn);

      const label = new Text(labelText, new TextStyle({
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold',
        fill: '0xffffff',
        stroke: { color: '#743211', width: 5, join: 'round' },
      }));
      label.anchor.set(0.5, 0);
      label.position.set(0, 30);
      itemContainer.addChild(label);

      this.itemButtons.push({ container: itemContainer, bg, id });
      this.container.addChild(itemContainer);
    });

    itemManager.selectedItem = null;
  }

  private addButtonHoverEffect(btn: Sprite) {
    let pulseTween: gsap.core.Tween | null = null;

    btn.on('pointerover', () => {
      pulseTween = gsap.to(btn, {
        alpha: 0.6,
        duration: 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    });

    btn.on('pointerout', () => {
      if (pulseTween) {
        pulseTween.kill();
        pulseTween = null;
      }
      btn.alpha = 1;
    });
  }

private initClearButton() {
  const bg = new Graphics();
  this.setClearButtonBG(bg, false);

  const label = new Text('Clear', new TextStyle({
    fontSize: 18,
    fill: 'white',
    fontWeight: 'bold',
    fontFamily: 'Arial',
  }));
  label.anchor.set(0.5);

  const container = new Container();
  container.addChild(bg, label);
  container.visible = false;
  container.eventMode = 'static';
  container.cursor = 'pointer';

  container.on('pointerdown', () => {
    playSound('sound_click');
    this.toggleClearMode(bg);
  });

  this.clearButton = container;
  this.container.addChild(this.clearButton);

  const clearAllBg = new Graphics();
  this.setClearButtonBG(clearAllBg, false);

  const clearAllLabel = new Text('Clear All', new TextStyle({
    fontSize: 18,
    fill: 'white',
    fontWeight: 'bold',
    fontFamily: 'Arial',
  }));
  clearAllLabel.anchor.set(0.5);

  const clearAllContainer = new Container();
  clearAllContainer.addChild(clearAllBg, clearAllLabel);
  clearAllContainer.visible = false;
  clearAllContainer.eventMode = 'static';
  clearAllContainer.cursor = 'pointer';

  clearAllContainer.on('pointerdown', () => {
    playSound('sound_click');
     this.unselectAllItems();
    Event.dispatch('GRID:CLEAR_ALL');
  });

  this.clearAllButton = clearAllContainer;
  this.container.addChild(this.clearAllButton);
}

private toggleClearMode(bg: Graphics) {
  this.clearModeActive = !this.clearModeActive;
       if (this.clearModeActive) {
      this.unselectAllItems();
    }

  this.setClearButtonBG(bg, this.clearModeActive);

  Event.dispatch('GRID:TOGGLE', this.clearModeActive);

  if (this.clearModeActive) {
    Event.on('GRID:CELL_CLICK', this.handleClearCellClick);
  } else {
    Event.off('GRID:CELL_CLICK', this.handleClearCellClick);
  }
}

private handleClearCellClick = (payload: { row: number; col: number; selected: boolean }) => {
  if (this.clearModeActive && payload.selected) {
    Event.dispatch('GRID:CLEAR_CELL', { row: payload.row, col: payload.col });
    this.clearModeActive = false;
    this.setClearButtonBG((this.clearButton.children[0] as Graphics), false);
    Event.dispatch('GRID:TOGGLE', false);
    Event.off('GRID:CELL_CLICK', this.handleClearCellClick);
  }
};

private setClearButtonBG(bg: Graphics, active: boolean) {
  bg.clear();
  bg.fill(active ? 0xb71c1c : 0x660000, active ? 1 : 0.7);
  bg.roundRect(-50, -20, 100, 40, 10);
  bg.endFill();
}

  private toggleList() {
    this.isOpen = !this.isOpen;
     if (this.isOpen) {
      this.unselectAllItems();
    }
     Event.dispatch('GRID:TOGGLE', false);
    const texKey = this.isOpen ? LIST.texClose : LIST.texOpen;
    this.toggleMarketBtn.texture = Assets.get(texKey);

    this.itemButtons.forEach((item, i) => {
      item.container.visible = this.isOpen;
      item.container.x = this.toggleMarketBtn.x;
      item.container.y = this.toggleMarketBtn.y + this.toggleMarketBtn.height + (i + 1) * 90 - 80;
    });

    this.clearButton.visible = this.isOpen;
    this.clearButton.x = this.toggleMarketBtn.x;
    this.clearButton.y = this.toggleMarketBtn.y + this.toggleMarketBtn.height + (this.itemButtons.length + 1) * 90 - 80;

     this.clearAllButton.visible = this.isOpen;
  this.clearAllButton.x = this.toggleMarketBtn.x;
  this.clearAllButton.y = this.clearButton.y + 60;


    this.updateHighlight();

    if (this.helperStart && this.isOpen && !this.helperStepOne) {
      Event.dispatch('HELPER:NEXT:STEP');
      this.helperStepOne = true;
    }
  }

private onItemClick(itemId: string, itemManager: ItemManager) {
  playSound('sound_click');

  if (itemManager.selectedItem === itemId) {
    itemManager.selectedItem = null;
    this.currentCell = null;
    this.updateHighlight();
    Event.dispatch('MARKET:CLEAR_SELECTION');
    Event.dispatch('GRID:TOGGLE', !this.isOpen);
    return; 
  }
  itemManager.selectedItem = itemId;

  if (this.currentCell) {
    Event.dispatch('MARKET:PLACE_ANIMAL', {
      itemId,
      ...this.currentCell,
    });
    this.currentCell = null;
  }

  this.updateHighlight();
  Event.dispatch('GRID:TOGGLE', this.isOpen);

  if (this.helperStart && this.helperStepOne && !this.helperStepTwo) {
    Event.dispatch('HELPER:NEXT:STEP');
    Event.dispatch('GRID:ENABLE');

    this.helperStepTwo = true;
  }
}

  private updateHighlight() {
    const selected = ItemManager.getInstance().selectedItem;

    this.itemButtons.forEach(({ bg, id }) => {
      if (id === selected) {
        this.setSelectedBG(bg);
      } else {
        this.setNormalBG(bg);
      }
    });
  }

  private setNormalBG(bg: Graphics) {
    bg.clear();
    bg.fill(0x222222, 0.75);
    bg.roundRect(-50, -30, 100, 80, 10);
    bg.endFill();
  }

  private setSelectedBG(bg: Graphics) {
    bg.clear();
    bg.fill(0x4caf50, 0.9);
    bg.roundRect(-50, -30, 100, 80, 10);
    bg.endFill();
  }

  public setCell(cell: { row: number; col: number; cube: any }) {
    this.currentCell = cell;
  }

  public resetHelperSteps() {
    this.helperStart = false;
    this.helperStepOne = false;
    this.helperStepTwo = false;
  }
}
