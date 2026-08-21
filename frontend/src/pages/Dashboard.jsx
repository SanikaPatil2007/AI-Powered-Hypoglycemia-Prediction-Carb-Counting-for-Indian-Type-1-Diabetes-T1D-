import React from 'react';
import { mockPatientSummary } from '../data/mockData';
import { 
  Activity, 
  Utensils, 
  Syringe, 
  TrendingUp, 
  ShieldAlert, 
  Heart, 
  Sparkles 
} from 'lucide-react';

/**
 * Dashboard Page Component
 * Main landing overview for T1D Care Assistant.
 */
export default function Dashboard() {
  return (
    <div className="dashboard-page">
      {/* Hero Welcome Section */}
      <div className="hero-feature-card">
        <span className="hero-tag">Clinical AI Assistant</span>
        <h2 className="hero-title">T1D Care Assistant</h2>
        <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#93c5fd', marginBottom: '0.5rem' }}>
          AI-powered diabetes support
        </p>
        <p className="hero-desc">
          Welcome to the Type 1 Diabetes Care Assistant. Designed specifically to support Indian T1D patients with intelligent carbohydrate counting for regional diets, continuous glucose trend monitoring, and predictive hypoglycemia alerts.
        </p>
        <div className="hero-pills-row">
          <div className="pill-item">
            <Sparkles size={16} color="#fbbf24" />
            <span>AI Carb Estimation</span>
          </div>
          <div className="pill-item">
            <TrendingUp size={16} color="#34d399" />
            <span>Hypo Trend Prediction</span>
          </div>
          <div className="pill-item">
            <Heart size={16} color="#f472b6" />
            <span>Indian Diet Optimized</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-900)' }}>
          Overview & Quick Glance
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Real-time summary status metrics
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="dashboard-grid">
        {/* Glucose Card */}
        <div className="card">
          <div className="card-header-flex">
            <span className="card-title">Latest Glucose</span>
            <div className="card-icon-pill blue">
              <Activity size={22} />
            </div>
          </div>
          <div className="card-metric-value">
            {mockPatientSummary.lastGlucose} <span style={{ fontSize: '1rem', fontWeight: 600 }}>{mockPatientSummary.unit}</span>
          </div>
          <div className="card-subtext" style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
            ● {mockPatientSummary.status} ({mockPatientSummary.lastReadingTime})
          </div>
        </div>

        {/* Carb Counter Summary */}
        <div className="card">
          <div className="card-header-flex">
            <span className="card-title">Carbs Logged Today</span>
            <div className="card-icon-pill teal">
              <Utensils size={22} />
            </div>
          </div>
          <div className="card-metric-value">
            {mockPatientSummary.todaysCarbsTotal} <span style={{ fontSize: '1rem', fontWeight: 600 }}>g</span>
          </div>
          <div className="card-subtext">
            4 Indian meals logged today
          </div>
        </div>

        {/* Insulin Summary */}
        <div className="card">
          <div className="card-header-flex">
            <span className="card-title">Insulin Logged</span>
            <div className="card-icon-pill amber">
              <Syringe size={22} />
            </div>
          </div>
          <div className="card-metric-value">
            {mockPatientSummary.totalInsulinToday} <span style={{ fontSize: '1rem', fontWeight: 600 }}>Units</span>
          </div>
          <div className="card-subtext">
            Basal: 14U | Bolus: 10U
          </div>
        </div>

        {/* Hypo Risk Prediction Card */}
        <div className="card" style={{ borderColor: 'var(--teal-100)', background: 'linear-gradient(180deg, #ffffff 0%, var(--teal-50) 100%)' }}>
          <div className="card-header-flex">
            <span className="card-title" style={{ color: 'var(--teal-700)', fontWeight: 700 }}>Hypo Risk Predictor</span>
            <div className="card-icon-pill teal">
              <ShieldAlert size={22} />
            </div>
          </div>
          <div className="card-metric-value" style={{ color: 'var(--teal-700)' }}>
            {mockPatientSummary.hypoRiskScore}
          </div>
          <div className="card-subtext" style={{ color: 'var(--teal-600)' }}>
            AI Model Status: Active Prediction Engine
          </div>
        </div>
      </div>
    </div>
  );
}
