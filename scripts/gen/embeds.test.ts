import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { probe, probeAll } from './embeds';

/**
 * Against a real server rather than a mocked `fetch`: the thing under test is
 * how the prober reacts to actual transport behaviour - a 405 on HEAD, a
 * connection that never answers, a host that does not resolve.
 */
let server: ReturnType<typeof Bun.serve>;
let base: string;

beforeAll(() => {
  server = Bun.serve({
    port: 0,
    async fetch(request) {
      const { pathname } = new URL(request.url);
      if (pathname === '/ok') return new Response('<html></html>');
      if (pathname === '/missing') return new Response('gone', { status: 404 });
      if (pathname === '/boom') return new Response('no', { status: 500 });
      if (pathname === '/private') return new Response('nope', { status: 403 });
      if (pathname === '/head-405') {
        return request.method === 'HEAD'
          ? new Response(null, { status: 405 })
          : new Response('<html></html>');
      }
      if (pathname === '/hang') {
        await Bun.sleep(30_000);
        return new Response('too late');
      }
      return new Response('?', { status: 404 });
    },
  });
  base = `http://localhost:${server.port}`;
});

afterAll(async () => {
  await server.stop(true);
});

describe('probe', () => {
  test('a page that answers is live', async () => {
    const result = await probe(`${base}/ok`);
    expect(result).toMatchObject({ status: 'live', code: 200 });
    expect(result.ms).toBeGreaterThanOrEqual(0);
    expect(Date.parse(result.checkedAt)).not.toBeNaN();
  });

  test('404 is offline, and records the code', async () => {
    // trivia-art.herokuapp.com's actual behaviour: it answers, with a 404.
    expect(await probe(`${base}/missing`)).toMatchObject({
      status: 'offline',
      code: 404,
    });
  });

  test('5xx is offline', async () => {
    expect(await probe(`${base}/boom`)).toMatchObject({
      status: 'offline',
      code: 500,
    });
  });

  test('403 is offline: something is there, but not an embeddable page', async () => {
    expect(await probe(`${base}/private`)).toMatchObject({
      status: 'offline',
      code: 403,
    });
  });

  test('uses GET, so a host that rejects HEAD is not read as offline', async () => {
    expect(await probe(`${base}/head-405`)).toMatchObject({
      status: 'live',
      code: 200,
    });
  });

  test('an unresolvable host is offline with code 0, not an exception', async () => {
    // wisdoms.petarzarkov.com's actual behaviour: DNS returns nothing, so curl
    // never reaches a connection. Code 0 distinguishes that from a real 404.
    const result = await probe(
      'https://this-host-does-not-exist.petarzarkov.invalid/',
    );
    expect(result).toMatchObject({ status: 'offline', code: 0 });
  }, 20_000);

  test('a connection refused is offline, not a throw', async () => {
    // Port 1 is reserved and nothing listens on it.
    expect(await probe('http://127.0.0.1:1/')).toMatchObject({
      status: 'offline',
      code: 0,
    });
  });
});

describe('probeAll', () => {
  test('deduplicates, so a URL shared by two projects is probed once', async () => {
    const results = await probeAll([
      `${base}/ok`,
      `${base}/ok`,
      `${base}/missing`,
    ]);
    expect(results.size).toBe(2);
    expect(results.get(`${base}/ok`)?.status).toBe('live');
    expect(results.get(`${base}/missing`)?.status).toBe('offline');
  });

  test('one dead URL does not stop the others being probed', async () => {
    const results = await probeAll([
      `${base}/ok`,
      'http://127.0.0.1:1/',
      `${base}/head-405`,
    ]);
    expect(
      [...results.values()].filter((r) => r.status === 'live'),
    ).toHaveLength(2);
  });

  test('an empty list is an empty map', async () => {
    expect((await probeAll([])).size).toBe(0);
  });
});
