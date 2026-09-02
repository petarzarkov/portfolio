import { describe, expect, test } from 'bun:test';
import { PHASES } from './ci';

/**
 * `scripts/ci.ts` is only the single source of truth for CI if the workflow
 * actually calls it. These tests fail when the two drift - a phase declared and
 * never run, or a job that reaches a gate directly and so stops matching what
 * `bun run ci` does locally.
 */
const workflow = await Bun.file(
  new URL('../.github/workflows/ci.yml', import.meta.url),
).text();

describe('ci.yml and scripts/ci.ts agree', () => {
  test('every declared phase is invoked by a job', () => {
    const missing = PHASES.filter(
      (phase) => !workflow.includes(`bun run ci ${phase.name}`),
    ).map((phase) => phase.name);

    expect(missing).toEqual([]);
  });

  test('every phase the workflow invokes is declared', () => {
    const invoked = [...workflow.matchAll(/bun run ci ([a-z]+)/g)].map(
      (match) => match[1],
    );
    const undeclared = invoked.filter(
      (name) => !PHASES.some((phase) => phase.name === name),
    );

    expect(undeclared).toEqual([]);
  });

  test('no job reaches a gate directly, bypassing the phase table', () => {
    // A `run:` line calling a gate script by name is the drift this catches:
    // it would pass CI while `bun run ci` locally ran something else.
    const gates = ['lint:check', 'format:check', 'typecheck', 'test:browser'];
    const direct = gates.filter((gate) =>
      workflow.includes(`run: bun run ${gate}`),
    );

    expect(direct).toEqual([]);
  });

  test('phase names are unique', () => {
    const names = PHASES.map((phase) => phase.name);
    expect(names).toEqual([...new Set(names)]);
  });
});
