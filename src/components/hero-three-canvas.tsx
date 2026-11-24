import { useEffect, useRef, useState } from "react";
import { createOrigamiBoatGeometries } from "../lib/origami-three";

const HERO_FLOATERS = [
  {
    x: -5.8,
    y: 2.3,
    z: -2.4,
    scale: 0.62,
    speed: 0.65,
    phase: 0.4,
    hull: 0xfffaf0,
    sail: 0xffffff,
    accent: 0xffc688,
  },
  {
    x: 6.1,
    y: 2.6,
    z: -3.2,
    scale: 0.54,
    speed: 0.58,
    phase: 1.9,
    hull: 0xffe8c2,
    sail: 0xfffcf5,
    accent: 0xf4945e,
  },
  {
    x: -6.4,
    y: -1.9,
    z: -3.6,
    scale: 0.5,
    speed: 0.72,
    phase: 3.1,
    hull: 0xfff3de,
    sail: 0xffffff,
    accent: 0xffba78,
  },
  {
    x: 6.5,
    y: -1.6,
    z: -2.8,
    scale: 0.58,
    speed: 0.6,
    phase: 4.5,
    hull: 0xfffdf8,
    sail: 0xfff7ea,
    accent: 0xf6a265,
  },
  {
    x: 0.4,
    y: 3.2,
    z: -4.8,
    scale: 0.44,
    speed: 0.5,
    phase: 2.6,
    hull: 0xffefd4,
    sail: 0xffffff,
    accent: 0xf27f4e,
  },
] as const;

export default function HeroThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

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
            powerPreference: "low-power",
          });
        } catch {
          return;
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 40);
        camera.position.set(0, 0, 8.6);

        const hemi = new THREE.HemisphereLight(0xfff9ea, 0xf2b580, 1.45);
        scene.add(hemi);

        const sun = new THREE.DirectionalLight(0xffcf82, 1.8);
        sun.position.set(5, 7, 6);
        scene.add(sun);

        const { hullGeometry, innerGeometry, sailGeometry } =
          createOrigamiBoatGeometries(THREE);

        const materials: InstanceType<typeof THREE.MeshStandardMaterial>[] = [];
        const floaters = HERO_FLOATERS.map((spec) => {
          const group = new THREE.Group();
          const hullMat = new THREE.MeshStandardMaterial({
            color: spec.hull,
            flatShading: true,
            roughness: 0.65,
            metalness: 0.02,
            transparent: true,
            opacity: 0.88,
            side: THREE.DoubleSide,
          });
          const innerMat = new THREE.MeshStandardMaterial({
            color: spec.accent,
            flatShading: true,
            roughness: 0.78,
            transparent: true,
            opacity: 0.88,
            side: THREE.DoubleSide,
          });
          const sailMat = new THREE.MeshStandardMaterial({
            color: spec.sail,
            flatShading: true,
            roughness: 0.6,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide,
          });
          materials.push(hullMat, innerMat, sailMat);

          group.add(new THREE.Mesh(hullGeometry, hullMat));
          group.add(new THREE.Mesh(innerGeometry, innerMat));
          group.add(new THREE.Mesh(sailGeometry, sailMat));
          group.scale.setScalar(spec.scale);
          group.position.set(spec.x, spec.y, spec.z);
          scene.add(group);
          return { spec, group };
        });

        // Subtle warm golden sunlit dust motes
        const moteCount = 32;
        const motePositions = new Float32Array(moteCount * 3);
        const moteSeeds = Array.from({ length: moteCount }, (_, i) => ({
          x: (((i * 61) % 100) / 100 - 0.5) * 14,
          y: (((i * 37) % 100) / 100 - 0.5) * 7.5,
          z: -2 - (((i * 29) % 100) / 100) * 4,
          phase: i * 1.17,
        }));
        const moteGeo = new THREE.BufferGeometry();
        moteGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(motePositions, 3),
        );
        const moteMat = new THREE.PointsMaterial({
          color: 0xf4a554,
          size: 0.1,
          transparent: true,
          opacity: 0.42,
          depthWrite: false,
        });
        scene.add(new THREE.Points(moteGeo, moteMat));

        const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

        const renderFrame = (time: number) => {
          pointer.x += (pointer.targetX - pointer.x) * 0.04;
          pointer.y += (pointer.targetY - pointer.y) * 0.04;

          for (const { spec, group } of floaters) {
            group.position.x =
              spec.x + Math.sin(time * 0.35 + spec.phase) * 0.32;
            group.position.y =
              spec.y + Math.cos(time * spec.speed + spec.phase) * 0.28;
            group.rotation.y =
              time * 0.22 * spec.speed + spec.phase + pointer.x * 0.35;
            group.rotation.z =
              Math.sin(time * 0.55 + spec.phase) * 0.16 - pointer.x * 0.12;
            group.rotation.x =
              0.22 +
              Math.cos(time * 0.48 + spec.phase) * 0.12 +
              pointer.y * 0.15;
          }

          const attr = moteGeo.attributes.position;
          for (let i = 0; i < moteCount; i++) {
            const seed = moteSeeds[i];
            if (!seed) continue;
            attr.setXYZ(
              i,
              seed.x + Math.sin(time * 0.3 + seed.phase) * 0.25,
              seed.y + Math.cos(time * 0.42 + seed.phase) * 0.28,
              seed.z,
            );
          }
          attr.needsUpdate = true;

          camera.position.x = pointer.x * 0.45;
          camera.position.y = pointer.y * 0.28;
          camera.lookAt(0, 0, -2);

          renderer.render(scene, camera);
        };

        const resize = () => {
          const width = Math.max(1, container.clientWidth);
          const height = Math.max(1, container.clientHeight);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          renderFrame(simTime);
        };

        let simTime = 0;
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        resize();

        let inView = true;
        const intersectionObserver = new IntersectionObserver(
          (entries) => {
            inView = entries[0]?.isIntersecting ?? true;
          },
          { rootMargin: "100px" },
        );
        intersectionObserver.observe(container);

        const onPointerMove = (event: PointerEvent) => {
          const rect = container.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;
          pointer.targetX =
            ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          pointer.targetY =
            ((event.clientY - rect.top) / rect.height - 0.5) * -2;
        };
        window.addEventListener("pointermove", onPointerMove, {
          passive: true,
        });

        let lastTime = performance.now();
        const tick = (now: number) => {
          if (disposed) return;
          const dt = Math.min(0.05, (now - lastTime) / 1000);
          lastTime = now;
          if (!motionQuery.matches && inView) {
            simTime += dt;
            renderFrame(simTime);
          }
          if (!motionQuery.matches) {
            rafId = window.requestAnimationFrame(tick);
          }
        };

        const onMotionChange = () => {
          window.cancelAnimationFrame(rafId);
          renderFrame(simTime);
          if (!motionQuery.matches) {
            lastTime = performance.now();
            rafId = window.requestAnimationFrame(tick);
          }
        };
        motionQuery.addEventListener("change", onMotionChange);

        renderFrame(simTime);
        setReady(true);

        if (!motionQuery.matches) {
          rafId = window.requestAnimationFrame(tick);
        }

        cleanup = () => {
          window.cancelAnimationFrame(rafId);
          motionQuery.removeEventListener("change", onMotionChange);
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          window.removeEventListener("pointermove", onPointerMove);
          hullGeometry.dispose();
          innerGeometry.dispose();
          sailGeometry.dispose();
          moteGeo.dispose();
          moteMat.dispose();
          for (const material of materials) {
            material.dispose();
          }
          renderer.dispose();
        };
      })
      .catch(() => {
        // Silently degrade if WebGL is unavailable.
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
      className="hero-three-layer"
      data-renderer={ready ? "webgl" : "idle"}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className={`hero-three-canvas${ready ? " is-ready" : ""}`}
      />
    </div>
  );
}
