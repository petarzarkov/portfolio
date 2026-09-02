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

export interface CoffeeScene {
  readonly group: THREE_NS.Group;
  readonly steam: readonly Steam[];
  readonly lights: readonly THREE_NS.RectAreaLight[];
  /** Roughly how tall the whole arrangement is, for framing the camera. */
  readonly height: number;
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

const CERAMIC = 0xf2efe9;
const CREMA = 0xd9b98a;
const COFFEE = 0x2a1409;

export const buildCoffee = (three: THREE): CoffeeScene => {
  const group = new three.Group();

  const ceramic = new three.MeshStandardMaterial({
    color: CERAMIC,
    roughness: 0.34,
    metalness: 0.02,
  });

  // Open-ended, and double sided so the inside wall is there when the camera
  // looks slightly down into the cup.
  const body = new three.Mesh(
    new three.CylinderGeometry(1.2, 0.92, 1.55, 64, 1, true),
    new three.MeshStandardMaterial({
      color: CERAMIC,
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

  // The dark ring of coffee the foam does not quite reach.
  const surface = new three.Mesh(
    new three.CircleGeometry(1.17, 64),
    new three.MeshStandardMaterial({
      color: COFFEE,
      roughness: 0.18,
      metalness: 0,
    }),
  );
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = 1.44;
  group.add(surface);

  // Foam, slightly domed rather than a flat disc: a sphere squashed on Y and
  // clipped by the cup rim reads as crema without needing a texture.
  const foam = new three.Mesh(
    new three.SphereGeometry(1.1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2),
    new three.MeshStandardMaterial({
      color: CREMA,
      roughness: 0.92,
      metalness: 0,
    }),
  );
  foam.scale.y = 0.17;
  foam.position.y = 1.45;
  group.add(foam);

  // One off-centre ring, which is all latte art needs to read at this size.
  const art = new three.Mesh(
    new three.TorusGeometry(0.52, 0.055, 12, 64),
    new three.MeshStandardMaterial({ color: 0xfff6e6, roughness: 0.95 }),
  );
  art.rotation.x = -Math.PI / 2;
  art.position.set(0.1, 1.475, 0.05);
  group.add(art);

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
  for (let i = 0; i < 7; i++) {
    const mesh = new three.Mesh(
      new three.PlaneGeometry(1, 1),
      new three.MeshBasicMaterial({
        map: texture,
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
      offset: i / 7,
      drift: (i % 2 === 0 ? 1 : -1) * (0.35 + (i % 3) * 0.18),
      scale: 0.85 + (i % 4) * 0.22,
      spin: (i % 2 === 0 ? 1 : -1) * (0.6 + (i % 3) * 0.35),
    });
  }

  return { group, steam, lights: [], height: 4.7 };
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
