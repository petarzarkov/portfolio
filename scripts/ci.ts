/**
 * Every gate CI runs, in one command.
 *
 * `.github/workflows/ci.yml` calls this one phase per job (`bun run ci static`)
 * rather than restating the commands, so `bun run ci` locally runs exactly what
 * CI runs. When a gate changes it changes here, in one place, and the workflow
 * does not silently stop checking something.
 *
 * `bun run ci` runs every phase. `bun run ci <phase> [<phase>...]` runs only
 * those. `bun run ci --list` names them.
 *
 * Each step's output is captured and printed only when that step fails, so a
 * green run is one line per step instead of a full build log.
 */

interface Step {
  readonly name: string;
  readonly run: readonly string[];
}

interface Phase {
  readonly name: string;
  readonly summary: string;
  /** Steps run at the same time when true, in order when false. */
  readonly concurrent: boolean;
  readonly steps: readonly Step[];
}

const root = new URL('..', import.meta.url).pathname;

export const PHASES: readonly Phase[] = Object.freeze([
  {
    name: 'static',
    summary: 'Lint, format and types',
    // Concurrent: the three read the same files and write none of them.
    concurrent: true,
    steps: [
      { name: 'lint', run: ['bun', 'run', 'lint:check'] },
      { name: 'format', run: ['bun', 'run', 'format:check'] },
      { name: 'types', run: ['bun', 'run', 'typecheck'] },
    ],
  },
  {
    name: 'unit',
    summary: 'Generators and components',
    concurrent: false,
    steps: [{ name: 'test', run: ['bun', 'run', 'test'] }],
  },
  {
    name: 'build',
    summary: 'The production bundle',
    concurrent: false,
    steps: [{ name: 'build', run: ['bun', 'run', 'build'] }],
  },
  {
    name: 'browser',
    summary: 'The built site in a real browser',
    // Needs dist/. `bun run ci` runs `build` first because the phase list is
    // ordered; the workflow's browser job runs `ci build` before `ci browser`.
    concurrent: false,
    steps: [{ name: 'browser', run: ['bun', 'run', 'test:browser'] }],
  },
]);

interface Result {
  readonly phase: string;
  readonly step: string;
  readonly ok: boolean;
  readonly ms: number;
}

const runStep = async (phase: Phase, step: Step): Promise<Result> => {
  const started = Bun.nanoseconds();
  const proc = Bun.spawn([...step.run], {
    cwd: root,
    stdout: 'pipe',
    stderr: 'pipe',
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  const [stdout, stderr, code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  const ms = Math.round((Bun.nanoseconds() - started) / 1e6);
  const ok = code === 0;

  if (ok) {
    console.log(`  ok   ${phase.name}/${step.name} (${ms}ms)`);
  } else {
    console.log(`  FAIL ${phase.name}/${step.name} (${ms}ms)`);
    // Only on failure: a green run should not bury itself in build output.
    const output = `${stdout}${stderr}`.trimEnd();
    if (output !== '') console.log(`${output}\n`);
  }

  return { phase: phase.name, step: step.name, ok, ms };
};

const runPhase = async (phase: Phase): Promise<Result[]> => {
  console.log(`\n${phase.name}: ${phase.summary}`);
  if (phase.concurrent) {
    return Promise.all(phase.steps.map((step) => runStep(phase, step)));
  }

  const results: Result[] = [];
  for (const step of phase.steps) {
    const result = await runStep(phase, step);
    results.push(result);
    // Sequential phases are sequential because a later step needs the earlier
    // one to have produced something. Carrying on would report a second,
    // misleading failure.
    if (!result.ok) break;
  }
  return results;
};

const usage = (): void => {
  console.log('Usage: bun run ci [phase...]\n\nPhases:');
  for (const phase of PHASES) {
    console.log(`  ${phase.name.padEnd(9)} ${phase.summary}`);
  }
};

const report = (results: Result[], started: number): number => {
  const failed = results.filter((result) => !result.ok);
  const ms = Math.round((Bun.nanoseconds() - started) / 1e6);
  console.log(
    `\n${results.length - failed.length}/${results.length} steps passed in ${ms}ms`,
  );
  for (const result of failed) {
    console.log(`  FAILED ${result.phase}/${result.step}`);
  }
  return failed.length === 0 ? 0 : 1;
};

/**
 * Guarded: `scripts/ci.test.ts` imports `PHASES` from this module to check it
 * against the workflow. Without this, that import ran the whole of CI - which
 * spawned `bun run ci` again, and hung.
 */
if (import.meta.main) {
  const argv = process.argv.slice(2);

  if (argv.includes('--list') || argv.includes('-l')) {
    usage();
    process.exit(0);
  }

  const unknown = argv.filter(
    (name) => !PHASES.some((phase) => phase.name === name),
  );
  if (unknown.length > 0) {
    console.error(`Unknown phase: ${unknown.join(', ')}\n`);
    usage();
    process.exit(2);
  }

  const started = Bun.nanoseconds();
  const selected =
    argv.length > 0
      ? PHASES.filter((phase) => argv.includes(phase.name))
      : PHASES;

  const results: Result[] = [];
  for (const phase of selected) {
    results.push(...(await runPhase(phase)));
  }

  process.exit(report(results, started));
}
