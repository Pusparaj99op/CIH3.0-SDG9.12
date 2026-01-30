import * as THREE from 'three';
import { isMobile, prefersReducedMotion } from './animations';

// Create a floating bond card in 3D
export const createFloatingBond = (scene: THREE.Scene, position: THREE.Vector3) => {
  // Create card geometry
  const geometry = new THREE.BoxGeometry(2, 3, 0.1);

  // Create gradient material
  const material = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    metalness: 0.3,
    roughness: 0.4,
    emissive: 0x1e40af,
    emissiveIntensity: 0.2,
  });

  const bond = new THREE.Mesh(geometry, material);
  bond.position.copy(position);
  bond.castShadow = true;
  bond.receiveShadow = true;

  scene.add(bond);

  return bond;
};

// Create multiple floating bonds in a grid
export const createFloatingBondsGrid = (
  scene: THREE.Scene,
  count: number = 6
): THREE.Mesh[] => {
  const bonds: THREE.Mesh[] = [];
  const gridSize = Math.ceil(Math.sqrt(count));
  const spacing = 4;

  for (let i = 0; i < count; i++) {
    const x = (i % gridSize - gridSize / 2) * spacing;
    const y = Math.floor(i / gridSize) * spacing;
    const z = Math.random() * 2 - 1;

    const position = new THREE.Vector3(x, y, z);
    const bond = createFloatingBond(scene, position);
    bonds.push(bond);
  }

  return bonds;
};

// Animate floating bonds (gentle floating motion)
export const animateFloatingBonds = (bonds: THREE.Mesh[], time: number) => {
  if (prefersReducedMotion()) return;

  bonds.forEach((bond, index) => {
    // Gentle floating motion
    bond.position.y += Math.sin(time * 0.5 + index) * 0.01;
    bond.rotation.y += 0.005;

    // Subtle rotation on mobile, more on desktop
    if (!isMobile()) {
      bond.rotation.x = Math.sin(time * 0.3 + index) * 0.1;
    }
  });
};

// Create a data visualization sphere
export const createDataSphere = (
  scene: THREE.Scene,
  position: THREE.Vector3,
  value: number,
  maxValue: number
): THREE.Mesh => {
  const radius = (value / maxValue) * 2 + 0.5;
  const geometry = new THREE.SphereGeometry(radius, 32, 32);

  // Color based on value
  const hue = (value / maxValue) * 0.3; // Green to blue
  const color = new THREE.Color().setHSL(hue, 0.7, 0.6);

  const material = new THREE.MeshPhongMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.8,
  });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.copy(position);
  sphere.castShadow = true;

  scene.add(sphere);

  return sphere;
};

// Create ambient lighting for 3D scenes
export const createSceneLighting = (scene: THREE.Scene) => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Directional light (main light)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);

  // Point light for accent
  const pointLight = new THREE.PointLight(0x3b82f6, 0.5, 10);
  pointLight.position.set(-3, 3, 3);
  scene.add(pointLight);

  return { ambientLight, directionalLight, pointLight };
};

// Create particle field background (lightweight)
export const createGradientBackground = (scene: THREE.Scene) => {
  // Create a gradient sphere as background
  const geometry = new THREE.SphereGeometry(50, 32, 32);

  // Shader material for gradient
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color(0x1e1b4b) }, // Deep purple
      color2: { value: new THREE.Color(0x0f172a) }, // Dark slate
    },
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec3 vPosition;
      void main() {
        float mixValue = (vPosition.y + 50.0) / 100.0;
        gl_FragColor = vec4(mix(color1, color2, mixValue), 1.0);
      }
    `,
    side: THREE.BackSide,
  });

  const background = new THREE.Mesh(geometry, material);
  scene.add(background);

  return background;
};

// Create animated gradient plane
export const createGradientPlane = (
  width: number = 20,
  height: number = 20
): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(width, height, 32, 32);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(0x6366f1) }, // Indigo
      color2: { value: new THREE.Color(0x3b82f6) }, // Blue
      color3: { value: new THREE.Color(0x8b5cf6) }, // Purple
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;

      void main() {
        vUv = uv;
        vPosition = position;

        vec3 pos = position;
        pos.z += sin(pos.x * 2.0 + time) * 0.5;
        pos.z += cos(pos.y * 2.0 + time) * 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        float mixValue1 = sin(vUv.x * 3.14159 + time * 0.5) * 0.5 + 0.5;
        float mixValue2 = cos(vUv.y * 3.14159 + time * 0.3) * 0.5 + 0.5;

        vec3 color = mix(color1, color2, mixValue1);
        color = mix(color, color3, mixValue2);

        gl_FragColor = vec4(color, 0.6);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const plane = new THREE.Mesh(geometry, material);
  return plane;
};

// Update gradient plane animation
export const updateGradientPlane = (plane: THREE.Mesh, time: number) => {
  if (prefersReducedMotion()) return;

  const material = plane.material as THREE.ShaderMaterial;
  if (material.uniforms && material.uniforms.time) {
    material.uniforms.time.value = time;
  }
};

// Create orbit path for data points
export const createOrbitPath = (
  radius: number,
  color: number = 0x3b82f6
): THREE.Line => {
  const points: THREE.Vector3[] = [];
  const segments = 64;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    points.push(new THREE.Vector3(x, y, 0));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.3,
  });

  return new THREE.Line(geometry, material);
};

// Helper to dispose of 3D objects properly
export const disposeObject = (object: THREE.Object3D) => {
  if (object instanceof THREE.Mesh) {
    if (object.geometry) {
      object.geometry.dispose();
    }
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
    }
  }
};

// Clean up entire scene
export const cleanupScene = (scene: THREE.Scene) => {
  scene.traverse((object) => {
    disposeObject(object);
  });
  scene.clear();
};

export default {
  createFloatingBond,
  createFloatingBondsGrid,
  animateFloatingBonds,
  createDataSphere,
  createSceneLighting,
  createGradientBackground,
  createGradientPlane,
  updateGradientPlane,
  createOrbitPath,
  disposeObject,
  cleanupScene,
};
