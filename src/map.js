const { invoke } = window.__TAURI__.core;

async function getUserCompletion(keyName) {
    try {
        if(!keyName) return 1;
        let value = await invoke('get_user_value', {userKey: keyName});
        if(value===null || value == undefined) {
            await invoke('set_user_value', {userKey: username}, {value: 3});
            value = 3;
        }
        return value;
    } catch(err) {
        console.error(err);
        return 1;
    }
}


let completionInt = 3;

async function userSessionInitialize() {
    try {
        const active = await invoke('get_active_profile');
        if(!active || !active.username) {
            window.location.href = 'index.html';
            return;
        }

        currentUsername = active.username;
        completionInt = await getUserCompletion(currentUsername);
    } catch(err) {
        console.error("cant load active profile");
        window.location.href = 'index.html';
    }
}

userSessionInitialize();



// ============================================================
// 1. SCENE SETUP & BACKGROUND
// ============================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color('#dbdbdb');

// ============================================================
// 2. ROLLER COASTER TYCOON ISOMETRIC ORTHOGRAPHIC CAMERA
// ============================================================
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 36;

const camera = new THREE.OrthographicCamera(
  (-frustumSize * aspect) / 2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  -frustumSize / 2,
  0.1,
  1000
);
// True Isometric Angle (RCT Style): 45° yaw around Y, 35.264° pitch down (arctan(1 / sqrt(2)))
const ISO_DIST = 150;
const ISO_Y = ISO_DIST * Math.sin(Math.atan(1 / Math.SQRT2)); // ~86.6
const ISO_XZ = ISO_DIST * Math.cos(Math.atan(1 / Math.SQRT2)) * Math.SQRT1_2; // ~86.6

// Pan center target on ground plane
let targetPanX = 0;
let targetPanZ = 0;
let currentPanX = 0;
let currentPanZ = 0;

camera.position.set(currentPanX + ISO_XZ, ISO_Y, currentPanZ + ISO_XZ);
camera.lookAt(currentPanX, 0, currentPanZ);

// ============================================================
// 3. WEBGL RENDERER
// ============================================================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// ============================================================
// 4. ISOMETRIC GRID TEXTURE & INFINITE PLANE
// ============================================================
const GRID_CELL_SIZE = 2;
const TEXTURE_PIXELS = 512;

function createGridTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_PIXELS;
  canvas.height = TEXTURE_PIXELS;
  const ctx = canvas.getContext('2d');

  // Background tile
  ctx.fillStyle = '#bcbcbc';
  ctx.fillRect(0, 0, TEXTURE_PIXELS, TEXTURE_PIXELS);

  // Sub-grid lines (fine grid)
  ctx.strokeStyle = 'rgba(137, 137, 137, 0.69)';
  ctx.lineWidth = 1;
  const subDiv = 4;
  const subStep = TEXTURE_PIXELS / subDiv;
  for (let i = 0; i <= TEXTURE_PIXELS; i += subStep) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, TEXTURE_PIXELS);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(TEXTURE_PIXELS, i);
    ctx.stroke();
  }

  // Major tile border lines (isometric grid tiles)
  ctx.strokeStyle = 'rgba(40, 40, 40, 0.95)';
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, TEXTURE_PIXELS - 3, TEXTURE_PIXELS - 3);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const gridTexture = createGridTexture();

// Large plane mesh centered under camera
const PLANE_SIZE = 800;
const tileSizeWorld = GRID_CELL_SIZE * 4;
const planeRepeatCount = PLANE_SIZE / tileSizeWorld;
gridTexture.repeat.set(planeRepeatCount, planeRepeatCount);

const planeGeometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({
  map: gridTexture,
  side: THREE.DoubleSide
});

const groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
groundPlane.rotation.x = -Math.PI / 2; // Flat on XZ plane
scene.add(groundPlane);

// ============================================================
// 5. HARDCODED MAP POINTS & ORDERED CONNECTING LINES
// ============================================================
const MAP_POINTS = [
  { id: 'What is a PC',     x: 80,   z: 0,   iconSvg: 'assets/icons/hq.svg', desc: 'Central tactical operations and network control hub.' },
  { id: 'Programming',  x: 50, z: -16, iconSvg: 'assets/icons/power.svg', desc: 'High-voltage reactor grid delivering primary base power.' },
  { id: 'Variables',   x: 26,  z: -5, iconSvg: 'assets/icons/lab.svg', desc: 'Advanced laboratory conducting atmospheric and material analysis.' },
  { id: 'Math Functions',  x: 0,  z: 8,   iconSvg: 'assets/icons/storage.svg', desc: 'Logistics center and automated supply storage facility.' },
  { id: 'Lists', x: -26,  z: 24,  iconSvg: 'assets/icons/launch.svg', desc: 'Deep-space payload transport and launch pad complex.' },
  { id: 'Conditions',   x: -64, z: 32,  iconSvg: 'assets/icons/beacon.svg', desc: 'Long-range satellite transceiver and telemetry relay array.' },
  { id: 'For Loop',   x: -98, z: 20,  iconSvg: 'assets/icons/mining.svg', desc: 'Heavy mineral extraction facility and core drill platform.' }
];



// 5a. Alternating half-cycle sine wave connecting lines between consecutive points
const WAVE_AMPLITUDE = 3.5; // Curvature height of the weave
const SAMPLES_PER_SEGMENT = 40; // Samples per line segment for smooth curvature

const linePoints = [];

for (let i = 0; i < MAP_POINTS.length - 1; i++) {
  const pA = MAP_POINTS[i];
  const pB = MAP_POINTS[i + 1];

  const dx = pB.x - pA.x;
  const dz = pB.z - pA.z;
  const dist = Math.hypot(dx, dz);

  // Perpendicular 2D normal vector on ground plane
  const nx = -dz / dist;
  const nz = dx / dist;

  // Alternate wave direction: 1st point-to-point is half cycle (+), next is other half (-)
  const sign = (i % 2 === 0) ? 1 : -1;

  for (let s = 0; s < SAMPLES_PER_SEGMENT; s++) {
    const t = s / SAMPLES_PER_SEGMENT;
    // Half cycle sine curve (0 to pi)
    const waveOffset = sign * WAVE_AMPLITUDE * Math.sin(Math.PI * t);

    const x = pA.x + t * dx + nx * waveOffset;
    const z = pA.z + t * dz + nz * waveOffset;

    linePoints.push(new THREE.Vector3(x, 0.4, z));
  }
}

// Add the final point to close the last segment
const lastPoint = MAP_POINTS[MAP_POINTS.length - 1];
linePoints.push(new THREE.Vector3(lastPoint.x, 0.4, lastPoint.z));

const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x1A1F30,
  transparent: true,
  opacity: 1,
  linewidth: 8
});
const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);

const routeLine = new THREE.Line(lineGeometry, lineMaterial);
scene.add(routeLine);

// 5b. Point Meshes & Sprites with SVG Icons
function createPointLabelSprite(text, iconSvgPath, colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 440;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');

  function redraw(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pill badge background
    ctx.fillStyle = 'rgba(10, 16, 31, 0.9)';
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(8, 8, 424, 104, 24);
    ctx.fill();
    ctx.stroke();

    // Icon badge background circle
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.beginPath();
    ctx.arc(58, 60, 36, 0, Math.PI * 2);
    ctx.fill();

    // Draw SVG Icon
    if (img && img.complete) {
      ctx.drawImage(img, 32, 34, 52, 52);
    }

    // Draw Point Label text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 110, 60);
  }

  redraw(null);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const iconImg = new Image();
  iconImg.onload = () => {
    redraw(iconImg);
    texture.needsUpdate = true;
  };
  iconImg.src = iconSvgPath;

  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false
  });

  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(7.5, 2.05, 1);
  sprite.position.y = 3.6;
  return sprite;
}

const pointMeshes = [];
const clickableTargets = [];
const ringGeometry = new THREE.RingGeometry(10, 10, 10);
const hltGeometry = new THREE.CylinderGeometry(1, 1, 1, 30);
const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 16);
const headGeometry = new THREE.SphereGeometry(0.8, 24, 24);

MAP_POINTS.forEach((pt, idx) => {
  const group = new THREE.Group();
  group.position.set(pt.x, 0, pt.z);


    ringMat = new THREE.MeshBasicMaterial({
        color: 0x4475F2,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
    });

  if(idx+1 > completionInt) {
    ringMat = new THREE.MeshBasicMaterial({
        color: 0x2A7ED1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
    });
  } else if(idx+1 == completionInt) {
        ringMat = new THREE.MeshBasicMaterial({
        color: 0xDB7846,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
    });
  } else {
    ringMat = new THREE.MeshBasicMaterial({
        color: 0x565659,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });
  }

  const ring = new THREE.Mesh(ringGeometry, ringMat);
  ring.rotation.x = 0;
  ring.position.y = 0.05;
  ring.isActive = idx+1==completionInt;
  group.add(ring);

  // 2. Vertical Pin Stem
  const stemMat = new THREE.MeshBasicMaterial({ color: 0x472622 });
  const stem = new THREE.Mesh(stemGeometry, stemMat);
  stem.position.y = 1.0;
  group.add(stem);

  // 3. Glowing Beacon Sphere (Clickable)
  const headMat = new THREE.MeshBasicMaterial({ color: pt.hex });
  const head = new THREE.Mesh(headGeometry, headMat);
  head.position.y = 2.2;
  head.userData = { ptGroup: group, ptData: pt };
  group.add(head);

  // 4. Floating 3D Icon & Text Badge
  const labelSprite = createPointLabelSprite(pt.id, pt.iconSvg, pt.color);
  labelSprite.userData = { ptGroup: group, ptData: pt };
  group.add(labelSprite);

  group.userData = { ring, head, labelSprite, pt };
  scene.add(group);
  pointMeshes.push(group);
  clickableTargets.push(head, labelSprite);
});

// ============================================================
// 6. CLICK DETECTION & POINT CARD MODAL
// ============================================================
const pointCard = document.getElementById('point-card');
const cardIcon = document.getElementById('card-icon');
const cardTitle = document.getElementById('card-title');
const cardCoords = document.getElementById('card-coords');
const cardDesc = document.getElementById('card-desc');
const cardCloseBtn = document.getElementById('card-close');

cardCloseBtn?.addEventListener('click', () => {
  if (pointCard) pointCard.style.display = 'none';
});

function showPointDetails(pt) {
  if (!pointCard) return;
  if (cardIcon) {
    cardIcon.src = pt.iconSvg;
    cardIcon.style.borderColor = pt.color;
  }
  if (cardTitle) {
    cardTitle.textContent = pt.id;
    cardTitle.style.color = pt.color;
  }
  if (cardCoords) cardCoords.textContent = `X: ${pt.x.toFixed(1)}, Z: ${pt.z.toFixed(1)}`;
  if (cardDesc) cardDesc.textContent = pt.desc || 'Operational waypoint on the isometric map.';
  pointCard.style.display = 'block';
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ============================================================
// 7. ISOMETRIC SCREEN-SPACE PANNING & CLICK SELECTION
// ============================================================
let isDragging = false;
let pointerDownPos = { x: 0, y: 0 };
let previousPointer = { x: 0, y: 0 };

window.addEventListener('pointerdown', (e) => {
  if (e.target.closest('#point-card') || e.target.tagName === 'BUTTON') return;
  isDragging = true;
  pointerDownPos = { x: e.clientX, y: e.clientY };
  previousPointer = { x: e.clientX, y: e.clientY };
  document.body.style.cursor = 'grabbing';
});

// Maximum allowed pan distance from the center (0, 0)
const MAX_PAN_RADIUS = 65;

function clampPanTarget() {
  const dist = Math.hypot(targetPanX, targetPanZ);
  if (dist > MAX_PAN_RADIUS) {
    targetPanX = (targetPanX / dist) * MAX_PAN_RADIUS;
    targetPanZ = (targetPanZ / dist) * MAX_PAN_RADIUS;
  }
}

window.addEventListener('pointermove', (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - previousPointer.x;
  const deltaY = e.clientY - previousPointer.y;

  // Natural grab-and-drag isometric panning (corrected horizontal axis)
  const scale = frustumSize / (window.innerHeight * camera.zoom);
  const factor = scale * 0.7071;

  const worldDeltaX = (-deltaX - deltaY * Math.SQRT2) * factor;
  const worldDeltaZ = (deltaX - deltaY * Math.SQRT2) * factor;

  targetPanX += worldDeltaX;
  targetPanZ += worldDeltaZ;

  clampPanTarget();

  previousPointer = { x: e.clientX, y: e.clientY };
});

window.addEventListener('pointerup', (e) => {
  const dragDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);

  // If clicked without dragging (short click < 6px), raycast to check for point selection
  if (dragDist < 6 && e.target === renderer.domElement) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableTargets);

    if (intersects.length > 0) {
      const hitData = intersects[0].object.userData.ptData;
      if (hitData) showPointDetails(hitData);
    } else {
      // Clicked on empty space -> close details
      if (pointCard) pointCard.style.display = 'none';
    }
  }

  isDragging = false;
  document.body.style.cursor = 'grab';
});

// ============================================================
// 8. ZOOMING (WITH DYNAMIC PERSPECTIVE SHIFT)
// ============================================================
const MIN_ZOOM = 0.35;
const MAX_ZOOM = 3.5;
let targetZoom = 1.0;

function setZoom(factor) {
  targetZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetZoom * factor));
}

window.addEventListener('wheel', (e) => {
  const factor = e.deltaY < 0 ? 1.15 : 0.87;
  setZoom(factor);
});

document.getElementById('zoom-in')?.addEventListener('click', () => setZoom(1.25));
document.getElementById('zoom-out')?.addEventListener('click', () => setZoom(0.8));

// ============================================================
// 7. WINDOW RESIZE HANDLER
// ============================================================
window.addEventListener('resize', () => {
  const newAspect = window.innerWidth / window.innerHeight;
  camera.left = (-frustumSize * newAspect) / 2;
  camera.right = (frustumSize * newAspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================================
// 8. ANIMATION LOOP & SEAMLESS INFINITE PLANE TRACKING
// ============================================================
// Lowered pitch angles for a more cinematic ground perspective
const PITCH_ZOOMED_OUT = Math.PI * 0.20; // ~36.0° overview
const PITCH_ZOOMED_IN  = Math.PI * 0.10; // ~18.0° shallow ground angle
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // Smoothly interpolate pan positions (inertia damping)
  currentPanX += (targetPanX - currentPanX) * 0.12;
  currentPanZ += (targetPanZ - currentPanZ) * 0.12;

  // Smoothly interpolate camera zoom
  if (Math.abs(camera.zoom - targetZoom) > 0.0005) {
    camera.zoom += (targetZoom - camera.zoom) * 0.12;
    camera.updateProjectionMatrix();
  }

  // Calculate dynamic pitch angle based on zoom level (like zooming from orbit down to surface)
  const zoomProgress = (camera.zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM);
  const currentPitch = PITCH_ZOOMED_OUT + (PITCH_ZOOMED_IN - PITCH_ZOOMED_OUT) * zoomProgress;

  const dynamicCamY = ISO_DIST * Math.sin(currentPitch);
  const dynamicCamXZ = ISO_DIST * Math.cos(currentPitch) * Math.SQRT1_2;

  // Update dynamic isometric camera position & lookAt target
  camera.position.set(currentPanX + dynamicCamXZ, dynamicCamY, currentPanZ + dynamicCamXZ);
  camera.lookAt(currentPanX, 0, currentPanZ);

  // Animate pulsing ground rings for all map points
  pointMeshes.forEach((group, idx) => {
    const ring = group.userData.ring;
    if (ring && ring.isActive) {
      const pulse = 1.0 + Math.sin(elapsedTime * 3.0 + idx * 0.9) * 0.16;
      ring.scale.set(pulse, pulse, 1);
    }
  });

    pointMeshes.forEach((group, idx) => {
    const ring = group.userData.ring;
    if (ring && ring.isActive) {
      const pulse = 3.0 + Math.sin(elapsedTime * 3.0 + idx * 0.9) * 0.16;
      ring.scale.set(1, pulse, 1);
    }
  });

  // Keep plane centered under camera while texture offset creates infinite seamless scrolling
  groundPlane.position.x = currentPanX;
  groundPlane.position.z = currentPanZ;

  gridTexture.offset.x = (currentPanX / tileSizeWorld);
  gridTexture.offset.y = (-currentPanZ / tileSizeWorld);

  renderer.render(scene, camera);
}

animate();