import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { predictHypoglycemia } from '../services/predictionService';

/**
 * AI Hypoglycemia Risk Card
 *
 * Connects the React frontend to the Flask ML backend:
 * POST http://127.0.0.1:5000/predict
 *
 * The backend returns:
 * {
 *   prediction: 0,
 *   risk: "LOW",
 *   risk_probability: 11.33
 * }
 */
export default function HypoRiskCard({ readings = [] }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /*
   * Convert frontend glucose readings into the feature format
   * expected by the trained Random Forest model.
   */
  const buildModelInput = () => {
    const sortedReadings = [...readings]
      .filter((r) => r && typeof r.value === 'number')
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() -
          new Date(a.timestamp).getTime()
      );

    const latest = sortedReadings[0];

    if (!latest) {
      return null;
    }

    const glucose = Number(latest.value);

    const glucose5 =
      sortedReadings[1]?.value !== undefined
        ? Number(sortedReadings[1].value)
        : glucose;

    const glucose15 =
      sortedReadings[2]?.value !== undefined
        ? Number(sortedReadings[2].value)
        : glucose;

    const glucose30 =
      sortedReadings[3]?.value !== undefined
        ? Number(sortedReadings[3].value)
        : glucose;

    /*
     * Calculate glucose changes.
     */
    const glucoseChange5 = glucose - glucose5;
    const glucoseChange15 = glucose - glucose15;
    const glucoseChange30 = glucose - glucose30;

    /*
     * Get current time.
     */
    const currentDate = new Date(latest.timestamp);
    const hour = currentDate.getHours();

    /*
     * Simple time-of-day encoding.
     *
     * 0 = Night
     * 1 = Morning
     * 2 = Afternoon
     * 3 = Evening
     */
    let timeOfDay = 0;

    if (hour >= 6 && hour < 12) {
      timeOfDay = 1;
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = 2;
    } else if (hour >= 18 && hour < 24) {
      timeOfDay = 3;
    }

    /*
     * These values are currently defaults because the
     * glucose page does not yet collect insulin/activity
     * information directly.
     *
     * We can connect these later to the Insulin and Meal pages.
     */
    const inputData = {
      glucose: glucose,

      glucose_5min_ago: glucose5,
      glucose_15min_ago: glucose15,
      glucose_30min_ago: glucose30,

      glucose_change_5min: glucoseChange5,
      glucose_change_15min: glucoseChange15,
      glucose_change_30min: glucoseChange30,

      basal_rate: 1.0,
      bolus_volume_delivered: 0.0,
      carb_input: 0.0,

      heart_rate: 75,
      steps: 0,
      calories: 0,

      time_of_day: timeOfDay
    };

    return inputData;
  };

  /*
   * Call the real ML backend.
   */
  const runPrediction = async () => {
    const inputData = buildModelInput();

    if (!inputData) {
      setPrediction(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await predictHypoglycemia(inputData);

      console.log('ML Prediction:', result);

      setPrediction(result);
    } catch (err) {
      console.error('Prediction failed:', err);

      setError(
        'Unable to connect to the AI prediction server. Make sure the Flask backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Automatically run prediction whenever readings change.
   */
  useEffect(() => {
    runPrediction();
  }, [readings]);

  /*
   * Determine visual theme from backend risk.
   */
  const getRiskTheme = (risk) => {
    const normalizedRisk = String(risk || '').toUpperCase();

    if (normalizedRisk === 'HIGH') {
      return {
        bg: '#fee2e2',
        color: '#dc2626',
        border: '#fecaca',
        meterClass: 'high',
        icon: ShieldAlert
      };
    }

    if (
      normalizedRisk === 'MODERATE' ||
      normalizedRisk === 'MEDIUM'
    ) {
      return {
        bg: '#fef3c7',
        color: '#d97706',
        border: '#fde68a',
        meterClass: 'moderate',
        icon: AlertCircle
      };
    }

    return {
      bg: '#ccfbf1',
      color: '#0f766e',
      border: '#99f6e4',
      meterClass: 'low',
      icon: ShieldCheck
    };
  };

  /*
   * No readings available.
   */
  if (!readings || readings.length === 0) {
    return (
      <div className="hypo-risk-card">
        <div className="risk-card-header">
          <div className="risk-title-group">
            <div className="ai-icon-pill">
              <Sparkles size={18} />
            </div>

            <div>
              <h3 className="risk-main-title">
                AI Hypoglycemia Risk Prediction
              </h3>

              <span className="risk-sub-tag">
                Predictive Model Analysis
              </span>
            </div>
          </div>
        </div>

        <div className="risk-explanation-box">
          <div className="explanation-title">
            Waiting for glucose data
          </div>

          <p className="explanation-text">
            Add a glucose reading to generate an AI-powered
            hypoglycemia risk prediction.
          </p>
        </div>
      </div>
    );
  }

  /*
   * Loading state.
   */
  if (loading && !prediction) {
    return (
      <div className="hypo-risk-card">
        <div className="risk-card-header">
          <div className="risk-title-group">
            <div className="ai-icon-pill">
              <Sparkles size={18} />
            </div>

            <div>
              <h3 className="risk-main-title">
                AI Hypoglycemia Risk Prediction
              </h3>

              <span className="risk-sub-tag">
                Connecting to ML Prediction Engine
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            padding: '1.5rem',
            color: 'var(--text-muted)'
          }}
        >
          <Loader2
            size={22}
            style={{
              animation: 'spin 1s linear infinite'
            }}
          />

          <span>
            Running AI prediction...
          </span>
        </div>
      </div>
    );
  }

  /*
   * Backend connection error.
   */
  if (error && !prediction) {
    return (
      <div className="hypo-risk-card">
        <div className="risk-card-header">
          <div className="risk-title-group">
            <div className="ai-icon-pill">
              <Sparkles size={18} />
            </div>

            <div>
              <h3 className="risk-main-title">
                AI Hypoglycemia Risk Prediction
              </h3>

              <span className="risk-sub-tag">
                Prediction Engine
              </span>
            </div>
          </div>
        </div>

        <div className="risk-explanation-box">
          <div
            className="explanation-title"
            style={{ color: '#dc2626' }}
          >
            Prediction Service Unavailable
          </div>

          <p className="explanation-text">
            {error}
          </p>
        </div>

        <button
          type="button"
          onClick={runPrediction}
          style={{
            marginTop: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            background: '#fff',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <RefreshCw size={16} />
          Retry Prediction
        </button>
      </div>
    );
  }

  if (!prediction) {
    return null;
  }

  const riskLevel = String(
    prediction.risk || 'LOW'
  ).toUpperCase();

  const probability = Number(
    prediction.risk_probability ?? 0
  );

  const theme = getRiskTheme(riskLevel);

  const BadgeIcon = theme.icon;

  /*
   * Explanation based on model output.
   */
  let explanation = '';

  if (riskLevel === 'HIGH') {
    explanation =
      'The trained ML model indicates a higher probability of hypoglycemia based on the current glucose trend and input features.';
  } else if (
    riskLevel === 'MODERATE' ||
    riskLevel === 'MEDIUM'
  ) {
    explanation =
      'The trained ML model indicates a moderate probability of hypoglycemia. Continue monitoring glucose trends closely.';
  } else {
    explanation =
      'The trained ML model currently estimates a low probability of hypoglycemia based on the supplied glucose and contextual features.';
  }

  return (
    <div className="hypo-risk-card">

      {/* Header */}
      <div className="risk-card-header">

        <div className="risk-title-group">

          <div className="ai-icon-pill">
            <Sparkles size={18} />
          </div>

          <div>
            <h3 className="risk-main-title">
              AI Hypoglycemia Risk Prediction
            </h3>

            <span className="risk-sub-tag">
              Live Random Forest Model
            </span>
          </div>

        </div>

        {/* Risk Badge */}
        <div
          className="risk-level-badge"
          style={{
            backgroundColor: theme.bg,
            color: theme.color,
            borderColor: theme.border
          }}
        >
          <BadgeIcon size={16} />

          <span>
            {riskLevel} Risk
          </span>
        </div>

      </div>

      {/* Probability */}
      <div className="risk-metric-row">

        <div className="risk-prob-container">

          <div className="risk-prob-label">
            Predicted Hypoglycemia Probability
          </div>

          <div className="risk-prob-value-row">

            <span className="risk-prob-number">
              {probability.toFixed(2)}%
            </span>

            <span className="risk-prob-desc">
              Estimated probability of hypoglycemia
            </span>

          </div>

          {/* Probability Meter */}
          <div className="risk-meter-track">

            <div
              className={`risk-meter-fill ${theme.meterClass}`}
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, probability)
                )}%`
              }}
            />

          </div>

        </div>

      </div>

      {/* Prediction Context */}
      <div className="risk-explanation-box">

        <div className="explanation-title">
          Prediction Context & Analysis
        </div>

        <p className="explanation-text">
          {explanation}
        </p>

      </div>

      {/* Model Information */}
      <div className="risk-disclaimer-footnote">

        <Sparkles
          size={14}
          style={{
            flexShrink: 0,
            marginTop: '2px',
            color: 'var(--teal-600)'
          }}
        />

        <span>
          <strong>AI Model:</strong>{' '}
          Prediction generated by the trained
          Random Forest model through the Flask backend.
        </span>

      </div>

      {/* Retry / Refresh */}
      <button
        type="button"
        onClick={runPrediction}
        disabled={loading}
        style={{
          marginTop: '0.9rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.5rem 0.8rem',
          borderRadius: '7px',
          border: '1px solid #d1d5db',
          background: '#ffffff',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.8rem',
          fontWeight: 600,
          opacity: loading ? 0.6 : 1
        }}
      >
        <RefreshCw
          size={14}
          style={{
            animation: loading
              ? 'spin 1s linear infinite'
              : 'none'
          }}
        />

        {loading
          ? 'Updating...'
          : 'Refresh Prediction'}
      </button>

    </div>
  );
}