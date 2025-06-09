import * as THREE from 'three';
import gsap from 'gsap';

export function createLigthControll(dirLight: THREE.DirectionalLight) {
  const lightControls = document.createElement('div');
  lightControls.style.position = 'absolute';
  lightControls.style.bottom = '10px';
  lightControls.style.left = '10px';
  lightControls.style.color = '#ffffff';
  lightControls.style.fontFamily = 'monospace';
  lightControls.style.fontSize = '13px';
  lightControls.style.backgroundColor = 'rgba(0,0,0,0.6)';
  lightControls.style.padding = '10px';
  lightControls.style.borderRadius = '8px';
  lightControls.style.zIndex = '100';
  lightControls.innerHTML = `
    <strong>🌞 Light Controls</strong><br><br>
    <label>X: <input id="lightX" type="range" min="-200" max="200" step="0.1" value="${
      dirLight.position.x
    }"> <span id="lightXVal">${dirLight.position.x.toFixed(1)}</span></label><br>
    <label>Y: <input id="lightY" type="range" min="-200" max="200" step="0.1" value="${
      dirLight.position.y
    }"> <span id="lightYVal">${dirLight.position.y.toFixed(1)}</span></label><br>
    <label>Z: <input id="lightZ" type="range" min="-200" max="200" step="0.1" value="${
      dirLight.position.z
    }"> <span id="lightZVal">${dirLight.position.z.toFixed(1)}</span></label><br>
    <label>Intensity: <input id="lightIntensity" type="range" min="0" max="100" step="0.1" value="${
      dirLight.intensity
    }"> <span id="lightIntensityVal">${dirLight.intensity.toFixed(1)}</span></label><br>
    <label>Shadow Near: <input id="shadowNear" type="range" min="0.1" max="10" step="0.1" value="${
      dirLight.shadow.camera.near
    }"> <span id="shadowNearVal">${dirLight.shadow.camera.near.toFixed(1)}</span></label><br>
    <label>Shadow Far: <input id="shadowFar" type="range" min="10" max="200" step="1" value="${
      dirLight.shadow.camera.far
    }"> <span id="shadowFarVal">${dirLight.shadow.camera.far.toFixed(1)}</span></label><br>
    <label>Shadow Bias: <input id="shadowBias" type="range" min="-0.01" max="0.01" step="0.0001" value="${
      dirLight.shadow.bias
    }"> <span id="shadowBiasVal">${dirLight.shadow.bias.toFixed(4)}</span></label><br>
  `;
  document.body.appendChild(lightControls);

  function bind(id: string, onChange: () => void) {
    const input = document.getElementById(id) as HTMLInputElement;
    const span = document.getElementById(id + 'Val')!;
    input.addEventListener('input', () => {
      onChange();
      span.textContent = parseFloat(input.value).toFixed(input.step.includes('.') ? input.step.split('.')[1].length : 0);
    });
    return input;
  }

  const lightX = bind('lightX', () => (dirLight.position.x = parseFloat(lightX.value)));
  const lightY = bind('lightY', () => (dirLight.position.y = parseFloat(lightY.value)));
  const lightZ = bind('lightZ', () => (dirLight.position.z = parseFloat(lightZ.value)));
  const intensity = bind('lightIntensity', () => (dirLight.intensity = parseFloat(intensity.value)));
  const shadowNear = bind('shadowNear', () => {
    dirLight.shadow.camera.near = parseFloat(shadowNear.value);
    dirLight.shadow.camera.updateProjectionMatrix();
  });
  const shadowFar = bind('shadowFar', () => {
    dirLight.shadow.camera.far = parseFloat(shadowFar.value);
    dirLight.shadow.camera.updateProjectionMatrix();
  });
  const shadowBias = bind('shadowBias', () => {
    dirLight.shadow.bias = parseFloat(shadowBias.value);
  });
}

export function createCameraControl(camera: THREE.PerspectiveCamera) {
  const cameraControls = document.createElement('div');
  cameraControls.style.position = 'absolute';
  cameraControls.style.bottom = '10px';
  cameraControls.style.right = '10px';
  cameraControls.style.color = '#ffffff';
  cameraControls.style.fontFamily = 'monospace';
  cameraControls.style.fontSize = '13px';
  cameraControls.style.backgroundColor = 'rgba(0,0,0,0.6)';
  cameraControls.style.padding = '10px';
  cameraControls.style.borderRadius = '8px';
  cameraControls.style.zIndex = '100';
  cameraControls.innerHTML = `
    <strong>🎥 Camera Controls</strong><br><br>
    <label>X: <input id="camX" type="range" min="-100" max="100" step="0.1" value="${camera.position.x}"> <span id="camXVal">${camera.position.x.toFixed(
    1,
  )}</span></label><br>
    <label>Y: <input id="camY" type="range" min="-100" max="100" step="0.1" value="${camera.position.y}"> <span id="camYVal">${camera.position.y.toFixed(
    1,
  )}</span></label><br>
    <label>Z: <input id="camZ" type="range" min="-100" max="100" step="0.1" value="${camera.position.z}"> <span id="camZVal">${camera.position.z.toFixed(
    1,
  )}</span></label>
  `;
  document.body.appendChild(cameraControls);

  function bind(id: string, onChange: () => void) {
    const input = document.getElementById(id) as HTMLInputElement;
    const span = document.getElementById(id + 'Val')!;
    input.addEventListener('input', () => {
      onChange();
      span.textContent = parseFloat(input.value).toFixed(1);
    });
    return input;
  }

  const camX = bind('camX', () => (camera.position.x = parseFloat(camX.value)));
  const camY = bind('camY', () => (camera.position.y = parseFloat(camY.value)));
  const camZ = bind('camZ', () => (camera.position.z = parseFloat(camZ.value)));
}

export function getAnimationById(id: string, Animations: AnimationsType): AnimationSet | undefined {
  return Object.values(Animations).find((animation) => animation.id === id);
}

export function checkId(id: string, Animations: AnimationsType): boolean {
  return Object.values(Animations).some((animation) => animation.id === id);
}

export function createCameraInfo() {
  const cameraInfo = document.createElement('div');
  cameraInfo.style.position = 'absolute';
  cameraInfo.style.top = '10px';
  cameraInfo.style.right = '10px';
  cameraInfo.style.color = '#00ff00';
  cameraInfo.style.fontFamily = 'monospace';
  cameraInfo.style.fontSize = '14px';
  cameraInfo.style.backgroundColor = 'rgba(0,0,0,0.5)';
  cameraInfo.style.padding = '5px 10px';
  cameraInfo.style.borderRadius = '5px';
  document.body.appendChild(cameraInfo);

  document.body.appendChild(cameraInfo);
  return cameraInfo;
}

export function tweenScaleTO(obj: THREE.Object3D, duration: number = 1, sc: number = 1) {

  obj.scale.set(0, 0, 0);

  gsap.to(obj.scale, {
    x: sc,
    y: sc,
    z: sc,
    duration: duration,
    ease: 'power4.in',
  });
}

export function addShadowSupport(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (!child.geometry.attributes.normal) {
        child.geometry.computeVertexNormals();
      }
      if (child.material) {
        child.material.depthWrite = true;
        child.material.needsUpdate = true;
      }
    }
  });
}

export function tweenLightColor(light: THREE.DirectionalLight, targetColor: THREE.Color, duration = 1) {
  const currentColor = {
    r: light.color.r,
    g: light.color.g,
    b: light.color.b,
  };

  const target = {
    r: targetColor.r,
    g: targetColor.g,
    b: targetColor.b,
  };

  gsap.to(currentColor, {
    duration,
    r: target.r,
    g: target.g,
    b: target.b,
    onUpdate: () => {
      light.color.setRGB(currentColor.r, currentColor.g, currentColor.b);
    },
  });
}

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
