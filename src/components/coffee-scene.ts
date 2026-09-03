import type * as THREE_NS from 'three';

/**
 * Builds the cup, and returns the handles the animation loop needs.
 *
 * Takes the `three` namespace rather than importing it, because the module is
 * loaded dynamically - see `CoffeeRig.tsx`. Keeping the geometry here keeps
 * that file about lifecycle and this one about the scene.
 */

type THREE = typeof THREE_NS;

export interface Steam {
  readonly mesh: THREE_NS.Mesh;
  /** Where in its rise this wisp starts, so they do not pulse in unison. */
  readonly offset: number;
  readonly drift: number;
  readonly scale: number;
  /** Radians per unit of rise, so each wisp tumbles at its own rate. */
  readonly spin: number;
}

/**
 * Every colour in the scene, one theme's worth.
 *
 * Read out of CSS rather than declared here, so the cup is themed from the same
 * file as the page around it - see the `--scene-*` tokens in `themes.css`.
 */
export interface ScenePalette {
  readonly key: string;
  readonly fill: string;
  readonly top: string;
  readonly sky: string;
  readonly ground: string;
  readonly steam: string;
  readonly ceramic: string;
  readonly coffee: string;
}

const TOKENS = [
  'key',
  'fill',
  'top',
  'sky',
  'ground',
  'steam',
  'ceramic',
  'coffee',
] as const;

/** The palette for whichever theme is currently stamped on `<html>`. */
export const readScenePalette = (): ScenePalette => {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string): string =>
    style.getPropertyValue(`--scene-${name}`).trim() || '#ffffff';

  return Object.fromEntries(
    TOKENS.map((token) => [token, read(token)]),
  ) as unknown as ScenePalette;
};

export interface CoffeeScene {
  readonly group: THREE_NS.Group;
  readonly steam: readonly Steam[];
  /** Roughly how tall the whole arrangement is, for framing the camera. */
  readonly height: number;
  /**
   * Recolours the cup in place.
   *
   * In place, rather than rebuilding: a WebGL context is a limited per-browser
   * resource, and tearing one down and standing another up on every click of
   * the theme picker is a good way to run out of them.
   */
  paint(palette: ScenePalette): void;
}

/**
 * A soft wisp, drawn once into a canvas.
 *
 * Steam has no hard edges, and a radial gradient with a squared falloff is
 * closer to one than the linear default - a linear ramp leaves a visible disc
 * edge once several of these overlap.
 */
const wispTexture = (three: THREE): THREE_NS.CanvasTexture => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no 2d context for the steam texture');

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    gradient.addColorStop(t, `rgba(255,255,255,${(1 - t) ** 2.2})`);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new three.CanvasTexture(canvas);
  texture.colorSpace = three.SRGBColorSpace;
  return texture;
};

export const buildCoffee = (
  three: THREE,
  palette: ScenePalette,
): CoffeeScene => {
  const group = new three.Group();

  const ceramic = new three.MeshStandardMaterial({
    color: palette.ceramic,
    roughness: 0.34,
    metalness: 0.02,
  });

  // Open-ended, and double sided so the inside wall is there when the camera
  // looks slightly down into the cup.
  const body = new three.Mesh(
    new three.CylinderGeometry(1.2, 0.92, 1.55, 64, 1, true),
    new three.MeshStandardMaterial({
      color: palette.ceramic,
      roughness: 0.34,
      metalness: 0.02,
      side: three.DoubleSide,
    }),
  );
  body.position.y = 0.82;
  group.add(body);

  const base = new three.Mesh(
    new three.CylinderGeometry(0.92, 0.92, 0.09, 64),
    ceramic,
  );
  base.position.y = 0.09;
  group.add(base);

  // Just the coffee. Glossy enough that the rig catches on it as highlights -
  // a matte disc reads as dark card - but no longer a near-mirror. At 0.11 a
  // point light returns a hard specular dot, and the surface took the colour of
  // whatever was overhead; 0.24 spreads that into a sheen the brown survives.
  const surface = new three.Mesh(
    new three.CircleGeometry(1.17, 64),
    new three.MeshStandardMaterial({
      color: palette.coffee,
      roughness: 0.24,
      // Barely metallic. At 0.2 the panel overhead tinted the whole surface and
      // the coffee read as red wine rather than coffee; near zero it keeps its
      // own brown and takes the rig as highlights instead.
      metalness: 0.02,
    }),
  );
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = 1.38;
  group.add(surface);

  const handle = new three.Mesh(
    new three.TorusGeometry(0.46, 0.1, 16, 64, Math.PI * 1.25),
    ceramic,
  );
  handle.position.set(1.28, 0.86, 0);
  handle.rotation.z = -Math.PI * 0.62;
  group.add(handle);

  const saucer = new three.Mesh(
    new three.CylinderGeometry(2.05, 1.85, 0.1, 64),
    ceramic,
  );
  saucer.position.y = 0.03;
  group.add(saucer);

  const texture = wispTexture(three);
  const steam: Steam[] = [];
  for (let i = 0; i < 11; i++) {
    const mesh = new three.Mesh(
      new three.PlaneGeometry(1, 1),
      new three.MeshBasicMaterial({
        map: texture,
        color: palette.steam,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        // A PlaneGeometry faces +Z and the camera looks from -Z, so with the
        // default FrontSide every wisp was back-face culled and the steam did
        // not render at all.
        side: three.DoubleSide,
        blending: three.NormalBlending,
      }),
    );
    group.add(mesh);
    steam.push({
      mesh,
      offset: i / 11,
      drift: (i % 2 === 0 ? 1 : -1) * (0.35 + (i % 3) * 0.18),
      scale: 0.85 + (i % 4) * 0.22,
      spin: (i % 2 === 0 ? 1 : -1) * (0.6 + (i % 3) * 0.35),
    });
  }

  const paint = (next: ScenePalette): void => {
    ceramic.color.set(next.ceramic);
    (body.material as THREE_NS.MeshStandardMaterial).color.set(next.ceramic);
    (surface.material as THREE_NS.MeshStandardMaterial).color.set(next.coffee);
    for (const wisp of steam) {
      (wisp.mesh.material as THREE_NS.MeshBasicMaterial).color.set(next.steam);
    }
  };

  return { group, steam, height: 4.7, paint };
};

/**
 * Advances the steam. Each wisp rises, widens and fades on its own phase, then
 * restarts - so the column never empties and never pulses as one.
 */
export const advanceSteam = (
  steam: readonly Steam[],
  elapsed: number,
): void => {
  for (const wisp of steam) {
    const t = (elapsed * 0.14 + wisp.offset) % 1;
    const rise = 1.55 + t * 2.9;
    const spread = 0.35 + t * 1.25;

    wisp.mesh.position.set(
      Math.sin(t * 3.3 + wisp.offset * 6.2) * wisp.drift * t,
      rise,
      Math.cos(t * 2.1 + wisp.offset * 4.4) * 0.18 * t,
    );
    wisp.mesh.scale.setScalar(spread * wisp.scale);

    // In over the first fifth, out over the rest: steam is densest just above
    // the surface, not at the top of its climb.
    const material = wisp.mesh.material as THREE_NS.MeshBasicMaterial;
    material.opacity = Math.min(t / 0.2, 1) * (1 - t) ** 1.4 * 0.85;
  }
};
