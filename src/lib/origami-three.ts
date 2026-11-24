import type * as THREE from "three";

export interface WaveSample {
  height: number;
  dx: number;
  dz: number;
}

export interface RippleState {
  active: boolean;
  x: number;
  z: number;
  startTime: number;
  strength: number;
}

export interface PaperBoatSpec {
  id: number;
  x: number;
  z: number;
  scale: number;
  speed: number;
  heading: number;
  phase: number;
  bobAmp: number;
  hullColor: number;
  sailColor: number;
  accentColor: number;
}

/**
 * Deterministic multi-directional wave height and analytical slopes (dx, dz).
 * Shared between the water mesh displacement and every floating paper boat
 * so each boat rides the exact surface slope without drifting off the water.
 */
export function sampleWaterWave(
  x: number,
  z: number,
  time: number,
  ripple?: RippleState,
): WaveSample {
  const w1 = x * 0.34 + z * 0.18 + time * 0.92;
  const w2 = x * -0.21 + z * 0.42 + time * 0.71;
  const w3 = x * 0.58 - z * 0.35 + time * 1.38;
  const w4 = x * 0.14 + z * 0.65 - time * 0.56;

  let height =
    Math.sin(w1) * 0.18 +
    Math.sin(w2) * 0.13 +
    Math.sin(w3) * 0.065 +
    Math.cos(w4) * 0.085;

  let dx =
    Math.cos(w1) * 0.18 * 0.34 +
    Math.cos(w2) * 0.13 * -0.21 +
    Math.cos(w3) * 0.065 * 0.58 -
    Math.sin(w4) * 0.085 * 0.14;

  let dz =
    Math.cos(w1) * 0.18 * 0.18 +
    Math.cos(w2) * 0.13 * 0.42 +
    Math.cos(w3) * 0.065 * -0.35 -
    Math.sin(w4) * 0.085 * 0.65;

  if (ripple?.active) {
    const age = time - ripple.startTime;
    if (age > 0 && age < 4.5) {
      const rx = x - ripple.x;
      const rz = z - ripple.z;
      const dist = Math.hypot(rx, rz);
      const waveRadius = age * 4.2;
      const delta = dist - waveRadius;
      const envelope =
        Math.exp(-(delta * delta) * 0.42) *
        Math.exp(-age * 0.72) *
        ripple.strength;
      const phase = delta * 3.1;
      height += Math.sin(phase) * envelope;
      if (dist > 0.001) {
        const dH =
          (Math.cos(phase) * 3.1 - Math.sin(phase) * 0.84 * delta) * envelope;
        dx += (dH * rx) / dist;
        dz += (dH * rz) / dist;
      }
    }
  }

  return { height, dx, dz };
}

/**
 * Deterministic fleet of 22 origami paper boats arranged across foreground,
 * midground, and distant sunlit horizon lanes.
 */
export const PAPER_BOAT_FLEET: readonly PaperBoatSpec[] = [
  // Foreground showcase boats
  {
    id: 0,
    x: -7.2,
    z: 4.5,
    scale: 1.08,
    speed: 0.46,
    heading: 0.14,
    phase: 0.2,
    bobAmp: 1.0,
    hullColor: 0xfffcf5,
    sailColor: 0xffffff,
    accentColor: 0xffd7a8,
  },
  {
    id: 1,
    x: -2.6,
    z: 5.4,
    scale: 1.18,
    speed: 0.4,
    heading: -0.09,
    phase: 1.5,
    bobAmp: 1.05,
    hullColor: 0xfff4e2,
    sailColor: 0xfffcf8,
    accentColor: 0xffb775,
  },
  {
    id: 2,
    x: 2.8,
    z: 4.9,
    scale: 1.12,
    speed: 0.48,
    heading: 0.18,
    phase: 2.9,
    bobAmp: 0.98,
    hullColor: 0xfffdf8,
    sailColor: 0xfff7ea,
    accentColor: 0xffcd94,
  },
  {
    id: 3,
    x: 7.9,
    z: 4.2,
    scale: 1.02,
    speed: 0.43,
    heading: -0.12,
    phase: 4.1,
    bobAmp: 1.0,
    hullColor: 0xffe8c7,
    sailColor: 0xfff9f0,
    accentColor: 0xf49763,
  },
  {
    id: 4,
    x: -11.4,
    z: 3.4,
    scale: 0.96,
    speed: 0.52,
    heading: 0.08,
    phase: 5.2,
    bobAmp: 0.95,
    hullColor: 0xfff7ea,
    sailColor: 0xffffff,
    accentColor: 0xffbe82,
  },
  {
    id: 5,
    x: 11.8,
    z: 3.6,
    scale: 0.94,
    speed: 0.47,
    heading: -0.15,
    phase: 0.9,
    bobAmp: 0.95,
    hullColor: 0xfffcf6,
    sailColor: 0xfff2dc,
    accentColor: 0xf6a468,
  },
  // Midground drifting fleet
  {
    id: 6,
    x: -9.6,
    z: 1.4,
    scale: 0.86,
    speed: 0.36,
    heading: 0.22,
    phase: 1.9,
    bobAmp: 0.9,
    hullColor: 0xffefd6,
    sailColor: 0xfffbf2,
    accentColor: 0xf59d62,
  },
  {
    id: 7,
    x: -5.1,
    z: 1.8,
    scale: 0.92,
    speed: 0.39,
    heading: -0.16,
    phase: 3.2,
    bobAmp: 0.92,
    hullColor: 0xfffdf9,
    sailColor: 0xffffff,
    accentColor: 0xffd49e,
  },
  {
    id: 8,
    x: -0.4,
    z: 2.3,
    scale: 0.98,
    speed: 0.35,
    heading: 0.11,
    phase: 4.6,
    bobAmp: 0.95,
    hullColor: 0xffe5bd,
    sailColor: 0xfff7e8,
    accentColor: 0xf27f4e,
  },
  {
    id: 9,
    x: 4.9,
    z: 1.7,
    scale: 0.88,
    speed: 0.42,
    heading: -0.07,
    phase: 5.8,
    bobAmp: 0.9,
    hullColor: 0xfffbf4,
    sailColor: 0xffffff,
    accentColor: 0xffc68a,
  },
  {
    id: 10,
    x: 9.8,
    z: 1.2,
    scale: 0.82,
    speed: 0.38,
    heading: 0.19,
    phase: 0.5,
    bobAmp: 0.88,
    hullColor: 0xfff1dc,
    sailColor: 0xfffdf8,
    accentColor: 0xf7a265,
  },
  {
    id: 11,
    x: -13.6,
    z: 0.4,
    scale: 0.78,
    speed: 0.33,
    heading: -0.1,
    phase: 2.4,
    bobAmp: 0.85,
    hullColor: 0xfffcf5,
    sailColor: 0xfff5e3,
    accentColor: 0xffc285,
  },
  {
    id: 12,
    x: 13.8,
    z: 0.6,
    scale: 0.76,
    speed: 0.34,
    heading: 0.12,
    phase: 3.9,
    bobAmp: 0.85,
    hullColor: 0xffebc9,
    sailColor: 0xfffcf6,
    accentColor: 0xf38b56,
  },
  // Upper-mid / golden horizon boats
  {
    id: 13,
    x: -11.2,
    z: -1.8,
    scale: 0.68,
    speed: 0.28,
    heading: 0.15,
    phase: 1.1,
    bobAmp: 0.8,
    hullColor: 0xfff6e7,
    sailColor: 0xffffff,
    accentColor: 0xffc990,
  },
  {
    id: 14,
    x: -6.8,
    z: -2.2,
    scale: 0.72,
    speed: 0.31,
    heading: -0.18,
    phase: 2.7,
    bobAmp: 0.82,
    hullColor: 0xffe4bc,
    sailColor: 0xfff9ee,
    accentColor: 0xf49059,
  },
  {
    id: 15,
    x: -2.1,
    z: -1.6,
    scale: 0.75,
    speed: 0.29,
    heading: 0.06,
    phase: 4.3,
    bobAmp: 0.84,
    hullColor: 0xfffdf8,
    sailColor: 0xffffff,
    accentColor: 0xffd8aa,
  },
  {
    id: 16,
    x: 2.6,
    z: -2.4,
    scale: 0.7,
    speed: 0.27,
    heading: -0.11,
    phase: 5.5,
    bobAmp: 0.8,
    hullColor: 0xfff3de,
    sailColor: 0xfffcf7,
    accentColor: 0xf7a467,
  },
  {
    id: 17,
    x: 7.4,
    z: -1.9,
    scale: 0.69,
    speed: 0.32,
    heading: 0.17,
    phase: 0.8,
    bobAmp: 0.8,
    hullColor: 0xfffaf0,
    sailColor: 0xffffff,
    accentColor: 0xffbf82,
  },
  {
    id: 18,
    x: 12.1,
    z: -2.5,
    scale: 0.64,
    speed: 0.26,
    heading: -0.14,
    phase: 2.1,
    bobAmp: 0.78,
    hullColor: 0xffe8c6,
    sailColor: 0xfff9ef,
    accentColor: 0xf28753,
  },
  // Distant horizon silhouettes
  {
    id: 19,
    x: -8.5,
    z: -5.1,
    scale: 0.54,
    speed: 0.22,
    heading: 0.1,
    phase: 3.5,
    bobAmp: 0.72,
    hullColor: 0xfff5e3,
    sailColor: 0xffffff,
    accentColor: 0xffcf9a,
  },
  {
    id: 20,
    x: 0.5,
    z: -5.5,
    scale: 0.56,
    speed: 0.2,
    heading: -0.08,
    phase: 4.9,
    bobAmp: 0.74,
    hullColor: 0xfffcf6,
    sailColor: 0xffffff,
    accentColor: 0xffbe80,
  },
  {
    id: 21,
    x: 8.8,
    z: -4.9,
    scale: 0.52,
    speed: 0.23,
    heading: 0.13,
    phase: 1.4,
    bobAmp: 0.72,
    hullColor: 0xffebd0,
    sailColor: 0xfffbf4,
    accentColor: 0xf59960,
  },
] as const;

export const FLEET_WRAP_HALF_WIDTH = 16.5;

/**
 * Wraps a horizontal boat position smoothly across [-halfWidth, halfWidth].
 */
export function wrapBoatX(x: number, halfWidth = FLEET_WRAP_HALF_WIDTH) {
  const span = halfWidth * 2;
  return ((((x + halfWidth) % span) + span) % span) - halfWidth;
}

/**
 * Builds a crisp, faceted 3D folded origami paper boat mesh group
 * echoing Telo's sunny paper boat emblem.
 */
export function createOrigamiBoatGeometries(three: typeof THREE) {
  const pushTri = (
    target: number[],
    a: [number, number, number],
    b: [number, number, number],
    c: [number, number, number],
  ) => {
    target.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  };

  // Outer & inner hull coordinates
  const bowTip: [number, number, number] = [1.08, 0.45, 0];
  const sternTip: [number, number, number] = [-1.08, 0.45, 0];
  const gunwaleL: [number, number, number] = [0, 0.34, 0.49];
  const gunwaleR: [number, number, number] = [0, 0.34, -0.49];

  const bowBottom: [number, number, number] = [0.64, 0.03, 0];
  const sternBottom: [number, number, number] = [-0.64, 0.03, 0];
  const keelL: [number, number, number] = [0, 0.0, 0.24];
  const keelR: [number, number, number] = [0, 0.0, -0.24];

  // Recessed interior pocket
  const innerBow: [number, number, number] = [0.62, 0.2, 0];
  const innerStern: [number, number, number] = [-0.62, 0.2, 0];
  const innerL: [number, number, number] = [0, 0.17, 0.28];
  const innerR: [number, number, number] = [0, 0.17, -0.28];

  const hullVerts: number[] = [];
  // Port side outer facets
  pushTri(hullVerts, bowTip, gunwaleL, keelL);
  pushTri(hullVerts, bowTip, keelL, bowBottom);
  pushTri(hullVerts, sternTip, keelL, gunwaleL);
  pushTri(hullVerts, sternTip, sternBottom, keelL);
  // Starboard side outer facets
  pushTri(hullVerts, bowTip, keelR, gunwaleR);
  pushTri(hullVerts, bowTip, bowBottom, keelR);
  pushTri(hullVerts, sternTip, gunwaleR, keelR);
  pushTri(hullVerts, sternTip, keelR, sternBottom);
  // Bottom underside
  pushTri(hullVerts, bowBottom, keelL, keelR);
  pushTri(hullVerts, sternBottom, keelR, keelL);

  const hullGeometry = new three.BufferGeometry();
  hullGeometry.setAttribute(
    "position",
    new three.Float32BufferAttribute(hullVerts, 3),
  );
  hullGeometry.computeVertexNormals();

  // Inner pocket facets (warm folded interior tint)
  const innerVerts: number[] = [];
  pushTri(innerVerts, bowTip, innerL, gunwaleL);
  pushTri(innerVerts, bowTip, innerBow, innerL);
  pushTri(innerVerts, sternTip, gunwaleL, innerL);
  pushTri(innerVerts, sternTip, innerL, innerStern);
  pushTri(innerVerts, bowTip, gunwaleR, innerR);
  pushTri(innerVerts, bowTip, innerR, innerBow);
  pushTri(innerVerts, sternTip, innerR, gunwaleR);
  pushTri(innerVerts, sternTip, innerStern, innerR);
  pushTri(innerVerts, innerBow, innerR, innerL);
  pushTri(innerVerts, innerStern, innerL, innerR);

  const innerGeometry = new three.BufferGeometry();
  innerGeometry.setAttribute(
    "position",
    new three.Float32BufferAttribute(innerVerts, 3),
  );
  innerGeometry.computeVertexNormals();

  // Central folded origami sail pyramid
  const sailPeak: [number, number, number] = [0, 0.96, 0];
  const sailFore: [number, number, number] = [0.46, 0.25, 0];
  const sailAft: [number, number, number] = [-0.46, 0.25, 0];
  const sailBaseL: [number, number, number] = [0, 0.24, 0.22];
  const sailBaseR: [number, number, number] = [0, 0.24, -0.22];

  const sailVerts: number[] = [];
  pushTri(sailVerts, sailPeak, sailBaseL, sailFore);
  pushTri(sailVerts, sailPeak, sailAft, sailBaseL);
  pushTri(sailVerts, sailPeak, sailFore, sailBaseR);
  pushTri(sailVerts, sailPeak, sailBaseR, sailAft);

  const sailGeometry = new three.BufferGeometry();
  sailGeometry.setAttribute(
    "position",
    new three.Float32BufferAttribute(sailVerts, 3),
  );
  sailGeometry.computeVertexNormals();

  return { hullGeometry, innerGeometry, sailGeometry };
}
