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
  clientId: string;
  date: string;
  dateShort: string;
  dateIso: string;
  lifts: Lift[];
  status: 'draft' | 'published' | 'completed';
};

export type Client = {
  id: string;
  name: string;
  time?: string;
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

export function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayIso(): string {
  return isoDate(new Date());
}

export function programIdFor(clientId: string, dateIso: string): string {
  return `${dateIso}-${clientId}`;
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
  clientId: string,
  offsetDays: number,
  status: Program['status'],
  lifts: Lift[],
): Program {
  const date = dayOffset(offsetDays);
  const iso = isoDate(date);
  return {
    id: programIdFor(clientId, iso),
    clientId,
    date: formatDateLong(date),
    dateShort: formatDateShort(date),
    dateIso: iso,
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

export function seedClients(): Client[] {
  return [
    // Today's roster — these have programs (or "no program" rows)
    { id: 'nic', name: 'Nic', time: '6:00 am' },
    { id: 'sarah', name: 'Sarah', time: '6:00 am' },
    { id: 'marcus', name: 'Marcus', time: '6:45 am' },
    { id: 'jen', name: 'Jen', time: '6:45 am' },
    { id: 'david', name: 'David', time: '7:30 am' },
    { id: 'pat', name: 'Pat', time: '9:00 am' },

    // The rest of the client pool — not on today's roster
    { id: 'aaron', name: 'Aaron' },
    { id: 'amy', name: 'Amy' },
    { id: 'ben', name: 'Ben' },
    { id: 'beth', name: 'Beth' },
    { id: 'carla', name: 'Carla' },
    { id: 'chris', name: 'Chris' },
    { id: 'dana', name: 'Dana' },
    { id: 'derek', name: 'Derek' },
    { id: 'eric', name: 'Eric' },
    { id: 'evelyn', name: 'Evelyn' },
    { id: 'frank', name: 'Frank' },
    { id: 'grace', name: 'Grace' },
    { id: 'hannah', name: 'Hannah' },
    { id: 'ian', name: 'Ian' },
    { id: 'isabel', name: 'Isabel' },
    { id: 'kara', name: 'Kara' },
    { id: 'leo', name: 'Leo' },
    { id: 'liam', name: 'Liam' },
    { id: 'mia', name: 'Mia' },
    { id: 'nora', name: 'Nora' },
    { id: 'paul', name: 'Paul' },
    { id: 'rachel', name: 'Rachel' },
    { id: 'sam', name: 'Sam' },
    { id: 'tess', name: 'Tess' },
    { id: 'theo', name: 'Theo' },
    { id: 'wendy', name: 'Wendy' },
    { id: 'will', name: 'Will' },
    { id: 'zoe', name: 'Zoe' },
  ];
}

export function seedPrograms(): Program[] {
  const programs: Program[] = [];

  // Nic — full history, in-progress today
  programs.push(
    makeProgram('nic', -2, 'completed', [
      withAllCompleted(PRESS_5x7),
      withAllCompleted(SQUAT_5x10),
      withAllCompleted(DL_4x5, [{}, {}, { actualReps: 4 }, {}]),
      withAllCompleted(PULLDOWN_3x12),
      withAllCompleted(PLANK_5x20s),
    ]),
    makeProgram('nic', -1, 'completed', [
      withAllCompleted(PRESS_5x7, [{}, {}, {}, { actualReps: 6 }, { actualReps: 5 }]),
      withAllCompleted(SQUAT_5x10),
      withAllCompleted(DL_4x5),
    ]),
    makeProgram('nic', 0, 'published', [
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
    ]),
    makeProgram('nic', 1, 'published', [
      withClonedId(PRESS_5x7),
      withClonedId(SQUAT_5x10),
      withClonedId(DL_4x5),
      withClonedId(PULLDOWN_3x12),
    ]),
    makeProgram('nic', 2, 'draft', [withClonedId(PRESS_5x7), withClonedId(SQUAT_5x10)]),
  );

  // Sarah — published today
  programs.push(
    makeProgram('sarah', 0, 'published', [
      withClonedId(PRESS_5x7),
      withClonedId(SQUAT_5x10),
      withClonedId(PULLDOWN_3x12),
    ]),
  );

  // Marcus — draft today
  programs.push(
    makeProgram('marcus', 0, 'draft', [
      withClonedId(SQUAT_5x10),
      withClonedId(DL_4x5),
      withClonedId(PLANK_5x20s),
    ]),
  );

  // Jen — completed today (early bird)
  programs.push(
    makeProgram('jen', 0, 'completed', [
      withAllCompleted(PRESS_5x7),
      withAllCompleted(PULLDOWN_3x12),
    ]),
  );

  // David — draft today
  programs.push(
    makeProgram('david', 0, 'draft', [
      withClonedId(SQUAT_5x10),
      withClonedId(DL_4x5),
    ]),
  );

  // Pat — no program today (trainer adds during session)
  // Intentionally omitted from programs[]; surfaces as NO PROGRAM in roster

  return programs;
}
