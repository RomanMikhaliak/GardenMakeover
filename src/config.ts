import * as THREE from 'three';
import { SceneManagerConfig } from './core/Managers/SceneManager';

export const DEBUG = false;

export const SCENE = {
  backgroundColor: 0xa0a0a0,
  fog: {
    enabled: false,
    color: 0xa0a0a0,
    near: 20,
    far: 100,
  },
};

export const MODELS = {
  ground: 'assets/models/ground.glb',
  skybox: 'assets/models/skybox.glb',
};

export const manifest = {
  bundles: [
    {
      name: 'game-assets',
      assets: [
        { alias: 'chicken', src: 'assets/images/chicken.png' },
        { alias: 'corn', src: 'assets/images/corn.png' },
        { alias: 'cow', src: 'assets/images/cow.png' },
        { alias: 'grape', src: 'assets/images/grape.png' },
        { alias: 'sheep', src: 'assets/images/sheep.png' },
        { alias: 'smoke', src: 'assets/images/smoke.png' },
        { alias: 'strawberry', src: 'assets/images/strawberry.png' },
        { alias: 'tomato', src: 'assets/images/tomato.png' },
        { alias: 'shop_open', src: 'assets/images/shopOpen.png' },
        { alias: 'shop_close', src: 'assets/images/shopClose.png' },
        { alias: 'finger', src: 'assets/images/finger.png' },
      ],
    },
  ],
};

export const sceneManagerConfig: SceneManagerConfig = {
  scenes: [
    {
      name: 'Base',
      models: [
        { name: 'ground', url: 'assets/models/ground.glb', position: [0, 0, 10] },
        { name: 'objects', url: 'assets/models/objects.glb', position: [0, 5, 100] },
        { name: 'sky', url: 'assets/models/skybox.glb', position: [0, 50, 0] },
      ],
    },
  ],
};

export const Animations = {
  chicken: {
    id: 'chicken_1',
    idle: 'idle_chicken',
    action: 'action_chicken',
    sound: 'sound_chicken',
  },
  sheep: {
    id: 'sheep_1',
    idle: 'idle_sheep',
    action: 'action_sheep',
    sound: 'sound_sheep',
  },
  cow: {
    id: 'cow_1',
    idle: 'idle_cow',
    action: 'action_cow',
    sound: 'sound_cow',
  },
};

export const CAMERA = {
  fov: 20,
  near: 1,
  far: 2000,
  pos: {
    x: 30,
    y: 40,
    z: 80,
  },
};

export const GRID = {
  rows: 19,
  columns: 16,
  cubeSize: 2,
  gap: 0.1,
  freeColor: 0x75735e,
  filledColor: 0x9c0000,
  startX: -1,
  startZ: 3,
  sizePointer: 2,

  nonInteractiveMatrix: [
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0],
    [0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],

  baseObjects: [
    { row: 9, col: 14, id: 'chicken_1' },
    { row: 8, col: 13, id: 'chicken_1' },
    { row: 16, col: 7, id: 'cow_1' },
    { row: 14, col: 8, id: 'cow_1' },
    { row: 15, col: 8, id: 'sheep_1' },
    { row: 14, col: 6, id: 'sheep_1' },
    { row: 0, col: 15, id: 'tomato_1' },
    { row: 0, col: 13, id: 'tomato_1' },
    { row: 0, col: 11, id: 'tomato_1' },
    { row: 0, col: 9, id: 'tomato_1' },
    { row: 1, col: 14, id: 'tomato_2' },
    { row: 1, col: 12, id: 'tomato_2' },
    { row: 1, col: 10, id: 'tomato_2' },
    { row: 15, col: 10, id: 'corn_3' },
    { row: 14, col: 11, id: 'corn_2' },
    { row: 13, col: 10, id: 'corn_1' },
    { row: 13, col: 12, id: 'cow_1' },
    { row: 13, col: 3, id: 'chicken_1' },
    { row: 11, col: 5, id: 'sheep_1' },
    { row: 14, col: 1, id: 'sheep_1' },
    { row: 9, col: 2, id: 'chicken_1' },
    { row: 6, col: 1, id: 'grape_1' },
    { row: 4, col: 1, id: 'grape_2' },
    { row: 2, col: 1, id: 'grape_3' },

  ],
};

export const GAME_GRID_CONFIG = {
  RAYCASTER_THRESHOLD: 0.1,
  GEOMETRY_HEIGHT: 0.1,
  CUBE_Y: 4.4,
  GAME_OBJECT_Y: 4.2,
  CLICK_DELAY: 0.3,
  CUBE_OPACITY: 0.01,
  BLOCKED_COLOR: 0x888888,
  EDGE_LINE_COLOR: 0x000000,
  EDGE_LINE_WIDTH: 1,
  EDGE_OPACITY: 0,
};

export const RENDERER = {
  antialias: false,
  pixelRatio: window.devicePixelRatio,
  screen: {
    width: 1920,
    height: 1080,
  },
  shadow: {
    enabled: true,
    type: THREE.PCFShadowMap,
  },
};

export const TWEENS = {
  ligthChange: {
    duration: 2,
    ease: 'power2.inOut',
  },
};

export const DIRECTIONAL_LIGHT_PRESETS = {
  day: {
    color: 0xffffff,
    intensity: 6,
    position: { x: 55, y: 55, z: 55 },
    shadow: {
      camera: {
        left: -55,
        right: 55,
        top: 55,
        bottom: -55,
        near: 0.0,
        far: 1000,
      },
      bias: -0.0004,
      normalBias: 0.005,
      mapSize: { x: 4096, y: 4096 },
    },
  },
  night: {
    color: 0x6666ff,
    intensity: 1,
    position: { x: 10, y: 30, z: 10 },
    shadow: {
      camera: {
        left: -30,
        right: 30,
        top: 30,
        bottom: -30,
        near: 50,
        far: 100,
      },
      bias: -0.0002,
      normalBias: 0.005,
      mapSize: { x: 2048, y: 2048 },
    },
  },
  morning: {
    color: 0xffcc33,
    intensity: 6,
    position: { x: -40, y: 50, z: 25 },
    shadow: {
      camera: {
        left: -35,
        right: 35,
        top: 35,
        bottom: -35,
        near: 1,
        far: 150,
      },
      bias: -0.0003,
      normalBias: 0.007,
      mapSize: { x: 2048, y: 2048 },
    },
  },
  dusk: {
    color: 0xff9966,
    intensity: 4,
    position: { x: -30, y: 25, z: -20 },
    shadow: {
      camera: {
        left: -40,
        right: 40,
        top: 40,
        bottom: -40,
        near: 1,
        far: 150,
      },
      bias: -0.0003,
      normalBias: 0.007,
      mapSize: { x: 2048, y: 2048 },
    },
  },
};

export const UI = {};

export const LIST = {
  x: 60,
  y: 50,
  scale: 0.5,
  listItems: ['CHICKEN', 'CORN', 'COW', 'GRAPE', 'SHEEP', 'STRABERRY', 'TOMATO'],
  listID: ['chicken_1', 'corn_1', 'cow_1', 'grape_1', 'sheep_1', 'strawberry_1', 'tomato_1'],
  texOpen: 'shop_open',
  texClose: 'shop_close',
  labelStyle: {
    fontFamily: 'Arial',
    fontSize: 36,
    fill: '#ffffff',
    stroke: { color: '#4a1850', width: 2, lineJoin: 'round' },
    dropShadow: {
      color: 'RGBA(0, 0, 0, 0.5)',
      blur: 4,
      angle: Math.PI / 6,
      distance: 6,
    },
    wordWrap: true,
    wordWrapWidth: 440,
  },
  itemStyle: {
    fontFamily: 'Arial',
    fontSize: 13,
    fill: '#ffffff',
    stroke: { color: '#4a1850', width: 2, lineJoin: 'round' },
    dropShadow: {
      color: 'RGBA(0, 0, 0, 0.5)',
      blur: 2,
      angle: Math.PI / 6,
      distance: 2,
    },
    wordWrap: true,
    wordWrapWidth: 440,
  },
  selectItems: {
    width: 200,
    height: 50,
    backgroundColor: 'RGBA(245, 66, 66, 0.5)',
    hoverColor: 'RGBA(245, 66, 66, 0.7)',
  },
  scrollBox: {
    width: 200,
    height: 350,
    radius: 30,
    offset: {
      x: 200,
      y: -200,
    },
  },
  openBgSprite: {
    x: 20,
    scale: 0.3,
  },
  closedBgSprite: {
    scale: 0.3,
  },
};

export const POPUP_CONFIG = {
  width: 400,
  height: 200,
  backgroundColor: 'rgba(255, 105, 180, 0.7)',
  borderColor: 0xffffcc,
  borderThickness: 4,
  textStyle: {
    fontFamily: 'Arial',
    fontSize: 35,
    fill: '#fff8dc',
    aling: 'center',
  },
  spacing: 50,
};

export type CameraAnimationConfig = {
  duration: number;
  delay: number;
  ease: string;
};

export const DEFAULT_CAMERA_ANIMATION_CONFIG: CameraAnimationConfig = {
  duration: 0.24,
  delay: 0,
  ease: 'power4.in',
};

export const HELPER = {
  steps: [
    { position: { x: 90, y: 60 }, text: 'Welcome farmer! \nClick here to open market.' },
    { position: { x: 90, y: 620 }, text: 'Good. \nNow, select prefered item.' },
    { position: { x: 920, y: 540 }, text: 'Almost there! \nClick on ground to place it!.' },
  ],
  handAnimationDuration: 0.75,
  loopAnimation: { scaleMin: 0.03, scaleMax: 0.04, duration: 1.5 },
};
