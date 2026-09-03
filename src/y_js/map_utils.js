// ============================================================
// MAP UTILITY FUNCTIONS & GENERATORS
// ============================================================

const { invoke } = window.__TAURI__ ? window.__TAURI__.core : { invoke: null };

// 1. User session & completion helpers
async function getUserCompletion(keyName, defaultVal = 1) {
    if (!invoke) return defaultVal;
    try {
        if (!keyName) return defaultVal;
        let value = await invoke('get_user_value', { userKey: keyName });
        if (value === null || value === undefined) {
            await invoke('set_user_value', { userKey: keyName, value: defaultVal });
            value = defaultVal;
        }
        return value;
    } catch (err) {
        console.error('Error fetching user completion:', err);
        return defaultVal;
    }
}

async function userSessionInitialize(onSuccess, onFail) {
    if (!invoke) {
        if (onSuccess) onSuccess('Guest', 3);
        return;
    }
    try {
        const active = await invoke('get_active_profile');
        if (!active || !active.username) {
            if (onFail) onFail();
            else window.location.href = 'index.html';
            return;
        }
        const currentUsername = active.username;
        const completion = await getUserCompletion(currentUsername, 3);
        if (onSuccess) onSuccess(currentUsername, completion);
    } catch (err) {
        console.error('Failed to load active profile:', err);
        if (onFail) onFail();
        else window.location.href = 'index.html';
    }
}

// 2. Procedural grid texture generator
function createGridTexture(tileSize = 512, subDiv = 4) {
    const canvas = document.createElement('canvas');
    canvas.width = tileSize;
    canvas.height = tileSize;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#bcbcbc';
    ctx.fillRect(0, 0, tileSize, tileSize);

    // Sub-grid lines (fine grid)
    ctx.strokeStyle = 'rgba(137, 137, 137, 0.69)';
    ctx.lineWidth = 1;
    const subStep = tileSize / subDiv;
    for (let i = 0; i <= tileSize; i += subStep) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, tileSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(tileSize, i);
        ctx.stroke();
    }

    // Major tile border lines
    ctx.strokeStyle = 'rgba(40, 40, 40, 0.95)';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, tileSize - 3, tileSize - 3);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

const textureLoader = new THREE.TextureLoader();

const barkTexture = textureLoader.load('assets/textures/bark.png');
barkTexture.colorSpace = THREE.SRGBColorSpace;

const leavesTexture = textureLoader.load('assets/textures/leaves.png');
leavesTexture.colorSpace = THREE.SRGBColorSpace;

const trunkMaterial = new THREE.MeshBasicMaterial({
  map: barkTexture,
  color: 0x8b5a2b
});
const foliageMaterial = new THREE.MeshBasicMaterial({
  map: leavesTexture,
  color: 0xffffff
});

function createTexturedGrid(baseImagePath, tileSize = 512, subDiv = 4) {
    const canvas = document.createElement('canvas');
    canvas.width = tileSize;
    canvas.height = tileSize;
    const ctx = canvas.getContext('2d');

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    const baseImage = new Image();
    baseImage.onload = () => {
        // 1. Draw the base texture image
        ctx.drawImage(baseImage, 0, 0, tileSize, tileSize);

        // 2. Draw sub-grid lines on top
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'; // Adjust line color & opacity
        ctx.lineWidth = 1;
        const subStep = tileSize / subDiv;
        for (let i = 0; i <= tileSize; i += subStep) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, tileSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(tileSize, i);
            ctx.stroke();
        }

        // 3. Draw major tile border on top
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
        ctx.lineWidth = 3;
        ctx.strokeRect(1.5, 1.5, tileSize - 3, tileSize - 3);

        texture.needsUpdate = true;
    };
    baseImage.src = baseImagePath;

    return texture;
}

const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.3, 1.0, 5);
const foliageGeo1 = new THREE.ConeGeometry(1.3, 1.8, 5);
const foliageGeo2 = new THREE.ConeGeometry(0.95, 1.4, 5);

function createLowPolyTree() {
  const treeGroup = new THREE.Group();
  
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 0.5;
  treeGroup.add(trunk);
  
  const foliage1 = new THREE.Mesh(foliageGeo1, foliageMaterial);
  foliage1.position.y = 1.6;
  treeGroup.add(foliage1);
  
  const foliage2 = new THREE.Mesh(foliageGeo2, foliageMaterial);
  foliage2.position.y = 2.4;
  treeGroup.add(foliage2);


  return treeGroup;
}

function scatterTrees(targetScene, mapPoints, treeCount = 500, clearanceRadius = 20.0) {
    const treesContainer = new THREE.Group();
    const minX = -330, maxX = 170;
    const minZ = -330,  maxZ = 170;
    let spawned = 0;
    let attempts = 0;
    const maxAttempts = treeCount * 10;

    while (spawned < treeCount && attempts < maxAttempts) {
        attempts++;
        const randX = minX + Math.random() * (maxX - minX);
        const randZ = minZ + Math.random() * (maxZ - minZ);

        let isTooCloseToNode = false;
        for (const pt of mapPoints) {
            const dist = Math.hypot(randX - pt.x, randZ - pt.z);
            if (dist < clearanceRadius) {
                isTooCloseToNode = true;
                break;
            }
        }

        if (isTooCloseToNode) continue;

        const tree = createLowPolyTree();
        const scale = 0.7 + Math.random() * 0.6;
        tree.scale.set(scale, scale, scale);
        tree.rotation.y = Math.random() * Math.PI * 2;
        tree.position.set(randX, 0, randZ);
        treesContainer.add(tree);
        spawned++;
    }

    targetScene.add(treesContainer);
    return treesContainer;
}

// 5. Swirl Particle System Generator
function createSwirlParticles(count = 60, radius = 1.6, height = 3.0, color = '#121212') {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const particleData = [];

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = radius + (Math.random() - 0.5) * 0.3;
        const y = Math.random() * height;

        positions[i * 3] = Math.cos(angle) * r;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(angle) * r;

        particleData.push({
            angle: angle,
            radius: r,
            y: y,
            speedY: 0.01 + Math.random() * 0.01,
            angularSpeed: 0.02 + Math.random() * 0.01
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: color,
        size: 3,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    points.userData = { particleData, maxHeight: height };
    return points;
}

// 6. Point Billboard Sprite Generator
function createPointLabelSprite(text, iconSvgPath, colorHex = '#38bdf8') {
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

    if (iconSvgPath) {
        const iconImg = new Image();
        iconImg.onload = () => {
            redraw(iconImg);
            texture.needsUpdate = true;
        };
        iconImg.src = iconSvgPath;
    }

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

// 7. Point Details Card Displayer
function showPointDetails(pt, pointCardEl, cardIconEl, cardTitleEl, cardCoordsEl, cardDescEl) {
    if (!pointCardEl) return;
    if (cardIconEl && pt.iconSvg) {
        cardIconEl.src = pt.iconSvg;
        if (pt.color) cardIconEl.style.borderColor = pt.color;
    }
    if (cardTitleEl) {
        cardTitleEl.textContent = pt.id;
        if (pt.color) cardTitleEl.style.color = pt.color;
    }
    if (cardCoordsEl) cardCoordsEl.textContent = `X: ${pt.x.toFixed(1)}, Z: ${pt.z.toFixed(1)}`;
    if (cardDescEl) cardDescEl.textContent = pt.desc || 'Operational waypoint on the isometric map.';
    pointCardEl.style.display = 'block';
}

// 8. Pan Clamping Helper
function clampPan(targetPanX, targetPanZ, maxRadius = 65) {
    const dist = Math.hypot(targetPanX, targetPanZ);
    if (dist > maxRadius) {
        return {
            x: (targetPanX / dist) * maxRadius,
            z: (targetPanZ / dist) * maxRadius
        };
    }
    return { x: targetPanX, z: targetPanZ };
}
