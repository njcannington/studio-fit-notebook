// Canonical lift list for the Add Lift picker.
// Trainer's actual vocabulary lands when we onboard him; this is a
// reasonable starting set that overlaps with the seed program.

export type LiftTemplate = {
  name: string;
  defaultWeight: string;
  defaultReps: number;
  defaultSetCount: number;
  unit?: 'reps' | 'sec';
};

export const LIFT_LIBRARY: LiftTemplate[] = [
  // Compound lower
  { name: 'Back Squat', defaultWeight: '95 lb', defaultReps: 5, defaultSetCount: 3 },
  { name: 'Front Squat', defaultWeight: '75 lb', defaultReps: 5, defaultSetCount: 3 },
  { name: 'Squat 16"', defaultWeight: '+25 lb', defaultReps: 10, defaultSetCount: 3 },
  { name: 'DL', defaultWeight: '85 lb', defaultReps: 5, defaultSetCount: 3 },
  { name: 'RDL', defaultWeight: '75 lb', defaultReps: 8, defaultSetCount: 3 },
  { name: 'Goblet Squat', defaultWeight: '30 lb', defaultReps: 10, defaultSetCount: 3 },

  // Compound upper
  { name: 'Bench Press', defaultWeight: '95 lb', defaultReps: 5, defaultSetCount: 3 },
  { name: 'Press', defaultWeight: '35 lb', defaultReps: 7, defaultSetCount: 3 },
  { name: 'Incline DB Press', defaultWeight: '25 lb', defaultReps: 10, defaultSetCount: 3 },
  { name: 'Pull-up', defaultWeight: 'BW', defaultReps: 5, defaultSetCount: 3 },
  { name: 'Pulldown', defaultWeight: '60 lb', defaultReps: 12, defaultSetCount: 3 },
  { name: 'DB Row', defaultWeight: '30 lb', defaultReps: 10, defaultSetCount: 3 },
  { name: 'Cable Row', defaultWeight: '70 lb', defaultReps: 12, defaultSetCount: 3 },
  { name: 'Lateral Raise', defaultWeight: '10 lb', defaultReps: 12, defaultSetCount: 3 },
  { name: 'Curl', defaultWeight: '15 lb', defaultReps: 10, defaultSetCount: 3 },
  { name: 'Tricep Pushdown', defaultWeight: '40 lb', defaultReps: 12, defaultSetCount: 3 },

  // Core / accessory
  { name: 'Plank', defaultWeight: 'BW', defaultReps: 30, defaultSetCount: 3, unit: 'sec' },
  { name: 'Side Plank', defaultWeight: 'BW', defaultReps: 20, defaultSetCount: 2, unit: 'sec' },
  { name: 'Hanging Leg Raise', defaultWeight: 'BW', defaultReps: 8, defaultSetCount: 3 },
  { name: 'Dead Bug', defaultWeight: 'BW', defaultReps: 10, defaultSetCount: 3 },
];
