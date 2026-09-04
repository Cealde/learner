// ============================================================
// MAP INITIALIZATION & STATE
// ============================================================
let currentUsername = 'Guest';
let completionInt = 1;
let currentSubNo = 1;
let currentSpecNo = 1;

userSessionInitialize(
    (username, lessonNo, subNo, specNo) => {
        currentUsername = username;
        completionInt = lessonNo;
        currentSubNo = subNo;
        currentSpecNo = specNo;
    },
    () => {
        window.location.href = 'index.html';
    }
);

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

// True Isometric Angle (RCT Style): 45° yaw around Y, 35.264° pitch down
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
// Large plane mesh centered under camera

const GRID_CELL_SIZE = 2;
const gridTexture = createTexturedGrid('../assets/textures/ground.png', 512, 4);
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
groundPlane.rotation.x = -Math.PI / 2;
scene.add(groundPlane);

// ============================================================
// 5. HARDCODED MAP POINTS & ORDERED CONNECTING LINES
// ============================================================
const MAP_POINTS = [
    { id: 'What is a PC', x: 80, z: 0, iconSvg: '../assets/icons/hq.svg', desc: 'gay nigga' },
    { id: 'Programming', x: 50, z: -16, iconSvg: '../assets/icons/power.svg', desc: 'High-voltage reactor grid delivering primary base power.' },
    { id: 'Variables', x: 26, z: -5, iconSvg: '../assets/icons/lab.svg', desc: 'Advanced laboratory conducting atmospheric and material analysis.' },
    { id: 'Math Functions', x: 0, z: 8, iconSvg: '../assets/icons/storage.svg', desc: 'Logistics center and automated supply storage facility.' },
    { id: 'Lists', x: -26, z: 24, iconSvg: '../assets/icons/launch.svg', desc: 'Deep-space payload transport and launch pad complex.' },
    { id: 'Conditions', x: -64, z: 32, iconSvg: '../assets/icons/beacon.svg', desc: 'Long-range satellite transceiver and telemetry relay array.' },
    { id: 'For Loop', x: -98, z: 20, iconSvg: '../assets/icons/mining.svg', desc: 'Heavy mineral extraction facility and core drill platform.' }
];

const WAVE_AMPLITUDE = 3.5;
const SAMPLES_PER_SEGMENT = 40;

const LINE_STYLES = {
    completed: { color: '#4eff45', opacity: 1.0, linewidth: 12 },
    incomplete: { color: '#adadad', opacity: 1.0, linewidth: 12 }
};
const routeGroup = new THREE.Group();
for (let i = 0; i < MAP_POINTS.length - 1; i++) {
    const pA = MAP_POINTS[i];
    const pB = MAP_POINTS[i + 1];

    const isCompleted = (i + 2 <= completionInt);
    const style = isCompleted ? LINE_STYLES.completed : LINE_STYLES.incomplete;
    const dx = pB.x - pA.x;
    const dz = pB.z - pA.z;
    const dist = Math.hypot(dx, dz);
    const nx = -dz / dist;
    const nz = dx / dist;

    const sign = (i % 2 === 0) ? 1 : -1;

    const segmentPoints = [];
    for (let s = 0; s <= SAMPLES_PER_SEGMENT; s++) {
        const t = s / SAMPLES_PER_SEGMENT;
        const waveOffset = sign * WAVE_AMPLITUDE * Math.sin(Math.PI * t);
        const x = pA.x + t * dx + nx * waveOffset;
        const z = pA.z + t * dz + nz * waveOffset;
        segmentPoints.push(new THREE.Vector3(x, 0.4, z));
    }
    const segmentGeometry = new THREE.BufferGeometry().setFromPoints(segmentPoints);
    const segmentMaterial = new THREE.LineBasicMaterial({
        color: style.color,
        transparent: true,
        opacity: style.opacity,
        linewidth: style.linewidth
    });
    const segmentLine = new THREE.Line(segmentGeometry, segmentMaterial);
    routeGroup.add(segmentLine);
}
scene.add(routeGroup);

// 5b. Point Meshes & Sprites
const pointMeshes = [];
const clickableTargets = [];
const ringGeometry = new THREE.RingGeometry(1.2, 1.6, 32);
const stemGeometry = new THREE.CylinderGeometry(0.1, 0.3, 2.0, 16);
const headGeometry = new THREE.SphereGeometry(0.8, 24, 24);


MAP_POINTS.forEach((pt, idx) => {
    const group = new THREE.Group();
    group.position.set(pt.x, 0, pt.z);

    let hlt = null;
    let swirl = null;

    pt.page_no = idx + 1;

    if (idx + 1 > completionInt) { // Incomplete
        pt.sphere_color = '#73628A';
        pt.ring_opacity = 0.6;
        pt.ring_color = '#CBC5EA';
        pt.stem_color = '#313D5A';
        pt.status = 0;
    } else if (idx + 1 === completionInt) { // Active
        pt.sphere_color = '#F5AF40';
        pt.ring_opacity = 0.9;
        pt.ring_color = '#F2E86D';
        pt.stem_color = '#6C4F1A';
        pt.status = 1;

        const hltGeometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 30, 1, true);
        const hltMat = new THREE.MeshBasicMaterial({
            color: pt.ring_color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        hlt = new THREE.Mesh(hltGeometry, hltMat);
        hlt.position.y = 0.05;
        group.add(hlt);

        swirl = createSwirlParticles(60, 2, 3.0, '#D3DFB8');
        swirl.position.y = 0.05;
        group.add(swirl);
    } else { // Completed
        pt.sphere_color = '#4AAD52';
        pt.ring_opacity = 1;
        pt.ring_color = '#6EB257';
        pt.stem_color = '#507255';
        pt.status = 2;
    }

    const headMat = new THREE.MeshBasicMaterial({ color: pt.sphere_color });
    const ringMat = new THREE.MeshBasicMaterial({
        color: pt.ring_color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: pt.ring_opacity
    });

    const ring = new THREE.Mesh(ringGeometry, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    ring.isActive = (idx + 1 === completionInt);
    group.add(ring);

    // Stem
    const stemMat = new THREE.MeshBasicMaterial({ color: pt.stem_color });
    const stem = new THREE.Mesh(stemGeometry, stemMat);
    stem.position.y = 1.0;
    group.add(stem);

    // Sphere Head
    const head = new THREE.Mesh(headGeometry, headMat);
    head.position.y = 2.2;
    head.userData = { ptGroup: group, ptData: pt };
    group.add(head);

    // Icon + Label Sprite
    const labelSprite = createPointLabelSprite(pt.id, pt.iconSvg, pt.color);
    labelSprite.userData = { ptGroup: group, ptData: pt };
    group.add(labelSprite);

    group.userData = { ring, head, labelSprite, pt, hlt, swirl };
    scene.add(group);
    pointMeshes.push(group);
    clickableTargets.push(head, labelSprite);
});

scatterTrees(scene, MAP_POINTS);

// ============================================================
// 6. CLICK DETECTION & POINT CARD MODAL
// ============================================================
const pointCard = document.getElementById('point-card');
const cardIcon = document.getElementById('card-icon');
const cardTitle = document.getElementById('card-title');
const cardCoords = document.getElementById('card-coords');
const cardDesc = document.getElementById('card-desc');
const cardCloseBtn = document.getElementById('card-close');
const visitBtn = document.getElementById('visit-btn');

cardCloseBtn?.addEventListener('click', () => {
    if (pointCard) pointCard.style.display = 'none';
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ============================================================
// 7. ISOMETRIC SCREEN-SPACE PANNING & CLICK SELECTION
// ============================================================
let isDragging = false;
let pointerDownPos = { x: 0, y: 0 };
let previousPointer = { x: 0, y: 0 };
const MAX_PAN_RADIUS = 65;

function updatePanBounds() {
    const clamped = clampPan(targetPanX, targetPanZ, MAX_PAN_RADIUS);
    targetPanX = clamped.x;
    targetPanZ = clamped.z;
}

window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#point-card') || e.target.tagName === 'BUTTON') return;
    isDragging = true;
    pointerDownPos = { x: e.clientX, y: e.clientY };
    previousPointer = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = 'grabbing';
});

window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousPointer.x;
    const deltaY = e.clientY - previousPointer.y;

    const scale = frustumSize / (window.innerHeight * camera.zoom);
    const factor = scale * 0.7071;

    const worldDeltaX = (-deltaX - deltaY * Math.SQRT2) * factor;
    const worldDeltaZ = (deltaX - deltaY * Math.SQRT2) * factor;

    targetPanX += worldDeltaX;
    targetPanZ += worldDeltaZ;
    updatePanBounds();

    previousPointer = { x: e.clientX, y: e.clientY };
});

window.addEventListener('pointerup', (e) => {
    const dragDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);

    if (dragDist < 6 && e.target === renderer.domElement) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableTargets);

        if (intersects.length > 0) {
            const hitData = intersects[0].object.userData.ptData;
            if (hitData) {
                showPointDetails(hitData, pointCard, cardIcon, cardTitle, cardCoords, cardDesc, visitBtn, currentSubNo, currentSpecNo);
            }
        } else {
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
// 9. WINDOW RESIZE HANDLER
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
// 10. ANIMATION LOOP & SEAMLESS INFINITE PLANE TRACKING
// ============================================================
const PITCH_ZOOMED_OUT = Math.PI * 0.20;
const PITCH_ZOOMED_IN = Math.PI * 0.10;
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth pan inertia
    currentPanX += (targetPanX - currentPanX) * 0.12;
    currentPanZ += (targetPanZ - currentPanZ) * 0.12;

    // Smooth zoom interpolation
    if (Math.abs(camera.zoom - targetZoom) > 0.0005) {
        camera.zoom += (targetZoom - camera.zoom) * 0.12;
        camera.updateProjectionMatrix();
    }

    // Dynamic pitch angle calculation
    const zoomProgress = (camera.zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM);
    const currentPitch = PITCH_ZOOMED_OUT + (PITCH_ZOOMED_IN - PITCH_ZOOMED_OUT) * zoomProgress;

    const dynamicCamY = ISO_DIST * Math.sin(currentPitch);
    const dynamicCamXZ = ISO_DIST * Math.cos(currentPitch) * Math.SQRT1_2;

    camera.position.set(currentPanX + dynamicCamXZ, dynamicCamY, currentPanZ + dynamicCamXZ);
    camera.lookAt(currentPanX, 0, currentPanZ);

    // Animate active point pulse and swirl particles
    pointMeshes.forEach((group, idx) => {
        const ring = group.userData.ring;
        if (ring && ring.isActive) {
            const pulse = 1.0 + Math.sin(elapsedTime * 3.0 + idx * 0.9) * 0.16;

            if (group.userData.hlt) {
                group.userData.hlt.scale.set(pulse, pulse, pulse);
            }

            ring.scale.set(pulse, pulse, 1);

            const swirl = group.userData.swirl;
            if (!swirl) return;

            const posAttr = swirl.geometry.attributes.position;
            const data = swirl.userData.particleData;
            const maxHeight = swirl.userData.maxHeight;

            for (let i = 0; i < data.length; i++) {
                const p = data[i];
                p.angle += p.angularSpeed;
                p.y += p.speedY;

                if (p.y > maxHeight) {
                    p.y = 0;
                }

                posAttr.setXYZ(
                    i,
                    Math.cos(p.angle) * p.radius,
                    p.y,
                    Math.sin(p.angle) * p.radius
                );
            }
            posAttr.needsUpdate = true;
        }
    });

    // Seamless plane offset
    groundPlane.position.x = currentPanX;
    groundPlane.position.z = currentPanZ;
    gridTexture.offset.x = (currentPanX / tileSizeWorld);
    gridTexture.offset.y = (-currentPanZ / tileSizeWorld);

    renderer.render(scene, camera);
}

animate();