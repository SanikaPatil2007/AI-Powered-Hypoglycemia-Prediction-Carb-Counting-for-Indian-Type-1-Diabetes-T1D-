/**
 * History Module Service Utilities
 * Filtering, statistics calculation, and theme helpers for multi-category health logs.
 */

export const RECORD_TYPES = [
  'All',
  'Glucose',
  'Meals',
  'Insulin',
  'Risk Prediction'
];

export const TIME_PERIODS = [
  'Today',
  'Last 7 Days',
  'Last 30 Days',
  'All'
];

/**
 * Filter health history records by type, time period, and search query
 */
export function filterHistoryRecords(records = [], typeFilter = 'All', periodFilter = 'All', searchQuery = '') {
  if (!records || records.length === 0) return [];

  const now = new Date();
  const cleanQuery = searchQuery.toLowerCase().trim();

  return records
    .filter((rec) => {
      // 1. Filter by Record Type
      const matchesType = typeFilter === 'All' || rec.type === typeFilter;
      if (!matchesType) return false;

      // 2. Filter by Time Period
      const recDate = new Date(rec.timestamp);
      if (isNaN(recDate.getTime())) return false;

      const diffTime = now.getTime() - recDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      let matchesPeriod = true;
      if (periodFilter === 'Today') {
        matchesPeriod =
          recDate.getDate() === now.getDate() &&
          recDate.getMonth() === now.getMonth() &&
          recDate.getFullYear() === now.getFullYear();
      } else if (periodFilter === 'Last 7 Days') {
        matchesPeriod = diffDays <= 7;
      } else if (periodFilter === 'Last 30 Days') {
        matchesPeriod = diffDays <= 30;
      } else {
        matchesPeriod = true;
      }

      if (!matchesPeriod) return false;

      // 3. Filter by Search Query
      if (cleanQuery) {
        const titleMatch = rec.title?.toLowerCase().includes(cleanQuery);
        const valueMatch = rec.value?.toLowerCase().includes(cleanQuery);
        const contextMatch = rec.context?.toLowerCase().includes(cleanQuery);
        const noteMatch = rec.note?.toLowerCase().includes(cleanQuery);
        const statusMatch = rec.status?.toLowerCase().includes(cleanQuery);
        const typeMatch = rec.type?.toLowerCase().includes(cleanQuery);

        return (
          titleMatch ||
          valueMatch ||
          contextMatch ||
          noteMatch ||
          statusMatch ||
          typeMatch
        );
      }

      return true;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Get styling details for each record type
 */
export function getRecordTypeMeta(type) {
  switch (type) {
    case 'Glucose':
      return {
        label: 'Glucose',
        color: '#0f766e',
        bg: '#ccfbf1',
        border: '#d1e7e5',
        iconType: 'droplets'
      };
    case 'Meals':
      return {
        label: 'Meal',
        color: '#0d9488',
        bg: '#ccfbf1',
        border: '#d1e7e5',
        iconType: 'utensils'
      };
    case 'Insulin':
      return {
        label: 'Insulin',
        color: '#d97706',
        bg: '#fef3c7',
        border: '#fde68a',
        iconType: 'syringe'
      };
    case 'Risk Prediction':
      return {
        label: 'AI Risk',
        color: '#12304a',
        bg: '#f1f5f9',
        border: '#d1e7e5',
        iconType: 'sparkles'
      };
    default:
      return {
        label: type,
        color: '#64748b',
        bg: '#f1f5f9',
        border: '#d1e7e5',
        iconType: 'activity'
      };
  }
}

/**
 * Format timestamp into readable user-friendly label
 */
export function formatHistoryDateTime(dateString) {
  if (!dateString) return 'Just now';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();

    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `Today, ${timeStr}`;
    if (isYesterday) return `Yesterday, ${timeStr}`;

    const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return `${dateStr}, ${timeStr}`;
  } catch {
    return dateString;
  }
}

/**
 * Calculate Summary Stats for History Dataset
 */
export function calculateHistoryStats(records = []) {
  const now = new Date();
  const todayRecords = records.filter((r) => {
    try {
      const d = new Date(r.timestamp);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    } catch {
      return false;
    }
  });

  return {
    total: records.length,
    todayCount: todayRecords.length,
    glucoseCount: records.filter((r) => r.type === 'Glucose').length,
    mealsCount: records.filter((r) => r.type === 'Meals').length,
    insulinCount: records.filter((r) => r.type === 'Insulin').length,
    riskCount: records.filter((r) => r.type === 'Risk Prediction').length
  };
}
