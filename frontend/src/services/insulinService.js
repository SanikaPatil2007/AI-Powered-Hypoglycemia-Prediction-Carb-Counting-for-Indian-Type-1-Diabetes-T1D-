/**
 * Insulin Management Helper & Service Utilities
 * Computes demo summaries, styles, and safe date/time formatters.
 */

/**
 * Format timestamp into user-friendly date and time
 */
export function formatInsulinDateTime(dateString) {
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
 * Get badge styling details for insulin types
 */
export function getInsulinTypeBadge(type) {
  switch (type) {
    case 'Rapid-acting':
      return {
        label: 'Rapid-acting',
        color: '#0f766e',
        bg: '#ccfbf1',
        border: '#d1e7e5',
        tagClass: 'badge-rapid'
      };
    case 'Long-acting':
      return {
        label: 'Long-acting',
        color: '#12304a',
        bg: '#edf7f6',
        border: '#d1e7e5',
        tagClass: 'badge-long'
      };
    case 'Other':
    default:
      return {
        label: type || 'Other',
        color: '#b45309',
        bg: '#fef3c7',
        border: '#fde68a',
        tagClass: 'badge-other'
      };
  }
}

/**
 * Calculate Summary of Recorded Insulin Events
 */
export function calculateInsulinSummary(records = []) {
  if (!records || records.length === 0) {
    return {
      todayUnits: 0,
      rapidUnitsToday: 0,
      longUnitsToday: 0,
      todayEventsCount: 0,
      totalUnits: 0,
      totalEventsCount: 0,
      latestRecord: null
    };
  }

  const now = new Date();
  
  // Filter for records logged today
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

  const todayUnits = todayRecords.reduce((sum, r) => sum + (Number(r.units) || 0), 0);
  const rapidUnitsToday = todayRecords
    .filter((r) => r.type === 'Rapid-acting')
    .reduce((sum, r) => sum + (Number(r.units) || 0), 0);
  const longUnitsToday = todayRecords
    .filter((r) => r.type === 'Long-acting')
    .reduce((sum, r) => sum + (Number(r.units) || 0), 0);

  const totalUnits = records.reduce((sum, r) => sum + (Number(r.units) || 0), 0);

  return {
    todayUnits: Math.round(todayUnits * 10) / 10,
    rapidUnitsToday: Math.round(rapidUnitsToday * 10) / 10,
    longUnitsToday: Math.round(longUnitsToday * 10) / 10,
    todayEventsCount: todayRecords.length,
    totalUnits: Math.round(totalUnits * 10) / 10,
    totalEventsCount: records.length,
    latestRecord: records[0] || null
  };
}
