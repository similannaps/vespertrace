
export type Cell = {
  col: number;
  row: number;
};

export type LevelData = {
  id: number;
  name: string;
  subtitle: string;
  story: string;
  start: Cell;
  switch: Cell;
  door: Cell;
  exit: Cell;
  walls: Cell[];
};

function cells(
  positions: Array<[number, number]>,
): Cell[] {
  return positions.map(([col, row]) => ({ col, row }));
}

export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: "THE FIRST ECHO",
    subtitle: "FIRST TRACE",
    story:
      "Every step leaves a memory. Use your past to open the way.",
    start: { col: 1, row: 1 },
    switch: { col: 5, row: 4 },
    door: { col: 10, row: 4 },
    exit: { col: 13, row: 7 },
    walls: [
      ...cells([
        [3, 3], [4, 3], [5, 3], [7, 3], [8, 3], [9, 3], [10, 3],
        [8, 2], [8, 4], [8, 6], [8, 7],
        [4, 6], [5, 6], [6, 6], [7, 6], [9, 6], [11, 6],
      ]),
    ],
  },
  {
    id: 2,
    name: "THE FORGOTTEN HALL",
    subtitle: "A MEMORY IN THE DARK",
    story:
      "The old hall remembers every move. Find a safe route through it.",
    start: { col: 1, row: 7 },
    switch: { col: 4, row: 2 },
    door: { col: 10, row: 2 },
    exit: { col: 13, row: 1 },
    walls: [
      ...cells([
        [2, 2], [3, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2],
        [4, 3], [4, 4], [4, 5], [4, 6],
        [6, 4], [7, 4], [8, 4], [10, 4], [11, 4],
        [6, 6], [7, 6], [8, 6], [9, 6], [10, 6],
      ]),
    ],
  },
  {
    id: 3,
    name: "ECHOES OF THE PAST",
    subtitle: "THE LAST MEMORY",
    story:
      "Your past is both the obstacle and the key. Make every step count.",
    start: { col: 1, row: 1 },
    switch: { col: 6, row: 5 },
    door: { col: 10, row: 5 },
    exit: { col: 13, row: 7 },
    walls: [
      ...cells([
        [3, 1], [3, 2], [3, 3], [3, 4], [3, 6], [3, 7],
        [5, 2], [6, 2], [7, 2], [8, 2], [9, 2],
        [5, 4], [5, 6], [7, 6], [8, 6], [9, 6],
        [11, 3], [11, 4], [11, 6],
      ]),
    ],
  },
];

export const MAX_LEVEL_ID = LEVELS[LEVELS.length - 1]!.id;

const PROGRESS_KEY = "afterimage-unlocked-level";

export function getUnlockedLevel(): number {
  try {
    const saved = Number(localStorage.getItem(PROGRESS_KEY) ?? "1");

    if (!Number.isFinite(saved)) return 1;

    return Math.min(
      MAX_LEVEL_ID,
      Math.max(1, Math.floor(saved)),
    );
  } catch {
    return 1;
  }
}

export function unlockLevel(levelId: number): void {
  const current = getUnlockedLevel();
  const next = Math.min(MAX_LEVEL_ID, Math.max(current, levelId));

  try {
    localStorage.setItem(PROGRESS_KEY, String(next));
  } catch {
    // The game can still run when browser storage is unavailable.
  }
}
