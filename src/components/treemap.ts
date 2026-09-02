/**
 * Squarified treemap layout (Bruls, Huizing & van Wijk, 2000).
 *
 * Area encodes volume, which is the whole point here: TypeScript's dominance
 * has to be visible at a glance, and a bar chart flattens the difference
 * between a 53% language and a 2% one into two bars of similar height.
 *
 * Squarified rather than slice-and-dice because the latter produces slivers -
 * a 1%-of-total cell becomes a 4px-wide strip that cannot hold a label or be
 * clicked.
 *
 * Pure, so `treemap.test.ts` can check the invariants that matter: every cell
 * placed, none overlapping, areas proportional.
 */

export interface TreemapItem {
  readonly name: string;
  readonly value: number;
}

export interface TreemapCell {
  readonly name: string;
  readonly value: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

interface Free {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Worst aspect ratio in a row, given the row's total and the side it sits on. */
const worst = (row: number[], total: number, side: number): number => {
  if (row.length === 0 || total === 0 || side === 0) return Infinity;
  const max = Math.max(...row);
  const min = Math.min(...row);
  const s2 = side * side;
  const t2 = total * total;
  return Math.max((s2 * max) / t2, t2 / (s2 * min));
};

/** Lays a finished row along the short side and shrinks the free rectangle. */
const place = (
  row: { name: string; value: number; area: number }[],
  free: Free,
  cells: TreemapCell[],
): void => {
  const total = row.reduce((sum, item) => sum + item.area, 0);
  if (total === 0) return;

  const horizontal = free.width >= free.height;
  const thickness = horizontal ? total / free.height : total / free.width;

  let offset = horizontal ? free.y : free.x;
  for (const item of row) {
    const length = item.area / thickness;
    cells.push({
      name: item.name,
      value: item.value,
      x: horizontal ? free.x : offset,
      y: horizontal ? offset : free.y,
      width: horizontal ? thickness : length,
      height: horizontal ? length : thickness,
    });
    offset += length;
  }

  if (horizontal) {
    free.x += thickness;
    free.width -= thickness;
  } else {
    free.y += thickness;
    free.height -= thickness;
  }
};

export const squarify = (
  items: readonly TreemapItem[],
  width: number,
  height: number,
): TreemapCell[] => {
  const usable = items.filter((item) => item.value > 0);
  if (usable.length === 0 || width <= 0 || height <= 0) return [];

  const total = usable.reduce((sum, item) => sum + item.value, 0);
  const scale = (width * height) / total;
  const sorted = [...usable].sort((a, b) => b.value - a.value);

  const cells: TreemapCell[] = [];
  const free: Free = { x: 0, y: 0, width, height };
  let row: { name: string; value: number; area: number }[] = [];

  for (const item of sorted) {
    const area = item.value * scale;
    const side = Math.min(free.width, free.height);
    const areas = row.map((r) => r.area);
    const rowTotal = areas.reduce((sum, a) => sum + a, 0);

    // Adding this item to the current row either improves the worst aspect
    // ratio or it does not; if it does not, close the row and start a new one.
    if (
      row.length > 0 &&
      worst(areas, rowTotal, side) <
        worst([...areas, area], rowTotal + area, side)
    ) {
      place(row, free, cells);
      row = [];
    }

    row.push({ name: item.name, value: item.value, area });
  }

  place(row, free, cells);
  return cells;
};
