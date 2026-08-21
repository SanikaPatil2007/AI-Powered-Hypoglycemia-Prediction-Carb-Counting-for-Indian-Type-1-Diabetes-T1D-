/**
 * Initial Mock Data for Indian T1D Care Assistant Prototype
 */
export const mockPatientSummary = {
  name: "Rajesh Kumar",
  type: "Type 1 Diabetes (T1D)",
  lastGlucose: 118,
  unit: "mg/dL",
  status: "Normal Range",
  lastReadingTime: "15 mins ago",
  predictedTrend: "Stable",
  todaysCarbsTotal: 145, // grams
  totalInsulinToday: 24, // Units (Basal + Bolus demo)
  hypoRiskScore: "Low (12%)",
  commonIndianMeals: [
    { name: "2 Roti with Dal Tadka & Sabzi", approxCarbs: 48 },
    { name: "Idli (2 pcs) with Sambar & Chutney", approxCarbs: 42 },
    { name: "Paneer Paratha with Curd", approxCarbs: 55 },
    { name: "Steamed Rice with Rajma", approxCarbs: 65 }
  ]
};
