/**
 * Unified Demo Health History Dataset
 * Aggregates realistic demo entries for Glucose, Indian Meals, Insulin, and AI Risk Predictions.
 * Spanning Today, Last 7 Days, and Last 30 Days.
 */

// Helper to generate ISO timestamps relative to current time
function getRelativeTime(hoursAgo = 0, daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

export const INITIAL_DEMO_HISTORY_RECORDS = [
  // --- TODAY ---
  {
    id: 'rec-01',
    type: 'Glucose',
    title: 'Glucose Reading',
    value: '118 mg/dL',
    numericValue: 118,
    unit: 'mg/dL',
    timestamp: getRelativeTime(1, 0),
    context: 'After Meal',
    status: 'In Range',
    note: 'Post-lunch check after 2 Roti and Dal',
    details: {
      targetRange: '70–180 mg/dL',
      trendStatus: 'Stable In-Range',
      device: 'Manual Log (Demo)'
    }
  },
  {
    id: 'rec-02',
    type: 'Insulin',
    title: 'Insulin Administered',
    value: '4 Units',
    numericValue: 4,
    unit: 'Units (U)',
    timestamp: getRelativeTime(1.5, 0),
    context: 'Before Meal',
    status: 'Rapid-acting',
    note: 'Pre-lunch bolus injection',
    details: {
      medicationType: 'Rapid-acting (Bolus)',
      brand: 'Humalog / Novorapid (Demo)',
      enteredBy: 'User Manual Log'
    }
  },
  {
    id: 'rec-03',
    type: 'Meals',
    title: 'Indian Lunch Logged',
    value: '48g Carbs',
    numericValue: 48,
    unit: 'grams',
    timestamp: getRelativeTime(1.6, 0),
    context: 'Lunch',
    status: '~300 kcal',
    note: '2 Roti / Chapati (30g) + Dal Tadka (18g)',
    details: {
      items: [
        { name: 'Roti / Chapati / Phulka', qty: 2, carbs: 30, cals: 160 },
        { name: 'Dal Tadka (Yellow Toor Dal)', qty: 1, carbs: 18, cals: 140 }
      ],
      totalCarbs: 48,
      totalCalories: 300
    }
  },
  {
    id: 'rec-04',
    type: 'Risk Prediction',
    title: 'AI Hypo Risk Prediction',
    value: 'Low Risk (12%)',
    numericValue: 12,
    unit: '% Probability',
    timestamp: getRelativeTime(2, 0),
    context: 'Post-Meal Evaluation',
    status: 'Low Risk',
    note: 'Demo prediction — not a real-time medical prediction.',
    details: {
      probability: '12% chance in next 2 hours',
      modelStatus: 'Demo ML Simulation',
      rationale: 'Glucose (118 mg/dL) safely in standard target range (70–180 mg/dL).'
    }
  },
  {
    id: 'rec-05',
    type: 'Glucose',
    title: 'Glucose Reading',
    value: '104 mg/dL',
    numericValue: 104,
    unit: 'mg/dL',
    timestamp: getRelativeTime(3, 0),
    context: 'Before Meal',
    status: 'In Range',
    note: 'Pre-lunch baseline glucose check',
    details: {
      targetRange: '70–180 mg/dL',
      trendStatus: 'In Range Baseline',
      device: 'Manual Log (Demo)'
    }
  },
  {
    id: 'rec-06',
    type: 'Meals',
    title: 'Indian Breakfast Logged',
    value: '46g Carbs',
    numericValue: 46,
    unit: 'grams',
    timestamp: getRelativeTime(5, 0),
    context: 'Breakfast',
    status: '~225 kcal',
    note: 'Idli (2 pcs, 32g) + Sambhar (14g)',
    details: {
      items: [
        { name: 'Idli (Steamed Rice & Urad)', qty: 2, carbs: 32, cals: 130 },
        { name: 'Sambhar (1 katori)', qty: 1, carbs: 14, cals: 95 }
      ],
      totalCarbs: 46,
      totalCalories: 225
    }
  },
  {
    id: 'rec-07',
    type: 'Insulin',
    title: 'Insulin Administered',
    value: '3 Units',
    numericValue: 3,
    unit: 'Units (U)',
    timestamp: getRelativeTime(5.2, 0),
    context: 'Before Meal',
    status: 'Rapid-acting',
    note: 'Pre-breakfast bolus injection',
    details: {
      medicationType: 'Rapid-acting (Bolus)',
      brand: 'Humalog (Demo)',
      enteredBy: 'User Manual Log'
    }
  },
  {
    id: 'rec-08',
    type: 'Glucose',
    title: 'Glucose Reading',
    value: '92 mg/dL',
    numericValue: 92,
    unit: 'mg/dL',
    timestamp: getRelativeTime(7.5, 0),
    context: 'Before Meal',
    status: 'In Range',
    note: 'Fasting morning baseline glucose',
    details: {
      targetRange: '70–180 mg/dL',
      trendStatus: 'Optimal Fasting',
      device: 'Manual Log (Demo)'
    }
  },

  // --- PAST 7 DAYS ---
  {
    id: 'rec-09',
    type: 'Insulin',
    title: 'Insulin Administered',
    value: '14 Units',
    numericValue: 14,
    unit: 'Units (U)',
    timestamp: getRelativeTime(0, 1),
    context: 'Bedtime',
    status: 'Long-acting',
    note: 'Nightly basal background insulin (Lantus)',
    details: {
      medicationType: 'Long-acting (Basal)',
      brand: 'Lantus / Glargine (Demo)',
      enteredBy: 'User Manual Log'
    }
  },
  {
    id: 'rec-10',
    type: 'Glucose',
    title: 'Glucose Reading',
    value: '195 mg/dL',
    numericValue: 195,
    unit: 'mg/dL',
    timestamp: getRelativeTime(3, 1),
    context: 'After Meal',
    status: 'Elevated',
    note: 'Post-dinner check (Pav Bhaji)',
    details: {
      targetRange: '70–180 mg/dL',
      trendStatus: 'Slightly Above Target',
      device: 'Manual Log (Demo)'
    }
  },
  {
    id: 'rec-11',
    type: 'Meals',
    title: 'Indian Dinner Logged',
    value: '62g Carbs',
    numericValue: 62,
    unit: 'grams',
    timestamp: getRelativeTime(5, 1),
    context: 'Dinner',
    status: '~420 kcal',
    note: 'Pav Bhaji (2 Pavs + Bhaji plate)',
    details: {
      items: [{ name: 'Pav Bhaji (2 Pavs + Bhaji)', qty: 1, carbs: 62, cals: 420 }],
      totalCarbs: 62,
      totalCalories: 420
    }
  },
  {
    id: 'rec-12',
    type: 'Risk Prediction',
    title: 'AI Hypo Risk Prediction',
    value: 'Moderate Risk (46%)',
    numericValue: 46,
    unit: '% Probability',
    timestamp: getRelativeTime(8, 2),
    context: 'Evening Check',
    status: 'Moderate Risk',
    note: 'Demo prediction — not a real-time medical prediction.',
    details: {
      probability: '46% chance in next 2 hours',
      modelStatus: 'Demo ML Simulation',
      rationale: 'Glucose nearing borderline range (80 mg/dL) before scheduled walk.'
    }
  },
  {
    id: 'rec-13',
    type: 'Glucose',
    title: 'Glucose Reading',
    value: '80 mg/dL',
    numericValue: 80,
    unit: 'mg/dL',
    timestamp: getRelativeTime(8.2, 2),
    context: 'Before Exercise',
    status: 'In Range',
    note: 'Pre-walk glucose check',
    details: {
      targetRange: '70–180 mg/dL',
      trendStatus: 'Lower Borderline',
      device: 'Manual Log (Demo)'
    }
  },
  {
    id: 'rec-14',
    type: 'Meals',
    title: 'Indian Lunch Logged',
    value: '65g Carbs',
    numericValue: 65,
    unit: 'grams',
    timestamp: getRelativeTime(2, 3),
    context: 'Lunch',
    status: '~380 kcal',
    note: 'Steamed Rice (1 bowl, 42g) + Rajma (1 katori, 23g)',
    details: {
      items: [
        { name: 'Steamed White Rice', qty: 1, carbs: 42, cals: 195 },
        { name: 'Rajma Masala (Kidney Beans)', qty: 1, carbs: 23, cals: 185 }
      ],
      totalCarbs: 65,
      totalCalories: 380
    }
  },
  {
    id: 'rec-15',
    type: 'Insulin',
    title: 'Insulin Administered',
    value: '5 Units',
    numericValue: 5,
    unit: 'Units (U)',
    timestamp: getRelativeTime(2.2, 3),
    context: 'Before Meal',
    status: 'Rapid-acting',
    note: 'Pre-lunch meal bolus',
    details: {
      medicationType: 'Rapid-acting (Bolus)',
      brand: 'Novorapid (Demo)',
      enteredBy: 'User Manual Log'
    }
  },
  {
    id: 'rec-16',
    type: 'Glucose',
    title: 'Glucose Reading',
    value: '135 mg/dL',
    numericValue: 135,
    unit: 'mg/dL',
    timestamp: getRelativeTime(1, 4),
    context: 'After Meal',
    status: 'In Range',
    note: 'Post-breakfast check',
    details: {
      targetRange: '70–180 mg/dL',
      trendStatus: 'Optimal In-Range',
      device: 'Manual Log (Demo)'
    }
  },

  // --- PAST 30 DAYS ---
  {
    id: 'rec-17',
    type: 'Meals',
    title: 'Indian Breakfast Logged',
    value: '47g Carbs',
    numericValue: 47,
    unit: 'grams',
    timestamp: getRelativeTime(0, 10),
    context: 'Breakfast',
    status: '~285 kcal',
    note: 'Poha with Peas (35g) + Masala Chai (12g)',
    details: {
      items: [
        { name: 'Poha (Flattened Rice with Peas)', qty: 1, carbs: 35, cals: 210 },
        { name: 'Masala Chai (with Sugar)', qty: 1, carbs: 12, cals: 75 }
      ],
      totalCarbs: 47,
      totalCalories: 285
    }
  },
  {
    id: 'rec-18',
    type: 'Insulin',
    title: 'Insulin Administered',
    value: '14 Units',
    numericValue: 14,
    unit: 'Units (U)',
    timestamp: getRelativeTime(2, 15),
    context: 'Bedtime',
    status: 'Long-acting',
    note: 'Nightly basal background insulin',
    details: {
      medicationType: 'Long-acting (Basal)',
      brand: 'Lantus (Demo)',
      enteredBy: 'User Manual Log'
    }
  },
  {
    id: 'rec-19',
    type: 'Glucose',
    title: 'Glucose Reading',
    value: '110 mg/dL',
    numericValue: 110,
    unit: 'mg/dL',
    timestamp: getRelativeTime(4, 20),
    context: 'Before Meal',
    status: 'In Range',
    note: 'Pre-dinner baseline check',
    details: {
      targetRange: '70–180 mg/dL',
      trendStatus: 'In Range',
      device: 'Manual Log (Demo)'
    }
  },
  {
    id: 'rec-20',
    type: 'Risk Prediction',
    title: 'AI Hypo Risk Prediction',
    value: 'Low Risk (8%)',
    numericValue: 8,
    unit: '% Probability',
    timestamp: getRelativeTime(5, 25),
    context: 'Afternoon Check',
    status: 'Low Risk',
    note: 'Demo prediction — not a real-time medical prediction.',
    details: {
      probability: '8% chance in next 2 hours',
      modelStatus: 'Demo ML Simulation',
      rationale: 'Stable glycemic baseline with consistent bolus logging.'
    }
  }
];
