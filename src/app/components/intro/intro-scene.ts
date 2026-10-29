import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/**
 * WebGL showroom for the landing intro: a red Ferrari 458 on a glossy black
 * floor. Scroll progress (0..1) spins the car one full turn while the camera
 * glides through a few framed "chapters"; drag adds extra yaw and the pointer
 * gives a light parallax. `protect()` plays the film-wrap sequence.
 *
 * Loaded via dynamic import so three.js never lands in the initial bundle.
 */

export interface IntroSceneHooks {
  onLoadProgress(pct: number): void;
  onReady(): void;
  onError(err: unknown): void;
  /** Called every frame with the smoothed scroll progress and car yaw in degrees. */
  onFrame(progress: number, yawDeg: number): void;
}

interface CamKey {
  p: number;
  dist: number;
  elev: number;
  fov: number;
  y: number;
}

/** Camera framing per scroll chapter (elev in degrees). */
const CAM_KEYS: CamKey[] = [
  { p: 0, dist: 7.4, elev: 9, fov: 32, y: 0.55 },
  { p: 0.33, dist: 5.6, elev: 3, fov: 36, y: 0.5 },
  { p: 0.66, dist: 6.6, elev: 26, fov: 34, y: 0.4 },
  { p: 1, dist: 8, elev: 13, fov: 30, y: 0.55 },
];
const PROTECT_CAM: CamKey = { p: 0, dist: 8.6, elev: 6, fov: 30, y: 0.55 };

/** Model front faces local -Z; PI turns it toward the camera, the offset gives a 3/4 view. */
const BASE_YAW = Math.PI - 0.75;
const WHEEL_RADIUS = 0.34;
const ENTRANCE_SECONDS = 2.6;
const ENTRANCE_DISTANCE = 14;

const RED = 0xd40000;
const LIME = 0xb8eb14;

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export class IntroScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  private readonly timer = new THREE.Timer();
  private readonly resizeObserver: ResizeObserver;
  private readonly dracoLoader = new DRACOLoader();

  private readonly carRig = new THREE.Group();
  private readonly mirrorRig = new THREE.Group();
  private readonly wheels: THREE.Object3D[] = [];
  private bodyMaterial!: THREE.MeshPhysicalMaterial;
  private bodyMesh?: THREE.Mesh;

  private ring!: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
  private ticks!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private dust!: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private rimLight!: THREE.PointLight;
  private accentLight!: THREE.PointLight;

  // Interaction state
  private target = 0;
  private progress = 0;
  private dragTarget = 0;
  private drag = 0;
  private pointer = new THREE.Vector2();
  private pointerSmooth = new THREE.Vector2();
  private hover = 0;
  private hoverTarget = 0;
  private wheelSpin = 0;

  // Timeline state
  private time = 0;
  private readyAt = -1;
  private protectAt = -1;
  private protectYaw = 0;
  private protectResolve?: () => void;
  private protectTick?: (pct: number) => void;
  private shell?: THREE.Mesh;
  private shellMaterial?: THREE.MeshBasicMaterial;
  private scanBeam?: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private readonly clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -4);

  private width = 1;
  private height = 1;
  /** Horizontal view offset (px) that pushes the car right of the headline on wide screens. */
  private wideOffset = 0;
  private disposed = false;

  constructor(
    private readonly host: HTMLElement,
    private readonly hooks: IntroSceneHooks,
    private readonly reducedMotion = false,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.95;
    this.renderer.localClippingEnabled = true;
    this.renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    host.appendChild(this.renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.9;
    pmrem.dispose();

    this.buildStage();
    this.loadCar();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    this.resize();

    this.timer.connect(document);
    this.renderer.setAnimationLoop(this.tick);
  }

  /** Scroll progress target, 0..1. */
  setTarget(p: number): void {
    this.target = clamp01(p);
  }

  /** Extra yaw (radians) from dragging. */
  addDrag(radians: number): void {
    this.dragTarget += radians;
  }

  /** Normalized pointer position, -1..1 on both axes. */
  setPointer(x: number, y: number): void {
    this.pointer.set(x, y);
  }

  setHover(on: boolean): void {
    this.hoverTarget = on ? 1 : 0;
  }

  /** Plays the film-wrap sweep; resolves when the car is "protected". */
  protect(onTick?: (pct: number) => void): Promise<void> {
    if (this.protectAt >= 0) {
      return Promise.resolve();
    }
    this.protectAt = this.time;
    this.protectYaw = this.currentYaw();
    this.protectTick = onTick;
    if (this.shell) {
      this.shell.visible = true;
    }
    return new Promise((resolve) => (this.protectResolve = resolve));
  }

  dispose(): void {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.resizeObserver.disconnect();
    this.timer.dispose();
    this.dracoLoader.dispose();
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
      for (const m of materials) {
        for (const value of Object.values(m)) {
          if (value instanceof THREE.Texture) {
            value.dispose();
          }
        }
        m.dispose();
      }
    });
    this.scene.environment?.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  // ---------------------------------------------------------------------------
  // Scene construction

  private buildStage(): void {
    // Glossy floor that fades into the page background at its edges; the
    // mirrored car underneath shows through it as a showroom reflection.
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(14, 96),
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.4,
        metalness: 0,
        envMap: this.scene.environment,
        envMapIntensity: 0.12,
        transparent: true,
        depthWrite: false,
        alphaMap: radialTexture([
          [0, 0.86],
          [0.25, 0.9],
          [0.6, 0.55],
          [1, 0],
        ]),
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.renderOrder = 1;
    this.scene.add(floor);

    this.ring = new THREE.Mesh(
      new THREE.RingGeometry(3.05, 3.09, 160),
      new THREE.MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.y = 0.004;
    this.ring.renderOrder = 3;
    this.scene.add(this.ring);

    this.ticks = new THREE.Mesh(
      new THREE.PlaneGeometry(7.6, 7.6),
      new THREE.MeshBasicMaterial({
        map: tickTexture(),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.ticks.rotation.x = -Math.PI / 2;
    this.ticks.position.y = 0.003;
    this.ticks.renderOrder = 3;
    this.scene.add(this.ticks);

    this.rimLight = new THREE.PointLight(0xff2a1a, 0, 14, 1.6);
    this.rimLight.position.set(0, 2.2, -4.5);
    this.scene.add(this.rimLight);
    this.accentLight = new THREE.PointLight(LIME, 0, 10, 1.8);
    this.accentLight.position.set(3.5, 0.6, 3.5);
    this.scene.add(this.accentLight);

    // Floating dust motes catching the light.
    const count = 520;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 9;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.random() * 5;
      positions[i * 3 + 2] = Math.sin(a) * r;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        size: 0.045,
        map: radialTexture([
          [0, 1],
          [0.4, 0.35],
          [1, 0],
        ]),
        color: 0xf3ffd6,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.scene.add(this.dust);

    this.mirrorRig.scale.y = -1;
    this.scene.add(this.carRig, this.mirrorRig);
  }

  private loadCar(): void {
    this.dracoLoader.setDecoderPath('draco/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(this.dracoLoader);

    loader.load(
      'models/ferrari.glb',
      (gltf) => {
        if (this.disposed) {
          return;
        }
        this.setupCar(gltf.scene.children[0]);
        this.hooks.onLoadProgress(100);
        this.readyAt = this.time;
        this.hooks.onReady();
      },
      (e) => {
        if (e.total > 0) {
          // Leave headroom for Draco decode + shader compile after download.
          this.hooks.onLoadProgress(Math.min(92, (e.loaded / e.total) * 92));
        }
      },
      (err) => this.hooks.onError(err),
    );
  }

  private setupCar(car: THREE.Object3D): void {
    this.bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: RED,
      metalness: 0.85,
      roughness: 0.38,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMap: this.scene.environment,
      envMapIntensity: 1.15,
    });
    const rimMaterial = new THREE.MeshStandardMaterial({ color: 0xc9ccd1, metalness: 1, roughness: 0.28 });
    const trimMaterial = new THREE.MeshStandardMaterial({ color: 0x0c0c0d, metalness: 0.9, roughness: 0.45 });
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0a0a0c,
      metalness: 0.3,
      roughness: 0.02,
      transparent: true,
      opacity: 0.55,
      envMapIntensity: 2,
    });

    const body = car.getObjectByName('body') as THREE.Mesh | undefined;
    if (body) {
      body.material = this.bodyMaterial;
      this.bodyMesh = body;
    }
    for (const name of ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl']) {
      const rim = car.getObjectByName(name) as THREE.Mesh | undefined;
      if (rim) rim.material = rimMaterial;
    }
    const trim = car.getObjectByName('trim') as THREE.Mesh | undefined;
    if (trim) trim.material = trimMaterial;
    const glass = car.getObjectByName('glass') as THREE.Mesh | undefined;
    if (glass) glass.material = glassMaterial;

    const mirror = car.clone();
    for (const root of [car, mirror]) {
      for (const name of ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr']) {
        const wheel = root.getObjectByName(name);
        if (wheel) this.wheels.push(wheel);
      }
    }

    // Baked contact shadow from the model's AO texture.
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('models/ferrari_ao.png'),
        blending: THREE.MultiplyBlending,
        toneMapped: false,
        transparent: true,
        premultipliedAlpha: true,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.002;
    shadow.renderOrder = 2;
    car.add(shadow);

    // Protection film "shell": a lime wireframe copy of the body revealed by a
    // sweeping clip plane during protect().
    if (body) {
      this.shellMaterial = new THREE.MeshBasicMaterial({
        color: LIME,
        wireframe: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        clippingPlanes: [this.clipPlane],
      });
      this.shell = new THREE.Mesh(body.geometry, this.shellMaterial);
      this.shell.position.copy(body.position);
      this.shell.quaternion.copy(body.quaternion);
      this.shell.scale.copy(body.scale).multiplyScalar(1.004);
      this.shell.visible = false;
      this.shell.renderOrder = 4;
      body.parent?.add(this.shell);
    }

    this.scanBeam = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 2.2),
      new THREE.MeshBasicMaterial({
        map: beamTexture(),
        color: LIME,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    this.scanBeam.rotation.y = Math.PI / 2;
    this.scanBeam.position.y = 0.75;
    this.scanBeam.visible = false;
    this.scene.add(this.scanBeam);

    this.carRig.add(car);
    this.mirrorRig.add(mirror);
  }

  // ---------------------------------------------------------------------------
  // Frame loop

  private readonly tick = (timestamp?: number) => {
    this.timer.update(timestamp);
    const dt = Math.min(this.timer.getDelta(), 0.1);
    this.time += dt;

    const follow = 1 - Math.exp(-dt * (this.reducedMotion ? 12 : 3.8));
    const prevProgress = this.progress;
    this.progress += (this.target - this.progress) * follow;
    this.drag += (this.dragTarget - this.drag) * (1 - Math.exp(-dt * 5));
    this.pointerSmooth.lerp(this.pointer, 1 - Math.exp(-dt * 3));
    this.hover += (this.hoverTarget - this.hover) * (1 - Math.exp(-dt * 6));

    const loaded = this.readyAt >= 0;
    const entrance = loaded ? clamp01((this.time - this.readyAt) / (this.reducedMotion ? 0.01 : ENTRANCE_SECONDS)) : 0;
    const enter = easeOutExpo(entrance);

    // --- Protect timeline (seconds since click)
    const pt = this.protectAt >= 0 ? this.time - this.protectAt : -1;
    const align = pt >= 0 ? easeInOutCubic(clamp01(pt / 0.8)) : 0;
    const sweep = pt >= 0 ? clamp01((pt - 0.65) / 1.5) : 0;
    const settle = pt >= 0 ? clamp01((pt - 2.15) / 0.55) : 0;

    // --- Car pose
    const sway = this.reducedMotion ? 0 : Math.sin(this.time * 0.45) * 0.05;
    const scrollYaw = this.scrollYaw() + sway;
    const yaw = THREE.MathUtils.lerp(scrollYaw, this.protectYaw, align);
    this.carRig.rotation.y = yaw;

    // Entrance: the car rolls in from the dark along its own heading.
    const remaining = (1 - enter) * ENTRANCE_DISTANCE;
    this.carRig.position.set(Math.sin(yaw) * remaining, 0, Math.cos(yaw) * remaining);
    this.mirrorRig.rotation.y = yaw;
    this.mirrorRig.position.copy(this.carRig.position);

    const scrollSpeed = dt > 0 ? (this.progress - prevProgress) / dt : 0;
    this.wheelSpin = -(enter * ENTRANCE_DISTANCE) / WHEEL_RADIUS - this.progress * 26 - scrollSpeed * 0.02;
    for (const wheel of this.wheels) {
      wheel.rotation.x = this.wheelSpin;
    }

    // --- Camera
    const key = this.cameraKey(this.progress);
    const cam = {
      dist: THREE.MathUtils.lerp(key.dist, PROTECT_CAM.dist, align),
      elev: THREE.MathUtils.lerp(key.elev, PROTECT_CAM.elev, align),
      fov: THREE.MathUtils.lerp(key.fov, PROTECT_CAM.fov, align),
      y: THREE.MathUtils.lerp(key.y, PROTECT_CAM.y, align),
    };
    const aspect = this.width / this.height;
    const fit = aspect < 1 ? THREE.MathUtils.clamp(1.15 / aspect, 1, 2.1) : 1;
    const dist = (cam.dist + (1 - enter) * 5 - this.hover * 0.5) * fit;
    const az = this.pointerSmooth.x * 0.12;
    const el = THREE.MathUtils.degToRad(cam.elev + (1 - enter) * 6) + this.pointerSmooth.y * 0.05;
    this.camera.fov = cam.fov;
    this.camera.position.set(Math.sin(az) * Math.cos(el) * dist, cam.y + Math.sin(el) * dist, Math.cos(az) * Math.cos(el) * dist);
    this.camera.lookAt(0, cam.y, 0);
    if (this.wideOffset) {
      // Re-center the car while the UI clears out for the protect sequence.
      this.camera.setViewOffset(this.width, this.height, this.wideOffset * (1 - align), 0, this.width, this.height);
    }
    this.camera.updateProjectionMatrix();

    // --- Stage FX
    const glow = enter * (0.55 + this.hover * 0.45) + sweep * (1 - settle) * 0.6;
    this.ring.material.opacity = glow * 0.8;
    this.ring.scale.setScalar(1 + (1 - enter) * 0.4 + Math.sin(this.time * 2.2) * 0.006 * (1 + this.hover * 3));
    this.ticks.material.opacity = enter * (0.35 + this.hover * 0.4);
    this.ticks.rotation.z = -this.time * 0.05 - this.progress * Math.PI;
    this.rimLight.intensity = enter * (26 + this.hover * 18);
    this.accentLight.intensity = enter * (6 + this.hover * 14 + sweep * (1 - settle) * 30);
    this.dust.material.opacity = enter * 0.7;
    this.renderer.toneMappingExposure = 0.25 + enter * 0.7 + Math.sin(settle * Math.PI) * 0.25;
    this.animateDust(dt);

    if (pt >= 0) {
      this.animateProtect(sweep, settle, pt);
    }

    this.renderer.render(this.scene, this.camera);
    this.hooks.onFrame(this.progress, THREE.MathUtils.radToDeg(this.scrollYaw() - BASE_YAW));
  };

  private animateProtect(sweep: number, settle: number, pt: number): void {
    const x = THREE.MathUtils.lerp(-3.4, 3.4, smooth(sweep));
    this.clipPlane.constant = x;
    if (this.shellMaterial) {
      this.shellMaterial.opacity = clamp01(sweep * 6) * (1 - settle) * 0.55;
    }
    if (this.scanBeam) {
      this.scanBeam.visible = sweep > 0 && sweep < 1;
      this.scanBeam.position.x = x;
      this.scanBeam.material.opacity = Math.sin(sweep * Math.PI) * 0.9;
    }
    if (this.bodyMaterial) {
      // The freshly wrapped paint flashes extra gloss, then settles glossier than before.
      this.bodyMaterial.roughness = THREE.MathUtils.lerp(0.38, 0.22, sweep);
      this.bodyMaterial.envMapIntensity = 1.15 + sweep * 0.5 + Math.sin(settle * Math.PI) * 0.8;
    }
    this.protectTick?.(Math.round(sweep * 100));
    if (pt >= 2.7 && this.protectResolve) {
      if (this.shell) this.shell.visible = false;
      const resolve = this.protectResolve;
      this.protectResolve = undefined;
      resolve();
    }
  }

  private animateDust(dt: number): void {
    const attr = this.dust.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const rise = dt * (0.12 + this.hover * 0.3);
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] += rise;
      if (arr[i] > 5) arr[i] = 0;
    }
    attr.needsUpdate = true;
    this.dust.rotation.y += dt * 0.02;
  }

  private scrollYaw(): number {
    return BASE_YAW + this.progress * Math.PI * 2 + this.drag;
  }

  private currentYaw(): number {
    // Snap to the nearest side profile (car length along world X) for the sweep.
    const yaw = this.carRig.rotation.y;
    return Math.round((yaw - Math.PI / 2) / Math.PI) * Math.PI + Math.PI / 2;
  }

  private cameraKey(p: number): Omit<CamKey, 'p'> {
    let i = 0;
    while (i < CAM_KEYS.length - 2 && p > CAM_KEYS[i + 1].p) i++;
    const a = CAM_KEYS[i];
    const b = CAM_KEYS[i + 1];
    const t = smooth(clamp01((p - a.p) / (b.p - a.p)));
    return {
      dist: THREE.MathUtils.lerp(a.dist, b.dist, t),
      elev: THREE.MathUtils.lerp(a.elev, b.elev, t),
      fov: THREE.MathUtils.lerp(a.fov, b.fov, t),
      y: THREE.MathUtils.lerp(a.y, b.y, t),
    };
  }

  private resize(): void {
    const w = Math.max(1, this.host.clientWidth);
    const h = Math.max(1, this.host.clientHeight);
    this.width = w;
    this.height = h;
    const mobile = w < 768;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // On wide screens push the car right so the headline owns the left side.
    this.wideOffset = w >= 1024 && w / h > 1.2 ? -w * 0.1 : 0;
    if (this.wideOffset) {
      this.camera.setViewOffset(w, h, this.wideOffset, 0, w, h);
    } else if (mobile) {
      this.camera.setViewOffset(w, h, 0, h * 0.04, w, h);
    } else {
      this.camera.clearViewOffset();
    }
    this.camera.updateProjectionMatrix();
  }
}

// -----------------------------------------------------------------------------
// Procedural textures

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  draw(canvas.getContext('2d')!, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** White radial gradient; stops are [offset, alpha]. */
function radialTexture(stops: [number, number][]): THREE.CanvasTexture {
  return canvasTexture(256, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    // Grey levels double as alpha so the texture works both as a map and as an alphaMap (green channel).
    for (const [offset, a] of stops) g.addColorStop(offset, `rgba(${a * 255},${a * 255},${a * 255},${a})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

/** Turntable HUD: fine ticks every 2°, major every 30°, plus a faint inner ring. */
function tickTexture(): THREE.CanvasTexture {
  return canvasTexture(1024, (ctx, s) => {
    const c = s / 2;
    ctx.translate(c, c);
    ctx.strokeStyle = '#ffffff';
    for (let i = 0; i < 180; i++) {
      const major = i % 15 === 0;
      ctx.globalAlpha = major ? 0.9 : 0.3;
      ctx.lineWidth = major ? 3 : 1.5;
      const r1 = c * 0.9;
      const r2 = c * (major ? 0.83 : 0.87);
      const a = (i / 180) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, c * 0.97, 0, Math.PI * 2);
    ctx.stroke();
  });
}

/** Vertical light blade for the film scan: bright core, soft horizontal falloff. */
function beamTexture(): THREE.CanvasTexture {
  return canvasTexture(256, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.35)');
    g.addColorStop(0.5, 'rgba(255,255,255,1)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.35)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const v = ctx.createLinearGradient(0, 0, 0, s);
    v.addColorStop(0, 'rgba(0,0,0,1)');
    v.addColorStop(0.2, 'rgba(0,0,0,0)');
    v.addColorStop(0.8, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, s, s);
  });
}
