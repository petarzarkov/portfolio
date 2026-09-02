import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import classes from './LightRig.module.css';

/**
 * Three area lights turning around a torus knot on a rough floor.
 *
 * After three.js's `webgl_lights_rectarealight` example, retuned to the site's
 * palette and with everything a decorative canvas on someone else's page needs
 * and a standalone demo does not:
 *
 *   - three is imported dynamically, so it is nowhere near the entry chunk.
 *   - It renders only while on screen and only while the tab is visible.
 *     `IntersectionObserver` plus `visibilitychange`, because a scene rendering
 *     behind a hidden tab is pure battery.
 *   - `prefers-reduced-motion` gets one static frame rather than no scene.
 *   - No OrbitControls: drag on a decorative element is a scroll trap on a
 *     touch device.
 *   - Everything is disposed on unmount. A WebGL context leaked per route
 *     change hits the browser's context limit within a few navigations.
 */
export const LightRig = () => {
  const reduced = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    /**
     * three is ~180 KB gzipped and RectAreaLightUniformsLib another ~100 KB -
     * the LTC lookup tables are float arrays, and they are most of it. That is
     * a lot for decoration, so none of it is fetched until the rig is actually
     * near the viewport. Landing on /about and reading the text costs nothing.
     */
    const build = async () => {
      const [THREE, { RectAreaLightUniformsLib }, { RectAreaLightHelper }] =
        await Promise.all([
          import('three'),
          import('three/examples/jsm/lights/RectAreaLightUniformsLib.js'),
          import('three/examples/jsm/helpers/RectAreaLightHelper.js'),
        ]);

      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      } catch {
        // No WebGL: software rendering, a blocked context, an old device.
        setFailed(true);
        return;
      }

      const scene = new THREE.Scene();
      // Far enough back that an orbiting panel never passes close to the lens.
      // At z=-15 with a radius of 7.5 the nearest light was 7.5 units out and
      // filled the frame with a slab every few seconds.
      const camera = new THREE.PerspectiveCamera(38, 16 / 10, 1, 1000);
      camera.position.set(0, 7.8, -22);
      // Aimed to one side of the subject, pushing it into the right third of
      // the frame, clear of the copy column. Positive x, because the camera
      // looks down +Z and that mirrors world x on screen - aiming negative
      // moved the knot the other way, straight under the text.
      camera.lookAt(5.5, 5.4, 0);

      // Required before any RectAreaLight is lit; without it they render black.
      RectAreaLightUniformsLib.init();

      /**
       * The example's red/green/blue, retuned: two warms from the brand ramp
       * and one cool, so the rig reads as this site rather than as the demo.
       *
       * Placed on the camera's side of the knot and aimed at it, unlike the
       * example, which parks all three behind it. A RectAreaLight emits from
       * one face only, so behind the subject means the camera sees nothing but
       * a silhouette - which is exactly what the first attempt rendered.
       */
      const KNOT = new THREE.Vector3(0, 5.5, 0);

      /**
       * A three-point rig: key left, fill right, top light above.
       *
       * Each panel keeps to its own side and breathes within it, rather than
       * orbiting. A full orbit reads well for a second and then swings a panel
       * between the lens and the subject, covering the thing it is lighting -
       * and the panel cannot simply be moved behind the knot either, because a
       * RectAreaLight emits from one face, so behind means the camera sees a
       * silhouette.
       */
      const RIG = [
        {
          color: 0xffb01b,
          home: [-7.5, 6.5, -4.5],
          sway: [1.6, 1.1, 1.4],
          rate: 0.24,
        },
        {
          color: 0x6b5bd2,
          home: [7.5, 6.2, -4.5],
          sway: [1.6, 1.2, 1.4],
          rate: 0.19,
        },
        {
          color: 0xe2543c,
          home: [0, 11, -3.5],
          sway: [2.2, 0.9, 1.2],
          rate: 0.15,
        },
      ] as const;

      const lights = RIG.map(({ color, home }) => {
        const light = new THREE.RectAreaLight(color, 24, 3.6, 8);
        light.position.set(home[0], home[1], home[2]);
        light.lookAt(KNOT);
        scene.add(light);
        scene.add(new RectAreaLightHelper(light));
        return light;
      });

      const floor = new THREE.Mesh(
        new THREE.BoxGeometry(2000, 0.1, 2000),
        new THREE.MeshStandardMaterial({ color: 0x3c3c42, roughness: 0.45 }),
      );
      scene.add(floor);

      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.18,
          metalness: 0,
        }),
      );
      knot.position.set(0, 5.5, 0);
      scene.add(knot);

      // Capped harder than the boxed version was: this now covers the whole
      // viewport, and it sits behind a scrim, so the extra pixels buy nothing.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.domElement.className = classes.canvas ?? '';
      node.prepend(renderer.domElement);

      const resize = () => {
        const { clientWidth, clientHeight } = node;
        if (clientWidth === 0 || clientHeight === 0) return;
        renderer.setSize(clientWidth, clientHeight, false);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      resize();

      const observer = new ResizeObserver(resize);
      observer.observe(node);

      const clock = new THREE.Clock();
      let running = false;

      const frame = () => {
        const delta = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.elapsedTime;

        // Each panel drifts around its own position on three slightly
        // different periods, so the rig never repeats a pose exactly. `lookAt`
        // every frame keeps them aimed while they move - rotating them instead
        // turns them off the subject and the knot goes dark.
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
          light.lookAt(KNOT);
        });

        knot.rotation.y += delta * 0.25;
        knot.rotation.x += delta * 0.08;
        renderer.render(scene, camera);
      };

      const start = () => {
        if (running || reduced === true) return;
        running = true;
        clock.start();
        renderer.setAnimationLoop(frame);
      };

      const stop = () => {
        running = false;
        renderer.setAnimationLoop(null);
      };

      const visible = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting === true) start();
          else stop();
        },
        { threshold: 0.1 },
      );
      visible.observe(node);

      const onVisibility = () => {
        if (document.hidden) stop();
        else if (node.checkVisibility?.() !== false) start();
      };
      document.addEventListener('visibilitychange', onVisibility);

      cleanup = () => {
        stop();
        observer.disconnect();
        visible.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);

        // Geometries, materials and the context all have to go explicitly:
        // WebGL contexts are a limited per-browser resource, and React strict
        // mode alone mounts this twice.
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const material = object.material as { dispose?: () => void };
            material.dispose?.();
          }
        });
        renderer.domElement.remove();
        renderer.dispose();
        renderer.forceContextLoss();
      };
    };

    // `rootMargin` so the fetch starts just before the rig is on screen, rather
    // than after it already is and the reader is looking at an empty box.
    const loader = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting !== true) return;
        loader.disconnect();
        void build();
      },
      { rootMargin: '250px' },
    );
    loader.observe(node);

    return () => {
      disposed = true;
      loader.disconnect();
      cleanup?.();
    };
  }, [reduced]);

  return (
    <div className={classes.stage} ref={host} aria-hidden>
      {failed && <div className={classes.fallback} />}
      <div className={classes.scrim} />
    </div>
  );
};
