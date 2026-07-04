import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { BINS } from '../data/trashData';
import { BinCategory, TrashItem } from '../types';
import { soundManager } from '../utils/audio';

interface GameCanvas3DProps {
  currentAngle: number;
  currentTrash: TrashItem;
  isTossing: boolean;
  tossTargetAngle: number;
  onTossComplete: (targetBinCategory: BinCategory) => void;
  highlightedBin: BinCategory | null;
}

export const GameCanvas3D: React.FC<GameCanvas3DProps> = ({
  currentAngle,
  currentTrash,
  isTossing,
  tossTargetAngle,
  onTossComplete,
  highlightedBin,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const trashMeshRef = useRef<THREE.Group | null>(null);
  const binGroupsRef = useRef<Map<BinCategory, THREE.Group>>(new Map());
  const trailRef = useRef<THREE.Line | null>(null);
  const trailPositionsRef = useRef<THREE.Vector3[]>([]);

  const animStateRef = useRef({
    currentAngleLerp: currentAngle,
    trashBobTime: 0,
    phase: 'idle' as 'idle' | 'flying' | 'landing',
    tossProgress: 0,
    tossStartPos: new THREE.Vector3(),
    tossTargetPos: new THREE.Vector3(),
    tossTargetCategory: 'residual' as BinCategory,
    tossIsCorrect: true,
    landStartTime: 0,
    landDuration: 0.45,
    shakeBinGroup: null as THREE.Group | null,
    shakeBinOrigQuat: new THREE.Quaternion(),
    bounceOrigin: new THREE.Vector3(),
    bounceDirection: new THREE.Vector3(),
  });

  const createBinPlacardTexture = useCallback((bin: typeof BINS[0]) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 512, 512);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.textAlign = 'center';

      ctx.save();
      ctx.translate(256, 150);
      if (bin.id === 'recyclable') {
        ctx.font = 'bold 150px Arial';
        ctx.fillText('♻️', 0, 50);
      } else if (bin.id === 'hazardous') {
        ctx.beginPath();
        [-1, 1].forEach(dx => {
          [-1, 1].forEach(dy => {
            ctx.moveTo(dx * 85, dy * 85);
            ctx.lineTo(dx * 22, dy * 22);
          });
        });
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
      } else if (bin.id === 'organic') {
        ctx.beginPath();
        ctx.moveTo(-65, -65); ctx.lineTo(65, -65);
        ctx.lineTo(0, 0); ctx.lineTo(65, 65);
        ctx.lineTo(-65, 65); ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 35, 14, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -75);
        ctx.lineTo(-70, 35); ctx.lineTo(-35, 35);
        ctx.lineTo(-35, 75); ctx.lineTo(35, 75);
        ctx.lineTo(35, 35); ctx.lineTo(70, 35);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();

      ctx.font = 'bold 72px sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.fillText(bin.cnName, 256, 330);

      let enTitle = 'Residual Waste';
      if (bin.id === 'recyclable') enTitle = 'Recyclable';
      if (bin.id === 'hazardous') enTitle = 'Hazardous Waste';
      if (bin.id === 'organic') enTitle = 'Food Waste';

      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillText(enTitle, 256, 395);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    return tex;
  }, []);

  const createBinModel = useCallback((bin: typeof BINS[0]) => {
    const group = new THREE.Group();

    const bodyGeo = new THREE.CylinderGeometry(1.55, 1.25, 3.4, 10, 4);
    const pos = bodyGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (Math.abs(y) < 1.6) {
        const jitter = (Math.sin(i * 2.3) * 0.06); // 确定性抖动
        pos.setX(i, pos.getX(i) * (1 + jitter));
        pos.setZ(i, pos.getZ(i) * (1 + jitter));
      }
    }
    bodyGeo.computeVertexNormals();

    const binMat = new THREE.MeshStandardMaterial({
      color: bin.hexColor,
      roughness: 0.4,
      metalness: 0.15,
      flatShading: true,
    });

    const bodyMesh = new THREE.Mesh(bodyGeo, binMat);
    bodyMesh.position.y = 1.7;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);

    const hoodGeo = new THREE.CylinderGeometry(1.2, 1.55, 0.85, 10, 2);
    const hoodPos = hoodGeo.attributes.position;
    for (let i = 0; i < hoodPos.count; i++) {
      const y = hoodPos.getY(i);
      if (y > 0) {
        hoodPos.setZ(i, hoodPos.getZ(i) - 0.2);
      }
    }
    hoodGeo.computeVertexNormals();

    const hoodMesh = new THREE.Mesh(hoodGeo, binMat);
    hoodMesh.position.y = 3.4 + 0.425;
    hoodMesh.castShadow = true;
    group.add(hoodMesh);

    const slotGroup = new THREE.Group();
    slotGroup.position.set(0, 3.48, 1.35);
    slotGroup.rotation.x = -0.18;

    const pitGeo = new THREE.BoxGeometry(1.3, 0.38, 0.45);
    const pitMat = new THREE.MeshBasicMaterial({ color: 0x080c14 });
    const pitMesh = new THREE.Mesh(pitGeo, pitMat);
    slotGroup.add(pitMesh);

    const frameGeo = new THREE.BoxGeometry(1.4, 0.48, 0.4);
    const frameMat = new THREE.MeshStandardMaterial({
      color: bin.hexColor,
      roughness: 0.3,
      flatShading: true,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.z = -0.05;
    slotGroup.add(frameMesh);

    group.add(slotGroup);

    const placardTex = createBinPlacardTexture(bin);
    const placardGeo = new THREE.PlaneGeometry(1.8, 1.8);
    const placardMat = new THREE.MeshBasicMaterial({
      map: placardTex,
      transparent: true,
    });
    const placardMesh = new THREE.Mesh(placardGeo, placardMat);
    placardMesh.position.set(0, 1.7, 1.45);
    group.add(placardMesh);

    const haloGeo = new THREE.RingGeometry(1.4, 1.9, 8);
    const haloMat = new THREE.MeshBasicMaterial({
      color: bin.hexColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = 0.02;
    group.add(haloMesh);

    return group;
  }, [createBinPlacardTexture]);

  // 确定性伪随机数生成器（基于种子）
  const seededRandom = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  };

  // 低多边形风格垃圾建模
  const buildTrashGeometry = useCallback((item: TrashItem) => {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: item.color,
      roughness: 0.4,
      metalness: item.modelType === 'can' || item.modelType === 'battery' || item.modelType === 'toy' || item.modelType === 'film' || item.modelType === 'mirror' ? 0.5 : 0.05,
      flatShading: true,
    });

    switch (item.modelType) {
      case 'can': {
        const geo = new THREE.CylinderGeometry(0.22, 0.24, 0.65, 8, 1);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        group.add(mesh);
        const topGeo = new THREE.CylinderGeometry(0.22, 0.23, 0.06, 8);
        const topMesh = new THREE.Mesh(topGeo, mat);
        topMesh.position.y = 0.35;
        group.add(topMesh);
        break;
      }
      case 'box': {
        const geo = new THREE.BoxGeometry(0.5, 0.45, 0.5);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.y = Math.PI / 8;
        mesh.castShadow = true;
        group.add(mesh);
        break;
      }
      case 'bottle': {
        const bGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.55, 8, 1);
        const bMesh = new THREE.Mesh(bGeo, mat);
        bMesh.castShadow = true;
        group.add(bMesh);
        const nGeo = new THREE.CylinderGeometry(0.07, 0.16, 0.25, 8, 1);
        const nMesh = new THREE.Mesh(nGeo, mat);
        nMesh.position.y = 0.38;
        group.add(nMesh);
        const capGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.06, 8);
        const capMesh = new THREE.Mesh(capGeo, mat);
        capMesh.position.y = 0.54;
        group.add(capMesh);
        break;
      }
      case 'battery': {
        const batGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.6, 8, 1);
        const batMesh = new THREE.Mesh(batGeo, mat);
        batMesh.castShadow = true;
        group.add(batMesh);
        const tipGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.08, 8);
        const tipMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, flatShading: true });
        const tipMesh = new THREE.Mesh(tipGeo, tipMat);
        tipMesh.position.y = 0.34;
        group.add(tipMesh);
        break;
      }
      case 'paper': {
        // 纸团：低多边形风格，使用确定性种子避免随机变化
        const seed = item.name.length * 31 + item.id.charCodeAt(1);
        const rnd = seededRandom(seed);
        const pGeo = new THREE.IcosahedronGeometry(0.3, 1);
        const pos = pGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const rx = 0.75 + rnd() * 0.5;
          const ry = 0.75 + rnd() * 0.5;
          const rz = 0.75 + rnd() * 0.5;
          pos.setXYZ(i, pos.getX(i) * rx, pos.getY(i) * ry, pos.getZ(i) * rz);
        }
        pGeo.computeVertexNormals();
        const mesh = new THREE.Mesh(pGeo, mat);
        mesh.castShadow = true;
        group.add(mesh);
        break;
      }
      case 'banana': {
        const banGeo = new THREE.TorusGeometry(0.28, 0.07, 6, 8, Math.PI * 0.75);
        const banMesh = new THREE.Mesh(banGeo, mat);
        banMesh.rotation.x = Math.PI / 4;
        banMesh.castShadow = true;
        group.add(banMesh);
        break;
      }
      case 'apple': {
        const appGeo = new THREE.SphereGeometry(0.28, 8, 6);
        appGeo.scale(1, 0.85, 1);
        const appMesh = new THREE.Mesh(appGeo, mat);
        appMesh.castShadow = true;
        group.add(appMesh);
        const stemGeo = new THREE.CylinderGeometry(0.025, 0.02, 0.15, 4);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, flatShading: true });
        const stemMesh = new THREE.Mesh(stemGeo, stemMat);
        stemMesh.position.y = 0.28;
        group.add(stemMesh);
        break;
      }
      case 'bulb': {
        const bulbGeo = new THREE.SphereGeometry(0.2, 8, 6);
        bulbGeo.scale(1, 1.15, 1);
        const bulbMesh = new THREE.Mesh(bulbGeo, mat);
        bulbMesh.position.y = 0.15;
        bulbMesh.castShadow = true;
        group.add(bulbMesh);
        const baseGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.2, 6);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3, flatShading: true });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.y = -0.1;
        group.add(baseMesh);
        break;
      }
      case 'cup': {
        const cupGeo = new THREE.CylinderGeometry(0.18, 0.14, 0.45, 8, 1, true);
        const cupMesh = new THREE.Mesh(cupGeo, mat);
        cupMesh.castShadow = true;
        group.add(cupMesh);
        const baseGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.08, 6);
        const baseMesh = new THREE.Mesh(baseGeo, mat);
        baseMesh.position.y = -0.24;
        group.add(baseMesh);
        break;
      }
      case 'leaf': {
        const leafGeo = new THREE.SphereGeometry(0.18, 8, 4);
        leafGeo.scale(2, 0.25, 1);
        const leafMesh = new THREE.Mesh(leafGeo, mat);
        leafMesh.rotation.z = Math.PI / 6;
        leafMesh.castShadow = true;
        group.add(leafMesh);
        break;
      }
      case 'bone': {
        // 骨头造型：两个小球 + 细长圆柱体
        const centerGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6);
        const centerMesh = new THREE.Mesh(centerGeo, mat);
        centerMesh.castShadow = true;
        group.add(centerMesh);
        const endGeo = new THREE.SphereGeometry(0.1, 6, 6);
        endGeo.scale(1, 0.7, 1);
        const end1 = new THREE.Mesh(endGeo, mat);
        end1.position.y = 0.3;
        end1.castShadow = true;
        group.add(end1);
        const end2 = new THREE.Mesh(endGeo, mat);
        end2.position.y = -0.3;
        end2.castShadow = true;
        group.add(end2);
        break;
      }
      case 'pill': {
        // 药片：扁圆柱体，可选胶囊造型
        const pillGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 8);
        const pillMesh = new THREE.Mesh(pillGeo, mat);
        pillMesh.castShadow = true;
        group.add(pillMesh);
        // 药片上有一条分割线
        const lineGeo = new THREE.BoxGeometry(0.02, 0.02, 0.36);
        const lineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true });
        const lineMesh = new THREE.Mesh(lineGeo, lineMat);
        lineMesh.position.y = 0.06;
        group.add(lineMesh);
        break;
      }
      case 'toy': {
        // 玩具熊：简单低多边形球体 + 耳朵
        const headGeo = new THREE.SphereGeometry(0.28, 8, 6);
        const headMesh = new THREE.Mesh(headGeo, mat);
        headMesh.castShadow = true;
        group.add(headMesh);
        const earGeo = new THREE.SphereGeometry(0.1, 6, 4);
        const earL = new THREE.Mesh(earGeo, mat);
        earL.position.set(-0.2, 0.25, 0);
        group.add(earL);
        const earR = new THREE.Mesh(earGeo, mat);
        earR.position.set(0.2, 0.25, 0);
        group.add(earR);
        break;
      }
      case 'shell': {
        // 贝壳/外壳：半球形
        const shellGeo = new THREE.SphereGeometry(0.28, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2);
        shellGeo.scale(1, 0.6, 1.2);
        const shellMesh = new THREE.Mesh(shellGeo, mat);
        shellMesh.rotation.x = -0.2;
        shellMesh.castShadow = true;
        group.add(shellMesh);
        break;
      }
      case 'diaper': {
        // 纸尿裤：扁平的盒子
        const diaperGeo = new THREE.BoxGeometry(0.4, 0.18, 0.3);
        const diaperMesh = new THREE.Mesh(diaperGeo, mat);
        diaperMesh.castShadow = true;
        group.add(diaperMesh);
        break;
      }
      case 'thermo': {
        // 温度计：细长圆柱体 + 玻璃头
        const bodyGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6);
        const bodyMesh = new THREE.Mesh(bodyGeo, mat);
        bodyMesh.castShadow = true;
        group.add(bodyMesh);
        const bulbGeo = new THREE.SphereGeometry(0.06, 6, 4);
        const bulbMesh = new THREE.Mesh(bulbGeo, mat);
        bulbMesh.position.y = -0.32;
        group.add(bulbMesh);
        break;
      }
      case 'film': {
        // 胶卷/光盘：扁平圆柱体
        const filmGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.04, 8);
        const filmMesh = new THREE.Mesh(filmGeo, mat);
        filmMesh.castShadow = true;
        group.add(filmMesh);
        // 中心孔
        const holeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 8);
        const holeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, flatShading: true });
        const holeMesh = new THREE.Mesh(holeGeo, holeMat);
        group.add(holeMesh);
        break;
      }
      case 'mirror': {
        // 镜子：扁平盒子
        const mirrorGeo = new THREE.BoxGeometry(0.35, 0.5, 0.04);
        const mirrorMesh = new THREE.Mesh(mirrorGeo, mat);
        mirrorMesh.castShadow = true;
        group.add(mirrorMesh);
        break;
      }
      case 'cloth': {
        // 衣服：扁平不规则形状
        const clothGeo = new THREE.BoxGeometry(0.35, 0.45, 0.08);
        const clothMesh = new THREE.Mesh(clothGeo, mat);
        clothMesh.rotation.z = 0.15;
        clothMesh.castShadow = true;
        group.add(clothMesh);
        break;
      }
      case 'tape': {
        // 胶带：扁圆柱体
        const tapeGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 8);
        const tapeMesh = new THREE.Mesh(tapeGeo, mat);
        tapeMesh.rotation.x = Math.PI / 2;
        tapeMesh.castShadow = true;
        group.add(tapeMesh);
        break;
      }
      default: {
        const defaultGeo = new THREE.IcosahedronGeometry(0.28, 1);
        const defaultMesh = new THREE.Mesh(defaultGeo, mat);
        defaultMesh.castShadow = true;
        group.add(defaultMesh);
        break;
      }
    }

    return group;
  }, []);

  // 初始化场景
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5F0EB);
    scene.fog = new THREE.FogExp2(0xF5F0EB, 0.025);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const hemiLight = new THREE.HemisphereLight(0xFFF8EE, 0xE8DDD0, 0.55);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xFFF8EE, 1.0);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 60;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xFFE4B5, 2.2, 18, 1.5);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    const rimLights = [
      { pos: [8, 3, 0] as [number, number, number], color: 0xF5F0EB, intensity: 0.6, dist: 14 },
      { pos: [-8, 3, 0] as [number, number, number], color: 0xF5F0EB, intensity: 0.6, dist: 14 },
      { pos: [0, 3, 8] as [number, number, number], color: 0xF5F0EB, intensity: 0.6, dist: 14 },
      { pos: [0, 3, -8] as [number, number, number], color: 0xF5F0EB, intensity: 0.6, dist: 14 },
    ];
    rimLights.forEach(rl => {
      const light = new THREE.PointLight(rl.color, rl.intensity, rl.dist, 2);
      light.position.set(rl.pos[0], rl.pos[1], rl.pos[2]);
      scene.add(light);
    });

    const floorGeo = new THREE.CircleGeometry(16, 8);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xE8DDD0,
      roughness: 0.85,
      metalness: 0.05,
      flatShading: true,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const centerRingGeo = new THREE.RingGeometry(0.8, 1.0, 8);
    const centerRingMat = new THREE.MeshBasicMaterial({
      color: 0x6366F1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const centerRingMesh = new THREE.Mesh(centerRingGeo, centerRingMat);
    centerRingMesh.rotation.x = -Math.PI / 2;
    centerRingMesh.position.y = 0.01;
    scene.add(centerRingMesh);

    binGroupsRef.current.clear();
    BINS.forEach((bin) => {
      const binGroup = createBinModel(bin);
      const radius = 5.2;
      const x = Math.sin(bin.angle) * radius;
      const z = -Math.cos(bin.angle) * radius;

      binGroup.position.set(x, 0, z);
      binGroup.lookAt(0, 0, 0);
      scene.add(binGroup);
      binGroupsRef.current.set(bin.id, binGroup);
    });

    const trashGroup = new THREE.Group();
    scene.add(trashGroup);
    trashMeshRef.current = trashGroup;

    const trailGeo = new THREE.BufferGeometry();
    const maxTrail = 60;
    const trailPositions = new Float32Array(maxTrail * 3);
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeo.setDrawRange(0, 0);
    const trailMat = new THREE.LineBasicMaterial({
      color: 0xF59E0B,
      linewidth: 1,
      transparent: true,
      opacity: 0.7,
      depthTest: true,
    });
    const trailLine = new THREE.Line(trailGeo, trailMat);
    scene.add(trailLine);
    trailRef.current = trailLine;

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [createBinModel]);

  // 更新垃圾模型
  useEffect(() => {
    if (!trashMeshRef.current) return;
    if (animStateRef.current.phase !== 'idle') return;
    const group = trashMeshRef.current;
    group.clear();
    group.visible = true;
    group.scale.setScalar(1.0);
    const newTrashGeo = buildTrashGeometry(currentTrash);
    newTrashGeo.scale.set(0.5, 0.5, 0.5);
    group.add(newTrashGeo);
  }, [currentTrash, buildTrashGeometry]);

  // 投掷触发
  useEffect(() => {
    if (isTossing && animStateRef.current.phase === 'idle') {
      const st = animStateRef.current;
      st.phase = 'flying';
      st.tossProgress = 0;

      let normAngle = ((tossTargetAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      let closestBin = BINS[0];
      let minDiff = 999;
      BINS.forEach(b => {
        let diff = Math.abs(b.angle - normAngle);
        if (diff > Math.PI) diff = 2 * Math.PI - diff;
        if (diff < minDiff) { minDiff = diff; closestBin = b; }
      });

      st.tossTargetCategory = closestBin.id;
      st.tossIsCorrect = closestBin.id === currentTrash.category;

      if (trashMeshRef.current) {
        st.tossStartPos.copy(trashMeshRef.current.position);
      }
      const targetBinGroup = binGroupsRef.current.get(closestBin.id);
      if (targetBinGroup) {
        st.tossTargetPos.copy(targetBinGroup.position);
        st.tossTargetPos.y = 3.4;
      }

      trailPositionsRef.current = [];
      if (trailRef.current) {
        (trailRef.current.geometry as THREE.BufferGeometry).setDrawRange(0, 0);
      }

      soundManager.playToss();
    }
  }, [isTossing, tossTargetAngle, currentTrash.category]);

  // 渲染循环
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!cameraRef.current || !sceneRef.current || !rendererRef.current) return;
      const camera = cameraRef.current;
      const now = performance.now();
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const st = animStateRef.current;

      // 1. 相机
      let target = currentAngle;
      let current = st.currentAngleLerp;
      let delta = target - current;
      if (delta > Math.PI) current += 2 * Math.PI;
      if (delta < -Math.PI) current -= 2 * Math.PI;
      st.currentAngleLerp += (target - current) * 0.14;
      const smoothAngle = st.currentAngleLerp;

      const lookX = Math.sin(smoothAngle) * 10;
      const lookZ = -Math.cos(smoothAngle) * 10;
      camera.lookAt(lookX, 1.6, lookZ);

      // 2. 垃圾动画
      if (trashMeshRef.current) {
        const trashGroup = trashMeshRef.current;
        trashGroup.visible = true;

        if (st.phase === 'flying') {
          st.tossProgress += dt * 2.2;
          const p = Math.min(1.0, st.tossProgress);
          const easeP = 1 - (1 - p) * (1 - p);

          const curPos = new THREE.Vector3().lerpVectors(st.tossStartPos, st.tossTargetPos, easeP);
          const arcHeight = Math.sin(p * Math.PI) * 3.6;
          curPos.y += arcHeight;

          trashGroup.position.copy(curPos);
          trashGroup.rotation.x += 0.2;
          trashGroup.rotation.y += 0.25;

          trailPositionsRef.current.push(curPos.clone());
          if (trailPositionsRef.current.length > 60) {
            trailPositionsRef.current.shift();
          }
          if (trailRef.current) {
            const geo = trailRef.current.geometry as THREE.BufferGeometry;
            const arr = geo.attributes.position.array as Float32Array;
            const n = trailPositionsRef.current.length;
            for (let i = 0; i < Math.min(n, 60); i++) {
              const pt = trailPositionsRef.current[i];
              arr[i * 3] = pt.x;
              arr[i * 3 + 1] = pt.y;
              arr[i * 3 + 2] = pt.z;
            }
            geo.attributes.position.needsUpdate = true;
            geo.setDrawRange(0, n);
          }

          if (p >= 1.0) {
            st.phase = 'landing';
            st.landStartTime = now / 1000;
            st.landDuration = st.tossIsCorrect ? 0.5 : 0.55;
            const binGroup = binGroupsRef.current.get(st.tossTargetCategory);
            st.shakeBinGroup = binGroup || null;
            if (binGroup) {
              st.shakeBinOrigQuat.copy(binGroup.quaternion);
            }
            if (!st.tossIsCorrect && binGroup) {
              st.bounceOrigin.copy(trashGroup.position);
              st.bounceDirection.copy(binGroup.position).multiplyScalar(-1).normalize();
            }
          }
        } else if (st.phase === 'landing') {
          const elapsed = now / 1000 - st.landStartTime;
          const p = Math.min(1.0, elapsed / st.landDuration);
          const easeP = 1 - Math.pow(1 - p, 3);

          if (st.tossIsCorrect) {
            const sink = 1 - easeP;
            const scale = 0.5 * sink;
            trashGroup.scale.setScalar(Math.max(0.01, scale));
            trashGroup.position.copy(st.tossTargetPos);
            trashGroup.position.y += 0.3 * sink;
          } else {
            const bounceHeight = Math.sin(p * Math.PI) * 2.5;
            const bounceDist = easeP * 3.0;
            trashGroup.position.copy(st.bounceOrigin);
            trashGroup.position.x += st.bounceDirection.x * bounceDist;
            trashGroup.position.z += st.bounceDirection.z * bounceDist;
            trashGroup.position.y += bounceHeight;
            trashGroup.rotation.x += 0.3;
            trashGroup.rotation.y += 0.3;
            const shrink = 1 - easeP * 0.7;
            trashGroup.scale.setScalar(shrink);
          }

          if (st.tossIsCorrect && st.shakeBinGroup) {
            const shakeAngle = Math.sin(p * Math.PI * 5) * 0.06 * (1 - p);
            const shakeQuat = new THREE.Quaternion();
            shakeQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), shakeAngle);
            st.shakeBinGroup.quaternion.copy(st.shakeBinOrigQuat).multiply(shakeQuat);
          }

          if (p >= 1.0) {
            st.phase = 'idle';
            st.tossProgress = 0;
            trashGroup.scale.setScalar(1.0);
            if (st.shakeBinGroup) {
              st.shakeBinGroup.quaternion.copy(st.shakeBinOrigQuat);
              st.shakeBinGroup = null;
            }
            trailPositionsRef.current = [];
            if (trailRef.current) {
              (trailRef.current.geometry as THREE.BufferGeometry).setDrawRange(0, 0);
            }
            onTossComplete(st.tossTargetCategory);
          }
        } else {
          st.trashBobTime += 0.04;
          const bobY = Math.sin(st.trashBobTime) * 0.08;
          const holdDist = 1.5;
          const tx = Math.sin(smoothAngle) * holdDist;
          const tz = -Math.cos(smoothAngle) * holdDist;
          trashGroup.position.set(tx, 1.25 + bobY, tz);
          trashGroup.rotation.y += 0.015;
          trashGroup.rotation.x = Math.sin(st.trashBobTime * 0.5) * 0.1;
        }
      }

      // 3. 垃圾桶高亮
      binGroupsRef.current.forEach((group, category) => {
        const halo = group.children.find(c => c instanceof THREE.Mesh && c.geometry instanceof THREE.RingGeometry) as THREE.Mesh;
        if (halo) {
          if (highlightedBin === category) {
            (halo.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(Date.now() * 0.01) * 0.2;
          } else {
            (halo.material as THREE.MeshBasicMaterial).opacity = 0.3;
          }
        }
      });

      // 4. 轨迹淡出
      if (trailRef.current) {
        const mat = trailRef.current.material as THREE.LineBasicMaterial;
        if (st.phase === 'landing') {
          const elapsed = now / 1000 - st.landStartTime;
          mat.opacity = Math.max(0, 0.7 * (1 - elapsed / st.landDuration));
        } else {
          mat.opacity = 0.7;
        }
      }

      rendererRef.current.render(sceneRef.current, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [currentAngle, onTossComplete, highlightedBin]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
