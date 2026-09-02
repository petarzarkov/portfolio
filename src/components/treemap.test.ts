import { describe, expect, test } from 'bun:test';
import { squarify, type TreemapItem } from './treemap';

const overlaps = (
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean => {
  const e = 1e-6;
  return (
    a.x < b.x + b.width - e &&
    b.x < a.x + a.width - e &&
    a.y < b.y + b.height - e &&
    b.y < a.y + a.height - e
  );
};

const LANGS: TreemapItem[] = [
  { name: 'TypeScript', value: 61.02 },
  { name: 'Python', value: 17.67 },
  { name: 'Gherkin', value: 9.61 },
  { name: 'JavaScript', value: 8.1 },
  { name: 'C#', value: 7.26 },
  { name: 'PLpgSQL', value: 4.02 },
  { name: 'HTML', value: 2.72 },
  { name: 'HCL', value: 1.73 },
  { name: 'Other', value: 2.42 },
];

describe('squarify', () => {
  test('places every item exactly once', () => {
    const cells = squarify(LANGS, 800, 400);
    expect(cells).toHaveLength(LANGS.length);
    expect(new Set(cells.map((c) => c.name)).size).toBe(LANGS.length);
  });

  test('areas are proportional to values', () => {
    const cells = squarify(LANGS, 800, 400);
    const total = LANGS.reduce((sum, l) => sum + l.value, 0);

    for (const cell of cells) {
      const expected = (cell.value / total) * 800 * 400;
      expect(cell.width * cell.height).toBeCloseTo(expected, 2);
    }
  });

  test('fills the box: areas sum to width x height', () => {
    const cells = squarify(LANGS, 800, 400);
    const area = cells.reduce((sum, c) => sum + c.width * c.height, 0);
    expect(area).toBeCloseTo(800 * 400, 1);
  });

  test('no two cells overlap', () => {
    const cells = squarify(LANGS, 800, 400);
    for (let i = 0; i < cells.length; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        const a = cells[i];
        const b = cells[j];
        if (!a || !b) continue;
        expect(overlaps(a, b)).toBe(false);
      }
    }
  });

  test('every cell stays inside the box', () => {
    for (const cell of squarify(LANGS, 800, 400)) {
      expect(cell.x).toBeGreaterThanOrEqual(-1e-6);
      expect(cell.y).toBeGreaterThanOrEqual(-1e-6);
      expect(cell.x + cell.width).toBeLessThanOrEqual(800 + 1e-6);
      expect(cell.y + cell.height).toBeLessThanOrEqual(400 + 1e-6);
    }
  });

  test('avoids slivers: the smallest cell keeps a usable aspect ratio', () => {
    // The reason for squarifying rather than slice-and-dice. A 1.7%-of-total
    // language must not become a strip too thin to label or click.
    const cells = squarify(LANGS, 800, 400);
    const smallest = cells.reduce((a, b) => (a.value < b.value ? a : b));
    const ratio =
      Math.max(smallest.width, smallest.height) /
      Math.min(smallest.width, smallest.height);
    expect(ratio).toBeLessThan(8);
  });

  test('a single item fills the whole box', () => {
    const cells = squarify([{ name: 'only', value: 5 }], 100, 50);
    expect(cells).toHaveLength(1);
    expect(cells[0]).toMatchObject({ x: 0, y: 0, width: 100, height: 50 });
  });

  test('zero and negative values are dropped, not laid out', () => {
    const cells = squarify(
      [
        { name: 'a', value: 10 },
        { name: 'zero', value: 0 },
        { name: 'neg', value: -5 },
      ],
      100,
      100,
    );
    expect(cells.map((c) => c.name)).toEqual(['a']);
  });

  test('an empty list, or a zero-sized box, is no cells rather than a throw', () => {
    expect(squarify([], 100, 100)).toEqual([]);
    expect(squarify(LANGS, 0, 100)).toEqual([]);
    expect(squarify(LANGS, 100, 0)).toEqual([]);
  });
});
