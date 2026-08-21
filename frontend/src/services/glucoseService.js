/**
 * Glucose Monitoring Helper & Service Utilities
 * Computes demo classifications, statistics, and AI risk estimates.
 */

// Target clinical standard thresholds (Demo Reference Only)
export const TARGET_MIN = 70; // mg/dL
export const TARGET_MAX = 180; // mg/dL

/**
 * Classify single glucose reading into demo status
 * @param {number} value - Glucose value in mg/dL
 * @returns {'Low' | 'In Range' | 'Elevated'}
 */
export function classifyGlucose(value) {
  const num = Number(value);
  if (num < TARGET_MIN) return 'Low';
  if (num > TARGET_MAX) return 'Elevated';
  return 'In Range';
}

/**
 * Get styling theme details for a status label
 */
export function getStatusTheme(status) {
  switch (status) {
    case 'Low':
      return {
        label: 'Low',
        color: '#dc2626',
        bg: '#fee2e2',
        borderColor: '#fecdd3',
        tagClass: 'status-low'
      };
    case 'Elevated':
      return {
        label: 'Elevated',
        color: '#d97706',
        bg: '#fef3c7',
        borderColor: '#fde68a',
        tagClass: 'status-elevated'
      };
    case 'In Range':
    default:
      return {
        label: 'In Range',
        color: '#16a34a',
        bg: '#dcfce7',
        borderColor: '#bbf7d0',
        tagClass: 'status-in-range'
      };
  }
}

/**
 * Format timestamp into user-friendly date and time
 */
export function formatReadingDateTime(dateString) {
  if (!dateString) return 'Just now';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) {
      return `Today, ${timeStr}`;
    }

    const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return `${dateStr}, ${timeStr}`;
  } catch {
    return dateString;
  }
}

/**
 * AI Hypoglycemia Risk Prediction (DEMO Simulation)
 * Evaluates recent readings and trends to provide simulated risk feedback.
 */
export function calculateHypoRisk(readings = []) {
  if (!readings || readings.length === 0) {
    return {
      level: 'Low',
      probability: 10,
      scoreText: 'Low Risk (10%)',
      explanation: 'No recent readings logged. Baseline risk estimated as low.',
      theme: 'low'
    };
  }

  const latest = readings[0];
  const val = Number(latest.value) || 100;

  if (val < 70) {
    return {
      level: 'High',
      probability: 88,
      scoreText: 'High Risk (88%)',
      explanation: `Current reading (${val} mg/dL) is below target threshold (<70 mg/dL). Immediate attention is advised according to personal diabetes care plan.`,
      theme: 'high'
    };
  }

  if (val <= 85) {
    return {
      level: 'Moderate',
      probability: 46,
      scoreText: 'Moderate Risk (46%)',
      explanation: `Current reading (${val} mg/dL) is nearing lower boundary (70–85 mg/dL). Monitor levels closely, especially before exercise or sleep.`,
      theme: 'moderate'
    };
  }

  if (val > 220) {
    return {
      level: 'Low',
      probability: 4,
      scoreText: 'Low Risk (4%)',
      explanation: `Current reading (${val} mg/dL) is significantly elevated. Hypoglycemia risk in next 2 hours is minimal.`,
      theme: 'low'
    };
  }

  return {
    level: 'Low',
    probability: 12,
    scoreText: 'Low Risk (12%)',
    explanation: `Current glucose (${val} mg/dL) is safely within standard target range (70–180 mg/dL). Projected trend is stable.`,
    theme: 'low'
  };
}

/**
 * Summary Statistics for Glucose Readings
 */
export function calculateGlucoseStats(readings = []) {
  if (!readings || readings.length === 0) {
    return {
      avg: 0,
      inRangePct: 0,
      highest: 0,
      lowest: 0,
      count: 0
    };
  }

  const values = readings.map((r) => Number(r.value)).filter((v) => !isNaN(v) && v > 0);
  if (values.length === 0) {
    return { avg: 0, inRangePct: 0, highest: 0, lowest: 0, count: 0 };
  }

  const total = values.reduce((sum, v) => sum + v, 0);
  const avg = Math.round(total / values.length);
  const inRangeCount = values.filter((v) => v >= TARGET_MIN && v <= TARGET_MAX).length;
  const inRangePct = Math.round((inRangeCount / values.length) * 100);
  const highest = Math.max(...values);
  const lowest = Math.min(...values);

  return {
    avg,
    inRangePct,
    highest,
    lowest,
    count: readings.length
  };
}
