import * as THREE from 'three';

import { Assets } from 'pixi.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { InteractionManager } from 'three.interactive';
import Stats from 'stats.js';
import { createCameraControl, createCameraInfo, createLigthControll } from './core/Utils/index';
import { SCENE, CAMERA, manifest, sceneManagerConfig, DEBUG, HELPER, RENDERER, GRID } from './config';
import { DirectionalLightManager } from './core/Managers/DirectionalLightManager';
import { SceneManager } from './core/Managers/SceneManager';
import { GameGrid } from './core/BaseObjects/BaseGrid';
import { BatchedRenderer } from 'three.quarks';
import { Container, WebGLRenderer } from 'pixi.js';
import { loadSounds, playSound } from './core/Utils/Sound';
import { List } from './core/BaseObjects/BaseList';
import { Popup } from './core/BaseObjects/BasePopup';
import { BaseLayer } from './core/Scene/BaseLayer';
import { Helper } from './core/BaseObjects/BaseHelper';
import { Event } from './core/Managers/EventManager';
import { CameraManager } from './core/Managers/CameraManager';
import gsap from 'gsap';

export async function createScene() {
  const batchSystem = new BatchedRenderer();

  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  const { clock, scene, camera, stats } = initThreeScene();

  const renderer = initWebGLRenderer(canvas);
  renderer.sortObjects = false;

  const pixiRenderer = await initPixiRenderer(canvas, renderer);

  const stage = await initPixiStage();
  loadAssets(stage);

  const sceneManager = await initSceneManager(scene, renderer);

  const interactionManager = new InteractionManager(renderer, camera, renderer.domElement);
  const dirLight = new DirectionalLightManager(scene);
  addLights(scene);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 10;
  controls.maxDistance = 100;


  controls.target.set(-7, 0, 0);
  controls.update();

  if (DEBUG) {
    const shadowHelper = new THREE.CameraHelper(dirLight.light.shadow.camera);
    scene.add(shadowHelper);
    createLigthControll(dirLight.light);
    createCameraControl(camera);



  }

  const cameraInfo = createCameraInfo();
  const gameGrid = new GameGrid(GRID, interactionManager, sceneManager);
  scene.add(gameGrid.gridGroup);
  scene.updateMatrix();

  scene.add(batchSystem);

  setupAnimationLoop(renderer, stats, clock, scene, interactionManager, camera, batchSystem, cameraInfo, pixiRenderer, stage, sceneManager);
  setupResize(renderer, camera, pixiRenderer);
  scene.updateMatrix();
}

async function initPixiStage() {
  const stage = new Container();
  await Assets.init({ manifest });
  return stage;
}

function initThreeScene() {
  const stats = initStats();
  const clock = new THREE.Clock();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SCENE.backgroundColor);
  const camera = new THREE.PerspectiveCamera(CAMERA.fov, window.innerWidth / window.innerHeight, CAMERA.near, CAMERA.far);
  camera.position.set(CAMERA.pos.x, CAMERA.pos.y, CAMERA.pos.z);
  camera.rotation.set(-0.5, 0, 0);
  camera.updateProjectionMatrix();

  new CameraManager(camera);

  DEBUG ? (stats.dom.style.display = 'block') : (stats.dom.style.display = 'none');
  return { clock, scene, camera, stats };
}

function initStats() {
  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
  return stats;
}

function initWebGLRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: RENDERER.antialias, canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(RENDERER.pixelRatio);
  renderer.shadowMap.enabled = RENDERER.shadow.enabled;
  renderer.shadowMap.type = RENDERER.shadow.type;
  renderer.transmissionResolutionScale = window.devicePixelRatio;
  document.body.appendChild(renderer.domElement);
  return renderer;
}

async function initSceneManager(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  const sceneManager = new SceneManager(scene, renderer);
  await sceneManager.loadScene(sceneManagerConfig.scenes[0]);
  sceneManager.showScene('Base');
  return sceneManager;
}

async function initPixiRenderer(canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer) {
  const pixiRenderer = new WebGLRenderer();
  await pixiRenderer.init({
    view: canvas,
    context: renderer.domElement.getContext('webgl2'),
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: window.devicePixelRatio,
    clearBeforeRender: false,
    canvas: canvas,
  });
  return pixiRenderer;
}

function loadAssets(stage: Container) {
  loadSounds();
  Assets.loadBundle('game-assets').then(() => {
    makeLayers(stage);
  });
}

function makeLayers(stage: Container) {
  const layer = new BaseLayer();
  stage.addChild(layer);

  const helper = new Helper(HELPER);
  const popCTA = new Popup(' GREAT JOB!\nKEEP GOING.');

  Event.once('HELPER:HIDE', () => {
    popCTA.visible = true;
    popCTA.alpha = 0;
    gsap.to(popCTA, { alpha: 1, duration: 0.5 });
    playSound('sound_popup_chest', false);
  });

  popCTA.visible = false;

  const list = new List();
  layer.add(list.container);
  layer.add(helper.container);
  layer.add(popCTA);
  stage.addChild(layer);
  layer.show();
  Event.dispatch('HELPER:SHOW');
}

function addLights(scene: THREE.Scene) {
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
  rimLight.position.set(0, 30, 0);
  scene.add(rimLight);

  const hemi = new THREE.AmbientLight(0xffffff, 0.5);
  hemi.position.set(0, 30, 0);
  scene.add(hemi);
}

function setupAnimationLoop(
  renderer: THREE.WebGLRenderer,
  stats: Stats,
  clock: THREE.Clock,
  scene: THREE.Scene,
  interactionManager: InteractionManager,
  camera: THREE.Camera,
  batchSystem: BatchedRenderer,
  cameraInfo: HTMLElement,
  pixiRenderer: WebGLRenderer,
  stage: Container,
  sceneManager: SceneManager,
) {
  const animate = () => {
    stats.begin();

    const delta = clock.getDelta();

    batchSystem.update(delta);

    cameraInfo.textContent = `Camera Position:\nx: ${camera.position.x.toFixed(2)}\ny: ${camera.position.y.toFixed(2)}\nz: ${camera.position.z.toFixed(2)}`;
    if (!DEBUG) {
      cameraInfo.style.display = 'none';
    }

    sceneManager.mixers.forEach((m) => m.update(delta));

    interactionManager.update();

    renderer.resetState();
    renderer.render(scene, camera);

    pixiRenderer.resetState();
    pixiRenderer.render({ container: stage });

    stats.end();
  };
  renderer.setAnimationLoop(animate);
}

function setupResize(renderer: THREE.WebGLRenderer, camera: THREE.Camera, pixiRenderer: WebGLRenderer) {
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    //@ts-expect-error as aspect is not in the type
    camera.aspect = width / height;
    //@ts-expect-error  as updateProjectionMatrix is not in the type
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    pixiRenderer.resize(width, height);
  };
  window.addEventListener('resize', handleResize);
  handleResize();
}
