/**
 * Serves `dist/` and drives it in a real browser through `Bun.WebView`.
 *
 * Ported from dunx's `internal/docs/scripts/preview.ts`, with its hard-won
 * details intact - see docs/06-testing.md. On Linux `Bun.WebView` drives an
 * installed Chrome over CDP and `ubuntu-latest` ships one, so CI downloads no
 * browser.
 */
export const ROUTES = [
  ['landing', '/'],
  ['projects', '/projects'],
  ['project-detail', '/projects/dunx'],
  ['skills', '/skills'],
  ['about', '/about'],
  ['not-found', '/nope'],
] as const;

export const VIEWPORTS = [
  ['mobile', 390, 844],
  ['tablet', 820, 1180],
  ['desktop', 1440, 900],
] as const;

export const SCHEMES = ['light', 'dark'] as const;
export type Scheme = (typeof SCHEMES)[number];

export interface ConsoleLine {
  type: string;
  text: string;
}

export interface Preview {
  /** Where the built site is being served, for asserting on raw HTML. */
  readonly origin: string;
  /** Navigate to a path and wait for it to have rendered a heading. */
  open(path: string): Promise<void>;
  scheme(scheme: Scheme): Promise<void>;
  view(width: number, height: number, ratio?: number): Promise<void>;
  heading(): Promise<string>;
  /** True when the document scrolls sideways at the current viewport. */
  overflows(): Promise<boolean>;
  /** Selectors present in the DOM, for asserting on structure. */
  count(selector: string): Promise<number>;
  background(): Promise<string>;
  screenshot(): Promise<Blob>;
  logged(): readonly ConsoleLine[];
  close(): Promise<void>;
}

const HEADING = `
  (() => {
    const h = document.querySelector('h1');
    return h ? h.textContent.trim() : '';
  })()`;

const OVERFLOWS = `
  document.documentElement.scrollWidth > document.documentElement.clientWidth + 1`;

/**
 * Entrance animations still running.
 *
 * Without waiting on this the screenshots caught the treemap mid-sweep - two of
 * nine cells painted - which makes the contact sheet useless as a visual record
 * and would make any assertion about visible content flaky.
 */
const ANIMATING = `
  document.getAnimations().filter((a) => a.playState === 'running').length`;

export const startPreview = async (dist: string): Promise<Preview> => {
  const server = Bun.serve({
    port: 0,
    async fetch(request) {
      const { pathname } = new URL(request.url);

      const exact = Bun.file(
        `${dist}${pathname === '/' ? '/index.html' : pathname}`,
      );
      if (await exact.exists()) return new Response(exact);

      // A directory index, the way Cloudflare Pages resolves `/projects/dunx`
      // to `projects/dunx/index.html`. Without this the suite could not see
      // that the SPA catch-all was shadowing every per-route shell.
      const index = Bun.file(`${dist}${pathname}/index.html`);
      if (await index.exists()) {
        return new Response(index, {
          headers: { 'Content-Type': 'text/html' },
        });
      }
      // The SPA fallback `public/_redirects` gives us on Cloudflare Pages. A
      // deep link must work on a cold load, which is the whole point of the
      // `project-detail` and `not-found` cases below.
      return new Response(Bun.file(`${dist}/index.html`), {
        headers: { 'Content-Type': 'text/html' },
      });
    },
  });

  const base = `http://localhost:${server.port}`;

  let logged: ConsoleLine[] = [];
  let applied = { scheme: '', width: 0, height: 0, ratio: 0 };

  // The supported console hook: a `(type, ...args)` callback on the
  // constructor. There is no `cdp.on` - `cdp()` is a plain request function,
  // not an emitter.
  // Constructed straight at the site, not at about:blank: the constructor's
  // `url` starts a navigation, and calling `navigate()` while that is pending
  // throws ERR_INVALID_STATE.
  const view = new Bun.WebView({
    url: `${base}/`,
    headless: true,
    console: (type: string, ...args: unknown[]) => {
      logged.push({ type, text: args.map((a) => String(a)).join(' ') });
    },
  });

  const settle = async (): Promise<void> => {
    // Poll rather than sleep: the heading is up as soon as React has painted,
    // and a fixed sleep is either flaky or slower than it needs to be.
    //
    // The try/catch is load bearing for the *first* call. CDP is not attached
    // until the constructor's navigation completes, and `evaluate` before that
    // rejects with "'Runtime.evaluate' wasn't found" rather than waiting.
    let last = 'never evaluated';
    for (let i = 0; i < 200; i++) {
      try {
        const heading = await view.evaluate<string>(HEADING);
        if (heading !== '') return;
        last = 'no <h1> in the document';
      } catch (error) {
        last = error instanceof Error ? error.message : String(error);
      }
      await Bun.sleep(50);
    }
    throw new Error(`page never settled within 10s: ${last}`);
  };

  /** Lets entrance animations finish, so a screenshot is of the final frame. */
  const rest = async (): Promise<void> => {
    for (let i = 0; i < 40; i++) {
      if ((await view.evaluate<number>(ANIMATING)) === 0) return;
      await Bun.sleep(50);
    }
    // Not fatal: a deliberately looping animation would never reach zero, and
    // that is a design choice rather than a test failure.
  };

  // `cdp()` needs a completed navigation before it accepts a command, and the
  // constructor's is still in flight here.
  await settle();

  return {
    origin: base,

    async open(path) {
      logged = [];
      await view.navigate(`${base}${path}`);
      await settle();
      await rest();
    },

    async scheme(scheme) {
      if (applied.scheme === scheme) return;
      applied.scheme = scheme;
      await view.cdp('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-color-scheme', value: scheme }],
      });
    },

    async view(width, height, ratio = 1) {
      if (
        applied.width === width &&
        applied.height === height &&
        applied.ratio === ratio
      ) {
        return;
      }
      applied = { ...applied, width, height, ratio };
      await view.cdp('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: ratio,
        mobile: width < 500,
      });
    },

    heading: () => view.evaluate<string>(HEADING),
    overflows: () => view.evaluate<boolean>(OVERFLOWS),
    count: (selector) =>
      view.evaluate<number>(
        `document.querySelectorAll(${JSON.stringify(selector)}).length`,
      ),
    background: () =>
      view.evaluate<string>('getComputedStyle(document.body).backgroundColor'),
    screenshot: () => view.screenshot(),
    logged: () => logged,

    async close() {
      // `view.close()` is synchronous; `server.stop()` is not, and awaiting it
      // means the port is released before the next suite binds one.
      view.close();
      await server.stop(true);
    },
  };
};
