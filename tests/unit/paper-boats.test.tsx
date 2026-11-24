import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";
import { SiteFooter } from "../../src/components/site-chrome";
import {
  createOrigamiBoatGeometries,
  FLEET_WRAP_HALF_WIDTH,
  PAPER_BOAT_FLEET,
  sampleWaterWave,
  wrapBoatX,
} from "../../src/lib/origami-three";

describe("Three.js paper boats scene and wave math", () => {
  test("provides a large, varied deterministic fleet of floating paper boats", () => {
    expect(PAPER_BOAT_FLEET.length).toBeGreaterThanOrEqual(20);
    const ids = new Set(PAPER_BOAT_FLEET.map((boat) => boat.id));
    expect(ids.size).toBe(PAPER_BOAT_FLEET.length);
    for (const boat of PAPER_BOAT_FLEET) {
      expect(boat.scale).toBeGreaterThan(0.4);
      expect(boat.speed).toBeGreaterThan(0);
    }
  });

  test("computes bounded analytical wave height, slopes, and ripples", () => {
    const calm = sampleWaterWave(1.5, 2.2, 0);
    const later = sampleWaterWave(1.5, 2.2, 1.4);
    expect(Number.isFinite(calm.height)).toBe(true);
    expect(Number.isFinite(calm.dx)).toBe(true);
    expect(Number.isFinite(calm.dz)).toBe(true);
    expect(later.height).not.toBe(calm.height);

    const withRipple = sampleWaterWave(0.6, 0.2, 1.0, {
      active: true,
      x: 0,
      z: 0,
      startTime: 0.7,
      strength: 0.28,
    });
    const withoutRipple = sampleWaterWave(0.6, 0.2, 1.0);
    expect(withRipple.height).not.toBe(withoutRipple.height);
  });

  test("wraps boat positions cleanly across the ocean horizon width", () => {
    expect(wrapBoatX(FLEET_WRAP_HALF_WIDTH + 1)).toBeCloseTo(
      -FLEET_WRAP_HALF_WIDTH + 1,
      5,
    );
    expect(wrapBoatX(-FLEET_WRAP_HALF_WIDTH - 2)).toBeCloseTo(
      FLEET_WRAP_HALF_WIDTH - 2,
      5,
    );
  });

  test("constructs crisp non-empty 3D origami paper boat geometries", () => {
    const { hullGeometry, innerGeometry, sailGeometry } =
      createOrigamiBoatGeometries(THREE);
    expect(hullGeometry.attributes.position.count).toBe(30);
    expect(innerGeometry.attributes.position.count).toBe(30);
    expect(sailGeometry.attributes.position.count).toBe(12);
    expect(hullGeometry.attributes.normal).toBeDefined();
    hullGeometry.dispose();
    innerGeometry.dispose();
    sailGeometry.dispose();
  });

  test("prerenders a static decorative paper-boat fallback and disabled motion toggle", () => {
    const html = renderToStaticMarkup(<SiteFooter />);
    expect(html).toContain('class="paper-boats-stage"');
    expect(html).toContain('class="footer-boats-fallback"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("Pause boats animation");
    expect(html).toContain('aria-pressed="false" disabled=""');
    expect(html).toContain('src="/telo-mark.svg"');
  });
});
