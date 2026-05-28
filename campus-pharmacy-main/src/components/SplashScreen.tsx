import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

type SplashScreenProps = {
  onSplashComplete?: () => void;
  holdOnComplete?: boolean;
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ onSplashComplete, holdOnComplete = false }) => {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const spinTargetRef = useRef<THREE.Object3D | null>(null);
  const hasExitedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 2.6);
    cameraRef.current = camera;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(3, 4, 5);
    const rimLight = new THREE.DirectionalLight(0xe8d5f2, 0.5);
    rimLight.position.set(-3, -1, 3);
    const backLight = new THREE.DirectionalLight(0xf0e6ff, 0.3);
    backLight.position.set(0, -2, -4);
    scene.add(ambientLight, directionalLight, rimLight, backLight);

    const tiltGroup = new THREE.Group();
    const spinGroup = new THREE.Group();
    const fanGroup = new THREE.Group();
    spinGroup.add(fanGroup);
    tiltGroup.add(spinGroup);
    tiltGroup.position.set(0, 0, 0);
    spinGroup.position.set(0, 0, 0);
    fanGroup.position.set(0, 0, 0);
    fanGroup.scale.setScalar(0.06);
    tiltGroup.rotation.set(20, -15, -0.18);
    scene.add(tiltGroup);
    modelGroupRef.current = spinGroup;
    const spinSpeed = 3.0;

    const minDurationMs = 4000;
    const progressState = { loaded: 0, displayed: 0 };
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = (_item: string, loaded: number, total: number) => {
      if (total > 0) {
        progressState.loaded = Math.max(progressState.loaded, (loaded / total) * 100);
      }
    };

    loadingManager.onLoad = () => {
      progressState.loaded = 100;
    };

    const loader = new GLTFLoader(loadingManager);
    let disposed = false;

    loader.load(
      '/models/logo.gltf',
      (gltf: GLTF) => {
        if (disposed) return;

        const model = gltf.scene;

        model.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#926bb0'),
              emissive: new THREE.Color('#926bb0'),
              emissiveIntensity: 0.35,
              metalness: 0.15,
              roughness: 0.35,
            });
            material.toneMapped = false;
            material.transparent = true;
            material.opacity = 1;
            mesh.material = material;
            materialsRef.current.push(material);
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const maxDimension = Math.max(size.x, size.y, size.z) || 1;
        const scale = 0.85 / maxDimension;
        model.scale.setScalar(scale);

        const fallbackTarget = model.getObjectByName('Logo') ?? model;
        spinTargetRef.current = fallbackTarget;
        fanGroup.add(model);

        gsap.fromTo(
          fanGroup.scale,
          { x: 0.06, y: 0.06, z: 0.06 },
          {
            x: 1,
            y: 1,
            z: 1,
            duration: 6.0,
            delay: 0.8,
            ease: 'power3.out',
          }
        );
      },
      (event: ProgressEvent<EventTarget>) => {
        if (event.total) {
          progressState.loaded = Math.max(progressState.loaded, (event.loaded / event.total) * 100);
        }
      },
      () => {
        progressState.loaded = 100;
      }
    );

    const resizeRenderer = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(canvas);
    resizeRenderer();


    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const deltaTime = clock.getDelta();
      const elapsed = clock.elapsedTime;
      const elapsedMs = elapsed * 1000;
      const timeProgress = Math.min(100, (elapsedMs / minDurationMs) * 100);
      const effectiveTarget = Math.min(progressState.loaded, timeProgress);

      const delta = effectiveTarget - progressState.displayed;
      if (Math.abs(delta) > 0.1) {
        progressState.displayed += delta * 0.08;
      } else {
        progressState.displayed = effectiveTarget;
      }

      const clampedProgress = Math.max(0, Math.min(100, progressState.displayed));
      setProgress(Math.round(clampedProgress));

      if (spinTargetRef.current) {
        spinTargetRef.current.rotation.z -= spinSpeed * deltaTime;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      renderer.dispose();

      scene.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material: THREE.Material) => material.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
    };
  }, []);

  useEffect(() => {
    if (progress < 100 || hasExitedRef.current || holdOnComplete) return;

    hasExitedRef.current = true;
    const timeline = gsap.timeline();

    const modelGroup = modelGroupRef.current;
    const camera = cameraRef.current;
    const materials = materialsRef.current;

    if (camera) {
      timeline.to(
        camera.position,
        { z: 1.0, duration: 1.0, ease: 'power3.in', onUpdate: () => camera.lookAt(0, 0, 0) },
        0
      );
    }

    if (modelGroup) {
      timeline.to(
        modelGroup.scale,
        { x: 6.0, y: 6.0, z: 6.0, duration: 1.4, ease: 'power3.in' },
        0
      );
      timeline.to(
        modelGroup.position,
        { z: 0.45, duration: 1.4, ease: 'power3.in' },
        0
      );
    }

    if (materials.length > 0) {
      timeline.to(
        materials,
        {
          emissiveIntensity: 1.35,
          roughness: 0.05,
          metalness: 0.8,
          duration: 0.7,
          ease: 'power2.out',
        },
        0.2
      );
    }

    if (loaderRef.current) {
      timeline.to(loaderRef.current, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0.1);
    }

    if (containerRef.current) {
      timeline.to(containerRef.current, { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 0.55);
    }

    timeline.call(() => onSplashComplete?.(), [], 0.9);
  }, [progress, onSplashComplete, holdOnComplete]);

  return (
    <>
      <style>{`
        .splash-screen {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          /* ── Gradient background (replaces the image) ── */
          background: linear-gradient(170deg, #a78cde 0%, #c5a8e8 28%, #dbb8ef 55%, #e8c8ee 78%, #f0d8f0 100%);
          overflow: hidden;
        }

        /* Subtle noise texture overlay */
        .splash-screen::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 180px;
          opacity: 0.5;
          pointer-events: none;
          z-index: 0;
        }

        /* Top glow blob */
        .splash-screen::after {
          content: '';
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 560px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(180,140,240,0.45) 0%, transparent 70%);
          filter: blur(40px);
          pointer-events: none;
          z-index: 0;
        }

        /* Bottom glow blob */
        .splash-bottom-glow {
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(240,200,255,0.55) 0%, transparent 70%);
          filter: blur(50px);
          pointer-events: none;
          z-index: 0;
        }

        .splash-scene {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .splash-model-stage {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
        }

        .splash-canvas {
          width: 100%;
          height: 100%;
          display: block;
          filter: none;
        }

        .splash-loader {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          width: 500px;
        }

        .splash-line {
          width: 100%;
          height: 3px;
          background: rgba(100, 60, 180, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .splash-line-fill {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #c026d3);
          border-radius: 2px;
          transition: width 0.1s linear;
          box-shadow: 0 0 8px rgba(192, 38, 211, 0.6);
        }

        .splash-percent {
          font-family: 'Times New Roman', Times, serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #5b21b6;
          text-shadow: 0 1px 4px rgba(255,255,255,0.4);
        }

        .splash-logo {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: -6px;
          z-index: 10;
          animation: splashFadeUp 2.2s ease forwards;
          opacity: 0;
        }

        .splash-logo-text {
          font-family: 'Times New Roman', Times, serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: white;
          text-shadow: 0 2px 16px rgba(160,100,220,0.25);
          line-height: 1;
          user-select: none;
          white-space: nowrap;
        }

        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(24px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <div className="splash-screen" ref={containerRef} role="status" aria-live="polite">
        {/* Bottom glow blob (can't do two pseudo-elements, so use a div) */}
        <div className="splash-bottom-glow" />

        {/* Logo */}
        <header className="splash-logo">
          <span className="splash-logo-text">CAMPUS GUIDE</span>
          <img
            src="/images/Untitled_design-removebg-preview.png"
            alt="Campus Guide logo"
            style={{ width: 62, height: 78, objectFit: 'contain', marginLeft: -18, marginTop: -4, transform: 'scaleX(-1)' }}
          />
        </header>

        <div className="splash-scene">
          <div className="splash-model-stage">
            <canvas className="splash-canvas" ref={canvasRef}></canvas>
          </div>
          <div className="splash-loader" ref={loaderRef} aria-hidden="true">
            <div className="splash-line">
              <span className="splash-line-fill" style={{ width: `${progress}%` }}></span>
            </div>
            <div className="splash-percent">{progress}%</div>
          </div>
        </div>
      </div>
    </>
  );
};
