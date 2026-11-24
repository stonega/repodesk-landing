import { useEffect, useRef, useState } from "react";
import {
  createOrigamiBoatGeometries,
  FLEET_WRAP_HALF_WIDTH,
  PAPER_BOAT_FLEET,
  type RippleState,
  sampleWaterWave,
  wrapBoatX,
} from "../lib/origami-three";

interface PaperBoatsStageProps {
  paused: boolean;
}

function StaticBoatsFallback() {
  return (
    <svg
      className="footer-boats-fallback"
      viewBox="0 0 1440 340"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="fb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf7f2" />
          <stop offset="48%" stopColor="#ffedd2" />
          <stop offset="100%" stopColor="#ffd7a3" />
        </linearGradient>
        <linearGradient id="fb-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5db5cc" />
          <stop offset="45%" stopColor="#2f86a6" />
          <stop offset="100%" stopColor="#1b5873" />
        </linearGradient>
        <radialGradient id="fb-sun" cx="50%" cy="46%" r="36%">
          <stop offset="0%" stopColor="#fff9d6" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#ffbf66" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#ffbf66" stopOpacity="0" />
        </radialGradient>
        <g id="fb-boat">
          <path d="M-24 0L0 -22L24 0Z" fill="#fffdf8" />
          <path d="M0 -22L24 0L0 3Z" fill="#ffe2be" />
          <path d="M-38 -3L0 7L38 -3L27 14L-27 14Z" fill="#ffffff" />
          <path d="M0 7L38 -3L27 14L0 14Z" fill="#f7c894" />
        </g>
      </defs>
      <rect width="1440" height="340" fill="url(#fb-sky)" />
      <ellipse cx="760" cy="148" rx="420" ry="120" fill="url(#fb-sun)" />
      <path
        d="M0 154Q180 140 360 152T720 150T1080 154T1440 148V340H0Z"
        fill="url(#fb-sea)"
      />
      <path
        d="M0 186Q220 172 440 186T880 182T1320 188L1440 184V340H0Z"
        fill="#246e8b"
        opacity="0.45"
      />
      <path
        d="M0 226Q260 214 520 226T1040 224T1440 220V340H0Z"
        fill="#194e66"
        opacity="0.42"
      />
      <g transform="translate(210 172) scale(0.55) rotate(-3)">
        <use href="#fb-boat" />
      </g>
      <g transform="translate(490 166) scale(0.48) rotate(2)">
        <use href="#fb-boat" />
      </g>
      <g transform="translate(880 168) scale(0.5) rotate(-2)">
        <use href="#fb-boat" />
      </g>
      <g transform="translate(1210 176) scale(0.58) rotate(3)">
        <use href="#fb-boat" />
      </g>
      <g transform="translate(330 214) scale(0.82) rotate(4)">
        <use href="#fb-boat" />
      </g>
      <g transform="translate(720 206) scale(0.92) rotate(-3)">
        <use href="#fb-boat" />
      </g>
      <g transform="translate(1060 218) scale(0.86) rotate(2)">
        <use href="#fb-boat" />
      </g>
      <g transform="translate(150 248) scale(1.05) rotate(-4)">
        <use href="#fb-boat" />
      </g>
      <g transform="translate(560 254) scale(1.12) rotate(3)">
        <use href="#fb-boat" />
      </g>
      <g transform="translate(950 250) scale(1.02) rotate(-2)">
        <use href="#fb-boat" />
      </g>
      <g transform="translate(1290 252) scale(1.06) rotate(4)">
        <use href="#fb-boat" />
      </g>
    </svg>
  );
}

export default function PaperBoatsStage({ paused }: PaperBoatsStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const rippleRef = useRef<RippleState>({
    active: false,
    x: 0,
    z: 0,
    startTime: 0,
    strength: 0.24,
  });
  const simTimeRef = useRef(0);
  const [webglReady, setWebglReady] = useState(false);

  pausedRef.current = paused;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || typeof window === "undefined") return;

    let disposed = false;
    let rafId = 0;
    let cleanup: (() => void) | undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    void import("three")
      .then((THREE) => {
        if (disposed || !container || !canvas) return;

        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          });
        } catch {
          return;
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.08;

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xfbe2c2, 13, 36);

        const camera = new THREE.PerspectiveCamera(36, 16 / 5, 0.1, 90);
        camera.position.set(0, 4.35, 12.8);
        camera.lookAt(0, 0.12, -1.8);

        // Warm golden-hour sky & sunlit water bounce lighting
        const hemiLight = new THREE.HemisphereLight(0xfff5df, 0x1d6c88, 1.45);
        scene.add(hemiLight);

        const sunLight = new THREE.DirectionalLight(0xffcf85, 2.35);
        sunLight.position.set(6, 9, -8);
        scene.add(sunLight);

        const fillLight = new THREE.DirectionalLight(0xffb578, 0.9);
        fillLight.position.set(-8, 5, 7);
        scene.add(fillLight);

        // Wide edge-to-edge animated faceted sunlit water plane
        const waterGeo = new THREE.PlaneGeometry(84, 34, 112, 52);
        waterGeo.rotateX(-Math.PI / 2);
        const posAttr = waterGeo.attributes.position;
        const vertexCount = posAttr.count;
        const baseX = new Float32Array(vertexCount);
        const baseZ = new Float32Array(vertexCount);
        const waterColors = new Float32Array(vertexCount * 3);

        for (let i = 0; i < vertexCount; i++) {
          baseX[i] = posAttr.getX(i);
          baseZ[i] = posAttr.getZ(i);
        }
        waterGeo.setAttribute(
          "color",
          new THREE.BufferAttribute(waterColors, 3),
        );

        const waterMat = new THREE.MeshStandardMaterial({
          vertexColors: true,
          flatShading: true,
          roughness: 0.28,
          metalness: 0.16,
        });
        const waterMesh = new THREE.Mesh(waterGeo, waterMat);
        waterMesh.position.set(0, -0.08, -1.2);
        scene.add(waterMesh);

        // Shared origami paper boat geometries + fleet instances
        const { hullGeometry, innerGeometry, sailGeometry } =
          createOrigamiBoatGeometries(THREE);

        const wakeGeo = new THREE.RingGeometry(0.68, 0.86, 20);
        wakeGeo.rotateX(-Math.PI / 2);
        const wakeMat = new THREE.MeshBasicMaterial({
          color: 0xfff5de,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
        });

        const boatMaterials: InstanceType<typeof THREE.MeshStandardMaterial>[] =
          [];
        const boats = PAPER_BOAT_FLEET.map((spec) => {
          const group = new THREE.Group();
          const hullMat = new THREE.MeshStandardMaterial({
            color: spec.hullColor,
            flatShading: true,
            roughness: 0.72,
            metalness: 0.02,
            side: THREE.DoubleSide,
          });
          const innerMat = new THREE.MeshStandardMaterial({
            color: spec.accentColor,
            flatShading: true,
            roughness: 0.82,
            metalness: 0.01,
            side: THREE.DoubleSide,
          });
          const sailMat = new THREE.MeshStandardMaterial({
            color: spec.sailColor,
            flatShading: true,
            roughness: 0.64,
            metalness: 0.02,
            side: THREE.DoubleSide,
          });
          boatMaterials.push(hullMat, innerMat, sailMat);

          group.add(new THREE.Mesh(hullGeometry, hullMat));
          group.add(new THREE.Mesh(innerGeometry, innerMat));
          group.add(new THREE.Mesh(sailGeometry, sailMat));
          group.scale.setScalar(spec.scale * 0.76);
          scene.add(group);

          const wake = new THREE.Mesh(wakeGeo, wakeMat);
          wake.scale.setScalar(spec.scale * 0.84);
          scene.add(wake);

          return { spec, group, wake };
        });

        // Sparkling sun glints skimming over the water
        const glintCount = 48;
        const glintPositions = new Float32Array(glintCount * 3);
        const glintBase = Array.from({ length: glintCount }, (_, index) => {
          const angle = index * 2.39996;
          const spreadX = (((index * 73) % 100) / 100 - 0.5) * 30;
          const spreadZ = (((index * 41) % 100) / 100 - 0.5) * 14 - 1.5;
          return { x: spreadX, z: spreadZ, phase: angle };
        });
        const glintGeo = new THREE.BufferGeometry();
        glintGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(glintPositions, 3),
        );
        const glintMat = new THREE.PointsMaterial({
          color: 0xffe9aa,
          size: 0.14,
          transparent: true,
          opacity: 0.75,
          depthWrite: false,
        });
        const glints = new THREE.Points(glintGeo, glintMat);
        scene.add(glints);

        const deepColor = new THREE.Color(0x1b6682);
        const midColor = new THREE.Color(0x3a9db8);
        const crestColor = new THREE.Color(0xffdfa8);
        const horizonTint = new THREE.Color(0xf8cf96);
        const tempColor = new THREE.Color();

        const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

        const updateScene = (time: number) => {
          const ripple = rippleRef.current;
          const colorAttr = waterGeo.attributes.color;

          // Displace and shade water surface
          for (let i = 0; i < vertexCount; i++) {
            const wx = baseX[i] ?? 0;
            const wz = baseZ[i] ?? 0;
            const wave = sampleWaterWave(wx, wz, time, ripple);
            posAttr.setY(i, wave.height);

            const crestMix = Math.max(
              0,
              Math.min(1, (wave.height + 0.34) / 0.72),
            );
            if (crestMix < 0.62) {
              tempColor.lerpColors(deepColor, midColor, crestMix / 0.62);
            } else {
              tempColor.lerpColors(
                midColor,
                crestColor,
                (crestMix - 0.62) / 0.38,
              );
            }
            // Golden sun-path shimmer near center-horizon
            const sunAlign = Math.exp(
              -((wx - 1.8) * (wx - 1.8)) * 0.015 - Math.max(0, wz + 5.5) * 0.09,
            );
            if (sunAlign > 0.02) {
              tempColor.lerp(horizonTint, Math.min(0.68, sunAlign * 0.65));
            }
            colorAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
          }
          posAttr.needsUpdate = true;
          colorAttr.needsUpdate = true;
          waterGeo.computeVertexNormals();

          // Float and glide every origami paper boat on the wave surface
          for (const { spec, group, wake } of boats) {
            const bx = wrapBoatX(
              spec.x + time * spec.speed,
              FLEET_WRAP_HALF_WIDTH,
            );
            const bz =
              spec.z + Math.sin(time * 0.35 + spec.phase) * 0.32 * spec.bobAmp;
            const wave = sampleWaterWave(bx, bz + 1.2, time, ripple);

            group.position.set(bx, wave.height - 0.06, bz);
            const yaw =
              spec.heading + Math.sin(time * 0.45 + spec.phase) * 0.14;
            const pitch = Math.atan(wave.dx) * 0.85;
            const roll = -Math.atan(wave.dz) * 0.92;
            group.rotation.set(roll, yaw, pitch);

            wake.position.set(bx, wave.height - 0.03, bz);
            const pulse = 0.88 + Math.sin(time * 1.4 + spec.phase) * 0.14;
            wake.scale.setScalar(spec.scale * 0.86 * pulse);
          }

          // Update water sparkles
          const glintAttr = glintGeo.attributes.position;
          for (let i = 0; i < glintCount; i++) {
            const base = glintBase[i];
            if (!base) continue;
            const gx = wrapBoatX(base.x + time * 0.18, 15.5);
            const gz = base.z;
            const wave = sampleWaterWave(gx, gz + 1.2, time, ripple);
            const lift =
              0.08 + Math.max(0, Math.sin(time * 2.2 + base.phase)) * 0.14;
            glintAttr.setXYZ(i, gx, wave.height + lift, gz);
          }
          glintAttr.needsUpdate = true;

          // Gentle camera drift with pointer parallax
          pointer.x += (pointer.targetX - pointer.x) * 0.05;
          pointer.y += (pointer.targetY - pointer.y) * 0.05;
          camera.position.x = pointer.x * 0.85;
          camera.position.y = 4.3 + pointer.y * 0.28;
          camera.lookAt(pointer.x * 0.2, 0.15, -1.6);

          renderer.render(scene, camera);
        };

        const resize = () => {
          const width = Math.max(1, container.clientWidth);
          const height = Math.max(1, container.clientHeight);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          updateScene(simTimeRef.current);
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        resize();

        let inView = true;
        const intersectionObserver = new IntersectionObserver(
          (entries) => {
            inView = entries[0]?.isIntersecting ?? true;
          },
          { rootMargin: "120px" },
        );
        intersectionObserver.observe(container);

        const onPointerMove = (event: PointerEvent) => {
          const rect = container.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;
          pointer.targetX =
            ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          pointer.targetY =
            ((event.clientY - rect.top) / rect.height - 0.5) * -1;
        };

        const onPointerDown = (event: PointerEvent) => {
          if (motionQuery.matches || pausedRef.current) return;
          const rect = container.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;
          const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
          rippleRef.current = {
            active: true,
            x: nx * 10,
            z: ny * 4 + 2,
            startTime: simTimeRef.current,
            strength: 0.28,
          };
        };

        container.addEventListener("pointermove", onPointerMove, {
          passive: true,
        });
        container.addEventListener("pointerdown", onPointerDown, {
          passive: true,
        });

        let lastTimestamp = performance.now();
        const tick = (now: number) => {
          if (disposed) return;
          const dt = Math.min(0.05, (now - lastTimestamp) / 1000);
          lastTimestamp = now;

          if (!motionQuery.matches && !pausedRef.current && inView) {
            simTimeRef.current += dt;
            updateScene(simTimeRef.current);
          }

          if (!motionQuery.matches) {
            rafId = window.requestAnimationFrame(tick);
          }
        };

        const handleMotionChange = () => {
          window.cancelAnimationFrame(rafId);
          updateScene(simTimeRef.current);
          if (!motionQuery.matches) {
            lastTimestamp = performance.now();
            rafId = window.requestAnimationFrame(tick);
          }
        };

        motionQuery.addEventListener("change", handleMotionChange);

        // Render initial frame immediately (works even with reduced motion!)
        updateScene(simTimeRef.current);
        setWebglReady(true);

        if (!motionQuery.matches) {
          rafId = window.requestAnimationFrame(tick);
        }

        cleanup = () => {
          window.cancelAnimationFrame(rafId);
          motionQuery.removeEventListener("change", handleMotionChange);
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          container.removeEventListener("pointermove", onPointerMove);
          container.removeEventListener("pointerdown", onPointerDown);
          waterGeo.dispose();
          waterMat.dispose();
          hullGeometry.dispose();
          innerGeometry.dispose();
          sailGeometry.dispose();
          wakeGeo.dispose();
          wakeMat.dispose();
          glintGeo.dispose();
          glintMat.dispose();
          for (const material of boatMaterials) {
            material.dispose();
          }
          renderer.dispose();
        };
      })
      .catch(() => {
        // Fallback SVG remains visible if WebGL or Three.js fails to initialize.
      });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="paper-boats-stage"
      data-renderer={webglReady ? "webgl" : "fallback"}
      aria-hidden="true"
    >
      <StaticBoatsFallback />
      <canvas
        ref={canvasRef}
        className={`paper-boats-canvas${webglReady ? " is-ready" : ""}`}
      />
    </div>
  );
}
