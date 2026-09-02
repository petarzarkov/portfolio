import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from 'motion/react';
import { advanceSteam, buildCoffee } from './coffee-scene';
import classes from './CoffeeRig.module.css';

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
 */
export const CoffeeRig = () => {
  const reduced = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const build = async () => {
      const [THREE, { RectAreaLightUniformsLib }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/lights/RectAreaLightUniformsLib.js'),
      ]);
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
      renderer.toneMappingExposure = 1.6;
      renderer.setClearAlpha(0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);

      RectAreaLightUniformsLib.init();

      const coffee = buildCoffee(THREE);
      scene.add(coffee.group);

      const AIM = new THREE.Vector3(0, 1.55, 0);

      /**
       * Key left, fill right, top light above - each keeping to its own side
       * and breathing within it. A panel that orbits swings between the lens
       * and the subject; a RectAreaLight also emits from one face only, so it
       * cannot simply be parked behind the cup either.
       */
      const RIG = [
        {
          color: 0xffb01b,
          home: [-4.6, 3.4, -3.2],
          sway: [0.9, 0.7, 0.8],
          rate: 0.24,
        },
        {
          color: 0x6b5bd2,
          home: [4.6, 3.1, -3.2],
          sway: [0.9, 0.8, 0.8],
          rate: 0.19,
        },
        {
          color: 0xe2543c,
          home: [0, 6.2, -1.6],
          sway: [1.4, 0.5, 0.8],
          rate: 0.15,
        },
      ] as const;

      const lights = RIG.map(({ color, home }) => {
        const light = new THREE.RectAreaLight(color, 42, 2.6, 5);
        light.position.set(home[0], home[1], home[2]);
        light.lookAt(AIM);
        scene.add(light);
        return light;
      });

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
      const frame = () => {
        const { clientWidth: w, clientHeight: h } = node;
        if (w === 0 || h === 0) return;

        renderer.setSize(w, h, false);
        camera.aspect = w / h;

        const vFov = (camera.fov * Math.PI) / 180;
        const byHeight = coffee.height / 2 / Math.tan(vFov / 2);
        const byWidth = 4.8 / 2 / Math.tan(vFov / 2) / camera.aspect;
        // The camera sits well above the aim point, so its true distance to the
        // subject is longer than this; less padding is needed than at eye level.
        const distance = Math.max(byHeight, byWidth) * 1.02;

        // High enough to see over the rim. At a near-level angle the rim occludes
        // the foam entirely, which is the whole reason there is a cup and not
        // just a cylinder.
        camera.position.set(0, 6.1, -distance);
        camera.lookAt(AIM);
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
          light.lookAt(AIM);
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

      // No IntersectionObserver here: the backdrop covers the viewport for as
      // long as the route is mounted, so "on screen" and "mounted" are the same
      // question. Tab visibility is the one that still matters.
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
  }, [reduced]);

  return createPortal(
    <div className={classes.backdrop} aria-hidden>
      <div className={classes.stage} ref={host}>
        {failed && <div className={classes.fallback} />}
      </div>
      <div className={classes.scrim} />
    </div>,
    document.body,
  );
};
