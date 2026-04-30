export type SetEntry = {
  prescribedReps: number;
  actualReps?: number;
  prescribedWeight?: string;
  actualWeight?: string;
  unit?: 'reps' | 'sec';
  completed: boolean;
};

export type Lift = {
  id: string;
  name: string;
  defaultWeight?: string;
  sets: SetEntry[];
};

export type Program = {
  id: string;
  date: string;
  dateShort: string;
  lifts: Lift[];
  status: 'draft' | 'published' | 'completed';
};

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function programIdFromDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayProgramId(): string {
  return programIdFromDate(new Date());
}

export function formatDateLong(date: Date): string {
  return `${WEEKDAYS[date.getDay()]} — ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function formatDateShort(date: Date): string {
  return `${WEEKDAYS_SHORT[date.getDay()]} ${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
}

function dayOffset(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function makeProgram(
  offsetDays: number,
  status: Program['status'],
  lifts: Lift[],
): Program {
  const date = dayOffset(offsetDays);
  return {
    id: programIdFromDate(date),
    date: formatDateLong(date),
    dateShort: formatDateShort(date),
    status,
    lifts,
  };
}

const PRESS_5x7: Lift = {
  id: 'press',
  name: 'Press',
  defaultWeight: '35 lb',
  sets: [
    { prescribedReps: 7, completed: false },
    { prescribedReps: 7, completed: false },
    { prescribedReps: 7, completed: false },
    { prescribedReps: 7, completed: false },
    { prescribedReps: 7, completed: false },
  ],
};

const SQUAT_5x10: Lift = {
  id: 'squat-16',
  name: 'Squat 16"',
  defaultWeight: '+25 lb',
  sets: [
    { prescribedReps: 10, completed: false },
    { prescribedReps: 10, completed: false },
    { prescribedReps: 10, completed: false },
    { prescribedReps: 10, completed: false },
    { prescribedReps: 10, completed: false },
  ],
};

const DL_4x5: Lift = {
  id: 'dl',
  name: 'DL',
  defaultWeight: '85 lb',
  sets: [
    { prescribedReps: 5, completed: false },
    { prescribedReps: 5, completed: false },
    { prescribedReps: 5, completed: false },
    { prescribedReps: 5, completed: false },
  ],
};

const PULLDOWN_3x12: Lift = {
  id: 'pulldown',
  name: 'Pulldown',
  defaultWeight: '60 lb',
  sets: [
    { prescribedReps: 12, completed: false },
    { prescribedReps: 12, completed: false },
    { prescribedReps: 12, completed: false },
  ],
};

const PLANK_5x20s: Lift = {
  id: 'plank',
  name: 'Plank',
  defaultWeight: 'BW',
  sets: [
    { prescribedReps: 20, unit: 'sec', completed: false },
    { prescribedReps: 20, unit: 'sec', completed: false },
    { prescribedReps: 20, unit: 'sec', completed: false },
    { prescribedReps: 20, unit: 'sec', completed: false },
    { prescribedReps: 20, unit: 'sec', completed: false },
  ],
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function withAllCompleted(lift: Lift, overrides: Partial<SetEntry>[] = []): Lift {
  const cloned = clone(lift);
  cloned.id = `${lift.id}-${Math.random().toString(36).slice(2, 8)}`;
  cloned.sets = cloned.sets.map((set, idx) => ({
    ...set,
    completed: true,
    ...(overrides[idx] ?? {}),
  }));
  return cloned;
}

function withClonedId(lift: Lift): Lift {
  const cloned = clone(lift);
  cloned.id = `${lift.id}-${Math.random().toString(36).slice(2, 8)}`;
  return cloned;
}

export function seedPrograms(): Program[] {
  return [
    // Two days ago — completed session, fully logged with one strikethrough
    makeProgram(-2, 'completed', [
      withAllCompleted(PRESS_5x7),
      withAllCompleted(SQUAT_5x10),
      withAllCompleted(DL_4x5, [{}, {}, { actualReps: 4 }, {}]),
      withAllCompleted(PULLDOWN_3x12),
      withAllCompleted(PLANK_5x20s),
    ]),
    // Yesterday — completed session
    makeProgram(-1, 'completed', [
      withAllCompleted(PRESS_5x7, [{}, {}, {}, { actualReps: 6 }, { actualReps: 5 }]),
      withAllCompleted(SQUAT_5x10),
      withAllCompleted(DL_4x5),
    ]),
    // Today — published, in progress
    {
      id: todayProgramId(),
      date: formatDateLong(new Date()),
      dateShort: formatDateShort(new Date()),
      status: 'published',
      lifts: [
        {
          ...clone(PRESS_5x7),
          sets: [
            { prescribedReps: 7, completed: true },
            { prescribedReps: 7, completed: true },
            { prescribedReps: 7, completed: false },
            { prescribedReps: 7, completed: false },
            { prescribedReps: 7, completed: false },
          ],
        },
        {
          ...clone(SQUAT_5x10),
          sets: [
            { prescribedReps: 10, completed: true },
            { prescribedReps: 10, completed: true },
            { prescribedReps: 10, completed: false },
            { prescribedReps: 10, completed: false },
            { prescribedReps: 10, completed: false },
          ],
        },
        {
          ...clone(DL_4x5),
          sets: [
            { prescribedReps: 5, completed: true },
            { prescribedReps: 5, completed: false },
            { prescribedReps: 5, actualReps: 4, completed: false },
            { prescribedReps: 5, completed: false },
          ],
        },
        clone(PULLDOWN_3x12),
        clone(PLANK_5x20s),
      ],
    },
    // Tomorrow — published, untouched
    makeProgram(1, 'published', [
      withClonedId(PRESS_5x7),
      withClonedId(SQUAT_5x10),
      withClonedId(DL_4x5),
      withClonedId(PULLDOWN_3x12),
    ]),
    // Day after tomorrow — draft (trainer hasn't published yet)
    makeProgram(2, 'draft', [
      withClonedId(PRESS_5x7),
      withClonedId(SQUAT_5x10),
    ]),
  ];
}
