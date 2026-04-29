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
  date: string;
  dateShort: string;
  lifts: Lift[];
  status: 'draft' | 'published' | 'completed';
};

export const todayProgram: Program = {
  date: 'Wednesday — April 27',
  dateShort: 'Wed Apr 27',
  status: 'published',
  lifts: [
    {
      id: 'press',
      name: 'Press',
      defaultWeight: '35 lb',
      sets: [
        { prescribedReps: 7, completed: true },
        { prescribedReps: 7, completed: true },
        { prescribedReps: 7, completed: false },
        { prescribedReps: 7, completed: false },
        { prescribedReps: 7, completed: false },
      ],
    },
    {
      id: 'squat-16',
      name: 'Squat 16"',
      defaultWeight: '+25 lb',
      sets: [
        { prescribedReps: 10, completed: true },
        { prescribedReps: 10, completed: true },
        { prescribedReps: 10, completed: false },
        { prescribedReps: 10, completed: false },
        { prescribedReps: 10, completed: false },
      ],
    },
    {
      id: 'dl',
      name: 'DL',
      defaultWeight: '85 lb',
      sets: [
        { prescribedReps: 5, completed: true },
        { prescribedReps: 5, completed: false },
        { prescribedReps: 5, actualReps: 4, completed: false },
        { prescribedReps: 5, completed: false },
      ],
    },
    {
      id: 'pulldown',
      name: 'Pulldown',
      defaultWeight: '60 lb',
      sets: [
        { prescribedReps: 12, completed: false },
        { prescribedReps: 12, completed: false },
        { prescribedReps: 12, completed: false },
      ],
    },
    {
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
    },
  ],
};
