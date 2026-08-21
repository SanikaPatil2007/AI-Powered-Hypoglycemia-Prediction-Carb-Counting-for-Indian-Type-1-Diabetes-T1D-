/**
 * Demo Glucose Dataset & Context Definitions
 * Optimized for T1D Care Assistant Hackathon Prototype
 */

export const GLUCOSE_CONTEXT_OPTIONS = [
  'Before Meal',
  'After Meal',
  'Before Exercise',
  'After Exercise',
  'Bedtime',
  'Other'
];

// Helper to generate ISO timestamp relative to current date
function getRelativeTime(hoursAgo = 0, minutesAgo = 0) {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
}

export const INITIAL_DEMO_READINGS = [
  {
    id: 'g-01',
    value: 118,
    unit: 'mg/dL',
    timestamp: getRelativeTime(0, 30),
    context: 'After Meal',
    status: 'In Range',
    note: 'Post-lunch check (2 Roti + Dal Tadka)'
  },
  {
    id: 'g-02',
    value: 104,
    unit: 'mg/dL',
    timestamp: getRelativeTime(2, 15),
    context: 'Before Meal',
    status: 'In Range',
    note: 'Pre-lunch baseline'
  },
  {
    id: 'g-03',
    value: 148,
    unit: 'mg/dL',
    timestamp: getRelativeTime(4, 45),
    context: 'After Meal',
    status: 'In Range',
    note: 'Post-breakfast (Idli & Sambar)'
  },
  {
    id: 'g-04',
    value: 92,
    unit: 'mg/dL',
    timestamp: getRelativeTime(7, 0),
    context: 'Before Meal',
    status: 'In Range',
    note: 'Fasting morning baseline'
  },
  {
    id: 'g-05',
    value: 112,
    unit: 'mg/dL',
    timestamp: getRelativeTime(9, 30),
    context: 'Before Exercise',
    status: 'In Range',
    note: 'Morning walk prep'
  },
  {
    id: 'g-06',
    value: 126,
    unit: 'mg/dL',
    timestamp: getRelativeTime(14, 0),
    context: 'Bedtime',
    status: 'In Range',
    note: 'Pre-sleep check'
  },
  {
    id: 'g-07',
    value: 195,
    unit: 'mg/dL',
    timestamp: getRelativeTime(17, 30),
    context: 'After Meal',
    status: 'Elevated',
    note: 'Post-dinner (Pav Bhaji)'
  },
  {
    id: 'g-08',
    value: 115,
    unit: 'mg/dL',
    timestamp: getRelativeTime(19, 0),
    context: 'Before Meal',
    status: 'In Range',
    note: 'Pre-dinner baseline'
  }
];
