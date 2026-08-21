/**
 * Demo Insulin Dataset & Definitions
 * Optimized for T1D Care Assistant Hackathon Prototype
 */

export const INSULIN_TYPES = [
  'Rapid-acting',
  'Long-acting',
  'Other'
];

export const INSULIN_CONTEXTS = [
  'Before Meal',
  'After Meal',
  'Bedtime',
  'Correction',
  'Other'
];

// Helper to generate ISO timestamp relative to current date
function getRelativeTime(hoursAgo = 0, minutesAgo = 0) {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
}

export const INITIAL_DEMO_INSULIN_RECORDS = [
  {
    id: 'ins-01',
    type: 'Rapid-acting',
    units: 4,
    timestamp: getRelativeTime(1, 15),
    context: 'Before Meal',
    note: 'Pre-lunch bolus (2 Roti + Dal Tadka)'
  },
  {
    id: 'ins-02',
    type: 'Rapid-acting',
    units: 3,
    timestamp: getRelativeTime(4, 30),
    context: 'Before Meal',
    note: 'Pre-breakfast bolus (Idli & Sambar)'
  },
  {
    id: 'ins-03',
    type: 'Long-acting',
    units: 14,
    timestamp: getRelativeTime(14, 0),
    context: 'Bedtime',
    note: 'Nightly basal dose (Lantus / Glargine)'
  },
  {
    id: 'ins-04',
    type: 'Rapid-acting',
    units: 5,
    timestamp: getRelativeTime(18, 0),
    context: 'Before Meal',
    note: 'Dinner bolus (Pav Bhaji)'
  },
  {
    id: 'ins-05',
    type: 'Rapid-acting',
    units: 1,
    timestamp: getRelativeTime(22, 30),
    context: 'Correction',
    note: 'Afternoon mild correction bolus'
  },
  {
    id: 'ins-06',
    type: 'Long-acting',
    units: 14,
    timestamp: getRelativeTime(38, 0),
    context: 'Bedtime',
    note: 'Previous night basal dose'
  }
];
