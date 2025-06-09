import WebGL from 'three/addons/capabilities/WebGL.js';
import { createScene } from './Game';
(async () => {
  if (WebGL.isWebGL2Available()) {
    await createScene();
  } else {
    const warning = WebGL.getWebGL2ErrorMessage();
    const container = document.getElementById('container');
    if (container) {
      container.appendChild(warning);
    } else {
      document.body.appendChild(warning);
    }
  }
})();
