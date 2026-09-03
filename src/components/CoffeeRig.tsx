import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from 'motion/react';
import { advanceSteam, buildCoffee } from './coffee-scene';
import classes from './CoffeeRig.module.css';

/**
 * The width at which there is room beside the text for a cup.
 *
 * Must match the breakpoint in CoffeeRig.module.css. Above it the scene is a
 * fixed backdrop in the empty half of the viewport; below it there is no empty
 * half, so it becomes a block in the flow instead - see the note on the
 * component.
 */
const WIDE = '(min-width: 62em)';

const subscribe = (onChange: () => void): (() => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

/** Tracks the breakpoint, and re-renders when a rotation crosses it. */
const useWideViewport = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(WIDE).matches,
    () => false,
  );

/**
 * A cup of coffee under a three-point area-light rig, as a page backdrop.
 *
 * Everything a decorative canvas on someone else's page needs and a standalone
 * demo does not:
 *
 *   - three is imported only once the page asks for it, so it is nowhere near
 *     the entry chunk and the route that hosts it stays a few KB.
 *   - It renders only while the tab is visible.
 *   - `prefers-reduced-motion` gets one static frame rather than no scene.
 *   - Everything is disposed on unmount. WebGL contexts are a limited
 *     per-browser resource and strict mode alone mounts this twice.
 *
 * Rendered through a portal to `document.body`. `position: fixed` resolves
 * against the nearest ancestor with a transform, filter or containment rather
 * than the viewport, so a backdrop nested in page content is one CSS property
 * on any ancestor away from scrolling off with the text - which is what it did
 * on mobile.
 *
 * Two layouts, because a phone has no empty column to put a cup in.
 *
 * Wide: a fixed backdrop in the right half of the viewport, which About's 72ch
 * text column never reaches. Narrow: a block at the top of the page, in the
 * flow, with the copy starting underneath it.
 *
 * The narrow case is deliberately *not* the backdrop scaled down. Behind a full
 * -width text column the ceramic sat directly under body copy, and fading it
 * far enough that dimmed text still clears 4.5:1 on it means about 14% opacity
 * - invisible, and still charging for `three`. Given its own band it is fully
 * visible, at full strength, and overlaps nothing.
 */
export const CoffeeRig = () => {
  const reduced = useReducedMotion();
  const wide = useWideViewport();
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const build = async () => {
      const THREE = await import('three');
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setFailed(true);
        return;
      }

      // Stands in for the graded look of a LUT pass without shipping a LUT or
      // a second renderer: ACES rolls the highlights off instead of clipping
      // the foam to flat white where the key light lands.
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.setClearAlpha(0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);

      const coffee = buildCoffee(THREE);
      scene.add(coffee.group);

      const AIM = new THREE.Vector3(0, 1.55, 0);

      /**
       * Key left, fill right, top light above - each keeping to its own side
       * and breathing within it.
       *
       * `PointLight`, not `RectAreaLight`. The area light gave slightly softer
       * panels across the ceramic, and cost 101 KB gzipped to do it:
       * `RectAreaLightUniformsLib` is two 64x64 LTC lookup tables written out as
       * float literals, and it is the single largest thing this route ever
       * downloaded - on a page whose text is the point. Raising the coffee's
       * roughness in `coffee-scene.ts` spreads the specular enough that the
       * difference is a matter of taste rather than of quality.
       *
       * Intensity is in candela and falls off with the square of distance, so
       * these are tuned against the ~6-unit working distance of the rig.
       */
      const RIG = [
        {
          color: 0xffb01b,
          intensity: 165,
          home: [-4.6, 3.4, -3.2],
          sway: [0.9, 0.7, 0.8],
          rate: 0.24,
        },
        {
          color: 0x6b5bd2,
          intensity: 140,
          home: [4.6, 3.1, -3.2],
          sway: [0.9, 0.8, 0.8],
          rate: 0.19,
        },
        {
          // Warm cream rather than the red-orange this used to be. Sitting
          // above and slightly camera-side, it reflects off a glossy liquid
          // straight into the lens, and a saturated red panel is why the coffee
          // read as red wine in every screenshot.
          color: 0xffd8a8,
          intensity: 120,
          home: [0, 6.2, -1.6],
          sway: [1.4, 0.5, 0.8],
          rate: 0.15,
        },
      ] as const;

      const lights = RIG.map(({ color, intensity, home }) => {
        const light = new THREE.PointLight(color, intensity);
        light.position.set(home[0], home[1], home[2]);
        scene.add(light);
        return light;
      });

      // Keeps the side facing away from all three panels off pure black. A
      // hemisphere light is two colours and no shadow map - the cheapest fill
      // there is.
      scene.add(new THREE.HemisphereLight(0xe8ecff, 0x241a10, 0.5));

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.domElement.className = classes.canvas ?? '';
      node.prepend(renderer.domElement);

      /**
       * Framed from the aspect rather than a fixed distance.
       *
       * A portrait phone has a narrow horizontal field for the same vertical
       * one, so a distance that frames the cup on a desktop puts most of it off
       * the sides of a phone - which is why it was barely visible there.
       */
      let framed = { w: 0, h: 0 };

      const frame = () => {
        const { clientWidth: w, clientHeight: h } = node;
        if (w === 0 || h === 0) return;
        if (w === framed.w && h === framed.h) return;

        renderer.setSize(w, h, false);
        camera.aspect = w / h;

        /**
         * The camera distance is deliberately *not* recomputed for a small
         * height-only change.
         *
         * A phone's URL bar hides as you scroll down and returns as you scroll
         * up, and each of those resizes the viewport. Re-deriving the distance
         * every time moved the cup mid-gesture and left it somewhere else,
         * which is the bug this guard exists for. `100lvh` on the backdrop
         * should already hold the element still, but that is one CSS unit's
         * support away from being wrong and this does not depend on it.
         *
         * A real change - a rotation, a resized window - moves the width, or
         * moves the height by far more than browser chrome ever does.
         */
        const widthChanged = w !== framed.w;
        const heightJump =
          Math.abs(h - framed.h) / Math.max(framed.h, 1) > 0.25;

        if (framed.h === 0 || widthChanged || heightJump) {
          const vFov = (camera.fov * Math.PI) / 180;
          const byHeight = coffee.height / 2 / Math.tan(vFov / 2);
          const byWidth = 4.8 / 2 / Math.tan(vFov / 2) / camera.aspect;
          // The camera sits well above the aim point, so its true distance to
          // the subject is longer than this; less padding is needed than at
          // eye level.
          // 1.02 framed the cup edge-to-edge and clipped the saucer off the
          // bottom and right of the stage, which is narrower than the viewport
          // now that the scene keeps to its own column.
          const distance = Math.max(byHeight, byWidth) * 1.24;

          // High enough to see over the rim. At a near-level angle the rim
          // occludes the coffee, which is the whole reason there is a cup and
          // not just a cylinder.
          camera.position.set(0, 5.2, -distance);
          camera.lookAt(AIM);
        }

        framed = { w, h };
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      frame();

      const observer = new ResizeObserver(frame);
      observer.observe(node);

      const clock = new THREE.Clock();
      let running = false;

      const tick = () => {
        // `getElapsedTime()`, not the `elapsedTime` property: the property only
        // advances when one of the getters is called. Reading it directly meant
        // every frame saw 0 and the whole scene - steam, lights, cup - redrew
        // an identical image sixty times a second.
        const elapsed = clock.getElapsedTime();

        lights.forEach((light, index) => {
          const rig = RIG[index];
          if (!rig) return;
          const [x, y, z] = rig.home;
          const [sx, sy, sz] = rig.sway;
          const t = elapsed * rig.rate + index * 1.7;
          light.position.set(
            x + Math.sin(t) * sx,
            y + Math.sin(t * 1.3) * sy,
            z + Math.cos(t * 0.8) * sz,
          );
        });

        coffee.group.rotation.y = Math.sin(elapsed * 0.12) * 0.22;
        advanceSteam(coffee.steam, elapsed);
        renderer.render(scene, camera);
      };

      const start = () => {
        if (running || reduced === true) return;
        running = true;
        clock.start();
        renderer.setAnimationLoop(tick);
      };
      const stop = () => {
        running = false;
        renderer.setAnimationLoop(null);
      };

      // No IntersectionObserver here. Wide, the backdrop covers the viewport for
      // as long as the route is mounted; narrow, the band sits at the top of a
      // page people arrive at the top of. Tab visibility is the one that still
      // matters, and it is the one that actually saves a phone any battery.
      const onVisibility = () => (document.hidden ? stop() : start());
      document.addEventListener('visibilitychange', onVisibility);
      start();

      cleanup = () => {
        stop();
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);

        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const material = object.material as {
              map?: { dispose?: () => void };
              dispose?: () => void;
            };
            material.map?.dispose?.();
            material.dispose?.();
          }
        });
        renderer.domElement.remove();
        renderer.dispose();
        renderer.forceContextLoss();
      };
    };

    // Fetched as soon as the route mounts rather than on intersection: this is
    // the page background, so it is on screen immediately by definition.
    void build();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reduced, wide]);

  const stage = (
    <div className={classes.stage} ref={host}>
      {failed && <div className={classes.fallback} />}
    </div>
  );

  // In the flow, above the copy. No scrim: nothing is written over it, so there
  // is no contrast to protect and no reason to dim the scene.
  if (!wide) {
    return (
      <div className={classes.band} aria-hidden>
        {stage}
      </div>
    );
  }

  return createPortal(
    <div className={classes.backdrop} aria-hidden>
      {stage}
      <div className={classes.scrim} />
    </div>,
    document.body,
  );
};
