import React, { useEffect, useState } from 'react';
import GlucoseChart from '../components/GlucoseChart';
import HypoRiskCard from '../components/HypoRiskCard';

import {
  classifyGlucose,
  getStatusTheme,
  formatReadingDateTime,
  calculateGlucoseStats
} from '../services/glucoseService';

import { predictHypoglycemia } from '../services/predictionService';

import {
  saveGlucoseReading,
  getLatestGlucose,
  deleteGlucoseReading
} from '../services/glucoseApi';

import {
  GLUCOSE_CONTEXT_OPTIONS
} from '../data/glucoseData';

import {
  Droplets,
  Plus,
  Trash2,
  Activity,
  CheckCircle2,
  AlertCircle,
  Target,
  Sparkles,
  RotateCcw
} from 'lucide-react';


export default function Glucose() {

  // ============================================================
  // GLUCOSE READINGS
  // ============================================================

  const [readings, setReadings] = useState([]);


  // ============================================================
  // ML PREDICTION STATE
  // ============================================================

  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState('');


  // ============================================================
  // FORM STATE
  // ============================================================

  const [glucoseInput, setGlucoseInput] = useState('');
  const [contextInput, setContextInput] = useState('Before Meal');
  const [noteInput, setNoteInput] = useState('');
  const [formError, setFormError] = useState('');
  const [notification, setNotification] = useState(null);


  // ============================================================
  // DATE/TIME
  // ============================================================

  function getNowLocalDateTime() {
    const now = new Date();

    now.setMinutes(
      now.getMinutes() - now.getTimezoneOffset()
    );

    return now.toISOString().slice(0, 16);
  }

  const [dateTimeInput, setDateTimeInput] = useState(
    getNowLocalDateTime()
  );


  // ============================================================
  // MONGODB STATE
  // ============================================================

  const [mongoLoading, setMongoLoading] = useState(false);


  // ============================================================
  // TOAST
  // ============================================================

  const showToast = (message, type = 'success') => {

    setNotification({
      message,
      type
    });

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };


  // ============================================================
  // LOAD LATEST GLUCOSE FROM MONGODB
  // ============================================================

  useEffect(() => {

    const loadMongoGlucose = async () => {

      try {

        setMongoLoading(true);

        const latest = await getLatestGlucose();

        console.log(
          'Latest glucose received from MongoDB:',
          latest
        );

        if (
          latest &&
          latest.value !== undefined
        ) {

          const mongoReading = {

            id:
              latest._id ||
              `mongo-${Date.now()}`,

            value:
              Number(latest.value),

            unit:
              latest.unit ||
              'mg/dL',

            timestamp:
              latest.timestamp ||
              new Date().toISOString(),

            context:
              latest.context ||
              'Other',

            status:
              latest.status ||
              classifyGlucose(
                Number(latest.value)
              ),

            note:
              latest.note ||
              ''
          };

          setReadings([
            mongoReading
          ]);
        }

      } catch (error) {

        console.error(
          'MongoDB glucose loading failed:',
          error
        );

      } finally {

        setMongoLoading(false);

      }

    };

    loadMongoGlucose();

  }, []);


  // ============================================================
  // REAL ML PREDICTION
  // ============================================================

  const runMLPrediction = async (currentReadings) => {

    if (
      !currentReadings ||
      currentReadings.length === 0
    ) {
      return;
    }

    setMlLoading(true);
    setMlError('');

    try {

      // ----------------------------------------------------------
      // CURRENT READING
      // ----------------------------------------------------------

      const latest =
        currentReadings[0];

      const previous1 =
        currentReadings[1] ||
        latest;

      const previous2 =
        currentReadings[2] ||
        previous1;

      const previous3 =
        currentReadings[3] ||
        previous2;


      // ----------------------------------------------------------
      // GLUCOSE VALUES
      // ----------------------------------------------------------

      const glucose =
        Number(latest.value) || 0;

      const glucose5 =
        Number(previous1.value) ||
        glucose;

      const glucose15 =
        Number(previous2.value) ||
        glucose5;

      const glucose30 =
        Number(previous3.value) ||
        glucose15;


      // ----------------------------------------------------------
      // GLUCOSE CHANGES
      // ----------------------------------------------------------

      const glucoseChange5 =
        glucose - glucose5;

      const glucoseChange15 =
        glucose - glucose15;

      const glucoseChange30 =
        glucose - glucose30;


      // ----------------------------------------------------------
      // DATA SENT TO ML MODEL
      // ----------------------------------------------------------

      const inputData = {

        glucose,

        glucose_5min_ago:
          glucose5,

        glucose_15min_ago:
          glucose15,

        glucose_30min_ago:
          glucose30,

        glucose_change_5min:
          glucoseChange5,

        glucose_change_15min:
          glucoseChange15,

        glucose_change_30min:
          glucoseChange30,

        // ------------------------------------------------------
        // Current prototype values
        // ------------------------------------------------------

        basal_rate: 1.0,

        bolus_volume_delivered: 2.0,

        carb_input: 40,

        heart_rate: 75,

        steps: 1000,

        calories: 50,

        time_of_day:
          new Date().getHours()
      };


      console.log(
        'Sending ML input:',
        inputData
      );


      // ----------------------------------------------------------
      // CALL FLASK ML API
      // ----------------------------------------------------------

      const result =
        await predictHypoglycemia(
          inputData
        );


      console.log(
        'ML prediction received:',
        result
      );


      // ----------------------------------------------------------
      // SAVE ML RESULT
      // ----------------------------------------------------------

      setMlPrediction(result);

    } catch (error) {

      console.error(
        'ML prediction failed:',
        error
      );

      setMlError(
        'Unable to get AI prediction from backend.'
      );

    } finally {

      setMlLoading(false);

    }

  };


  // ============================================================
  // RUN ML WHEN READINGS CHANGE
  // ============================================================

  useEffect(() => {

    if (
      readings &&
      readings.length > 0
    ) {

      runMLPrediction(
        readings
      );

    }

  }, [readings]);


  // ============================================================
  // LATEST READING
  // ============================================================

  const latestReading =
    readings[0] || null;


  const latestTheme =
    latestReading
      ? getStatusTheme(
          latestReading.status
        )
      : null;


  // ============================================================
  // GLUCOSE STATISTICS
  // ============================================================

  const stats =
    calculateGlucoseStats(
      readings
    );


  // ============================================================
  // SAVE GLUCOSE READING
  // ============================================================

  const handleSaveReading = async (e) => {

    e.preventDefault();

    setFormError('');

    const val =
      Number(
        glucoseInput.trim()
      );


    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (
      !glucoseInput ||
      isNaN(val)
    ) {

      setFormError(
        'Please enter a valid numeric glucose reading.'
      );

      return;
    }


    if (
      val < 20 ||
      val > 600
    ) {

      setFormError(
        'Glucose reading must be between 20 and 600 mg/dL.'
      );

      return;
    }


    // ----------------------------------------------------------
    // STATUS
    // ----------------------------------------------------------

    const calculatedStatus =
      classifyGlucose(val);


    // ----------------------------------------------------------
    // DATE
    // ----------------------------------------------------------

    const dateObj =
      dateTimeInput
        ? new Date(dateTimeInput)
        : new Date();


    // ----------------------------------------------------------
    // NEW READING
    // ----------------------------------------------------------

    const newEntry = {

      value:
        val,

      unit:
        'mg/dL',

      timestamp:
        dateObj.toISOString(),

      context:
        contextInput,

      status:
        calculatedStatus,

      note:
        noteInput.trim() || ''
    };


    try {

      setMongoLoading(true);


      // --------------------------------------------------------
      // SAVE TO MONGODB
      // --------------------------------------------------------

      console.log(
        'Saving glucose to MongoDB:',
        newEntry
      );


      const mongoResult =
        await saveGlucoseReading(
          newEntry
        );


      console.log(
        'Glucose saved to MongoDB:',
        mongoResult
      );


      // --------------------------------------------------------
      // CREATE FRONTEND READING
      // --------------------------------------------------------

      const savedEntry = {

        ...newEntry,

        id:
          mongoResult?._id ||
          `local-${Date.now()}`
      };


      // --------------------------------------------------------
      // UPDATE FRONTEND
      // --------------------------------------------------------

      setReadings((prev) => [

        savedEntry,

        ...prev

      ]);


      // --------------------------------------------------------
      // RESET FORM
      // --------------------------------------------------------

      setGlucoseInput('');

      setNoteInput('');

      setDateTimeInput(
        getNowLocalDateTime()
      );

      setFormError('');


      // --------------------------------------------------------
      // SUCCESS MESSAGE
      // --------------------------------------------------------

      showToast(
        `Saved ${val} mg/dL to MongoDB successfully!`
      );


    } catch (error) {

      console.error(
        'MongoDB save failed:',
        error
      );


      setFormError(
        'Could not save glucose reading to backend.'
      );


      showToast(
        'MongoDB save failed',
        'error'
      );


    } finally {

      setMongoLoading(false);

    }

  };


  // ============================================================
  // DELETE FROM CURRENT VIEW
  // ============================================================

const handleDeleteReading = async (id) => {
  try {
    setMongoLoading(true);

    await deleteGlucoseReading(id);

    setReadings((prev) =>
      prev.filter((r) => r.id !== id)
    );

    showToast(
      'Glucose reading deleted from MongoDB',
      'info'
    );

  } catch (error) {
    console.error(
      'Delete glucose failed:',
      error
    );

    showToast(
      'Unable to delete glucose reading',
      'error'
    );

  } finally {
    setMongoLoading(false);
  }
};

  // ============================================================
  // RESET CURRENT VIEW
  // ============================================================

  const handleResetDemoData = () => {

    setReadings([]);

    setMlPrediction(null);

    setMlError('');

    showToast(
      'Current glucose view cleared',
      'info'
    );

  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="glucose-page">


      {/* ======================================================
          TOAST
      ======================================================= */}

      {notification && (

        <div
          className={`toast-notification ${notification.type}`}
        >

          <CheckCircle2 size={18} />

          <span>
            {notification.message}
          </span>

        </div>

      )}


      {/* ======================================================
          HEADER
      ======================================================= */}

      <div
        className="page-header-row"
        style={{
          marginBottom: '1.25rem'
        }}
      >

        <div>

          <h2 className="page-header-title">
            Glucose Monitoring & Trend Analytics
          </h2>

          <p className="page-header-subtitle">

            Continuous glucose logging,
            target zone tracking
            (70–180 mg/dL),
            and AI-driven hypo risk estimation.

          </p>

        </div>

      </div>


      {/* ======================================================
          ML STATUS
      ======================================================= */}

      <div
        style={{
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: '10px',

          background:
            mlLoading
              ? '#eff6ff'
              : mlError
                ? '#fef2f2'
                : '#ecfdf5',

          border:
            '1px solid #e2e8f0',

          fontSize:
            '0.85rem'
        }}
      >

        {mlLoading && (

          <span>
            🔄 AI model is analyzing glucose data...
          </span>

        )}


        {!mlLoading &&
          mlError && (

            <span
              style={{
                color: '#dc2626'
              }}
            >

              ⚠️ {mlError}

            </span>

          )}


        {!mlLoading &&
          !mlError &&
          mlPrediction && (

            <span
              style={{
                color: '#047857'
              }}
            >

              ✓ Real ML prediction received —
              Risk:{' '}

              <strong>
                {mlPrediction.risk}
              </strong>

              {' | '}

              Probability:{' '}

              <strong>
                {mlPrediction.risk_probability}%
              </strong>

            </span>

          )}


        {!mlLoading &&
          !mlError &&
          !mlPrediction && (

            <span>
              AI prediction waiting for glucose data...
            </span>

          )}

      </div>


      {/* ======================================================
          MONGODB STATUS
      ======================================================= */}

      <div
        style={{
          marginBottom: '1rem',
          padding: '0.6rem 1rem',
          borderRadius: '8px',

          background:
            mongoLoading
              ? '#eff6ff'
              : '#f0fdf4',

          border:
            '1px solid #e2e8f0',

          fontSize:
            '0.8rem'
        }}
      >

        {mongoLoading
          ? '🔄 Connecting to MongoDB...'
          : '✓ Glucose database connected'}

      </div>


      {/* ======================================================
          TOP GRID
      ======================================================= */}

      <div className="glucose-top-grid">


        {/* ====================================================
            CURRENT GLUCOSE
        ===================================================== */}

        <div className="card current-glucose-card">

          <div className="card-header-flex">

            <div>

              <span className="card-title">
                Latest Glucose Reading
              </span>

              <div className="card-sub-timestamp">

                {latestReading
                  ? formatReadingDateTime(
                      latestReading.timestamp
                    )
                  : 'No data'}

              </div>

            </div>


            <div className="card-icon-pill blue">

              <Droplets size={22} />

            </div>

          </div>


          {latestReading ? (

            <>

              <div className="current-glucose-val-row">

                <span className="current-glucose-number">

                  {latestReading.value}

                </span>

                <span className="current-glucose-unit">

                  mg/dL

                </span>


                <span
                  className="current-status-badge"

                  style={{
                    backgroundColor:
                      latestTheme.bg,

                    color:
                      latestTheme.color,

                    borderColor:
                      latestTheme.borderColor
                  }}
                >

                  ● {latestReading.status}

                </span>

              </div>


              <div className="current-glucose-context">

                Context:{' '}

                <strong>
                  {latestReading.context}
                </strong>


                {latestReading.note &&
                  ` • ${latestReading.note}`}

              </div>

            </>

          ) : (

            <div className="current-glucose-val-row">

              <span className="current-glucose-number">
                —
              </span>

              <span className="current-glucose-unit">
                mg/dL
              </span>

            </div>

          )}


          <div className="demo-disclaimer-tag">

            Target Reference Standard:
            70–180 mg/dL

          </div>

        </div>


        {/* ====================================================
            AI RISK
        ===================================================== */}

        <HypoRiskCard
          readings={readings}
          mlPrediction={mlPrediction}
          mlLoading={mlLoading}
        />


        {/* ====================================================
            STATISTICS
        ===================================================== */}

        <div className="card glucose-stats-card">

          <div className="card-header-flex">

            <span className="card-title">

              Day Overview & Metrics

            </span>


            <div className="card-icon-pill teal">

              <Target size={22} />

            </div>

          </div>


          <div className="stats-mini-grid">


            {/* TIME IN RANGE */}

            <div className="stat-mini-item">

              <span className="mini-label">

                Time in Range

              </span>

              <span className="mini-val text-emerald">

                {stats.inRangePct}%

              </span>

              <span className="mini-sub">

                70–180 mg/dL

              </span>

            </div>


            {/* AVERAGE */}

            <div className="stat-mini-item">

              <span className="mini-label">

                Average Glucose

              </span>

              <span className="mini-val">

                {stats.avg}{' '}

                <span className="mini-unit">
                  mg/dL
                </span>

              </span>

              <span className="mini-sub">

                {stats.count} readings

              </span>

            </div>


            {/* LOWEST */}

            <div className="stat-mini-item">

              <span className="mini-label">

                Lowest Reading

              </span>

              <span className="mini-val text-rose">

                {stats.lowest || '—'}{' '}

                <span className="mini-unit">
                  mg/dL
                </span>

              </span>

              <span className="mini-sub">

                Daily minimum

              </span>

            </div>


            {/* HIGHEST */}

            <div className="stat-mini-item">

              <span className="mini-label">

                Highest Reading

              </span>

              <span className="mini-val text-amber">

                {stats.highest || '—'}{' '}

                <span className="mini-unit">
                  mg/dL
                </span>

              </span>

              <span className="mini-sub">

                Daily peak

              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          GLUCOSE CHART
      ======================================================= */}

      <div className="chart-card-wrapper">

        <GlucoseChart
          readings={readings}
        />

      </div>


      {/* ======================================================
          BOTTOM GRID
      ======================================================= */}

      <div className="glucose-bottom-grid">


        {/* ====================================================
            LOG GLUCOSE
        ===================================================== */}

        <div className="card glucose-entry-card">


          <div
            className="card-header-flex"
            style={{
              marginBottom: '1.25rem'
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >

              <div
                className="card-icon-pill blue"
                style={{
                  width: '36px',
                  height: '36px'
                }}
              >

                <Plus size={18} />

              </div>


              <h3 className="card-section-title">

                Log Glucose Reading

              </h3>

            </div>


            <span className="entry-demo-badge">

              MongoDB

            </span>

          </div>


          {/* FORM ERROR */}

          {formError && (

            <div className="form-error-banner">

              <AlertCircle size={16} />

              <span>
                {formError}
              </span>

            </div>

          )}


          <form
            onSubmit={handleSaveReading}
            className="glucose-form"
          >


            {/* GLUCOSE */}

            <div className="form-group">

              <label
                className="form-label"
                htmlFor="glucose-val-input"
              >

                Glucose Level

                <span className="req-star">
                  *
                </span>

              </label>


              <div className="input-with-unit-wrapper">

                <input
                  id="glucose-val-input"
                  type="number"
                  min="20"
                  max="600"
                  step="1"
                  className="form-input glucose-input-large"
                  placeholder="e.g. 118"
                  value={glucoseInput}
                  onChange={(e) =>
                    setGlucoseInput(
                      e.target.value
                    )
                  }
                />


                <span className="input-unit-badge">

                  mg/dL

                </span>

              </div>


              <span className="input-helper-text">

                Standard Range:
                70–180 mg/dL

              </span>

            </div>


            {/* CONTEXT */}

            <div className="form-group">

              <label
                className="form-label"
                htmlFor="glucose-context-select"
              >

                Reading Context

                <span className="req-star">
                  *
                </span>

              </label>


              <select
                id="glucose-context-select"
                className="form-select"
                value={contextInput}
                onChange={(e) =>
                  setContextInput(
                    e.target.value
                  )
                }
              >

                {GLUCOSE_CONTEXT_OPTIONS.map(
                  (opt) => (

                    <option
                      key={opt}
                      value={opt}
                    >
                      {opt}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* DATE/TIME */}

            <div className="form-group">

              <label
                className="form-label"
                htmlFor="glucose-datetime-input"
              >

                Date & Time

              </label>


              <input
                id="glucose-datetime-input"
                type="datetime-local"
                className="form-input"
                value={dateTimeInput}
                onChange={(e) =>
                  setDateTimeInput(
                    e.target.value
                  )
                }
              />

            </div>


            {/* NOTE */}

            <div className="form-group">

              <label
                className="form-label"
                htmlFor="glucose-note-input"
              >

                Meal / Activity Note

                <span className="opt-label">
                  (Optional)
                </span>

              </label>


              <input
                id="glucose-note-input"
                type="text"
                className="form-input"
                placeholder="e.g. 2 Chapati with Paneer Sabzi"
                value={noteInput}
                onChange={(e) =>
                  setNoteInput(
                    e.target.value
                  )
                }
              />

            </div>


            {/* SAVE */}

            <button
              type="submit"
              className="btn-save-glucose"
              disabled={mongoLoading}
            >

              <Plus size={18} />

              <span>

                {mongoLoading
                  ? 'Saving...'
                  : 'Save Reading'}

              </span>

            </button>

          </form>

        </div>


        {/* ====================================================
            RECENT READINGS
        ===================================================== */}

        <div className="card recent-readings-card">


          <div
            className="card-header-flex"
            style={{
              marginBottom: '1.25rem'
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >

              <div
                className="card-icon-pill teal"
                style={{
                  width: '36px',
                  height: '36px'
                }}
              >

                <Activity size={18} />

              </div>


              <div>

                <h3 className="card-section-title">

                  Recent Glucose Readings

                </h3>


                <div className="card-subtext">

                  {readings.length}
                  {' '}
                  total entries

                </div>

              </div>

            </div>


            <button
              className="btn-reset-demo"
              onClick={
                handleResetDemoData
              }
              title="Clear current view"
            >

              <RotateCcw size={14} />

              <span>
                Clear View
              </span>

            </button>

          </div>


          {/* EMPTY */}

          {readings.length === 0 ? (

            <div className="empty-readings-state">

              <Droplets
                size={36}
                color="var(--text-light)"
                style={{
                  margin:
                    '0 auto 0.75rem auto'
                }}
              />


              <p className="empty-readings-title">

                No glucose readings loaded

              </p>


              <p className="empty-readings-desc">

                Enter a glucose reading
                using the form on the left.
                It will be saved to MongoDB.

              </p>

            </div>

          ) : (


            /* ==================================================
               READINGS LIST
            =================================================== */

            <div className="recent-readings-scroll-list">

              {readings.map(
                (item, index) => {

                  const itemTheme =
                    getStatusTheme(
                      item.status
                    );

                  const isNewest =
                    index === 0;


                  return (

                    <div
                      key={item.id}
                      className={`reading-list-row ${
                        isNewest
                          ? 'latest-row'
                          : ''
                      }`}
                    >


                      {/* VALUE */}

                      <div className="reading-value-col">

                        <div className="reading-val-text">

                          {item.value}{' '}

                          <span className="reading-unit-sub">

                            {item.unit}

                          </span>

                        </div>


                        <span
                          className="reading-status-pill"
                          style={{
                            backgroundColor:
                              itemTheme.bg,

                            color:
                              itemTheme.color,

                            borderColor:
                              itemTheme.borderColor
                          }}
                        >

                          {item.status}

                        </span>

                      </div>


                      {/* META */}

                      <div className="reading-meta-col">

                        <div className="reading-context-tag">

                          {item.context}

                        </div>


                        <div className="reading-time-text">

                          {formatReadingDateTime(
                            item.timestamp
                          )}

                        </div>


                        {item.note && (

                          <div className="reading-note-text">

                            {item.note}

                          </div>

                        )}

                      </div>


                      {/* DELETE */}

                      <div className="reading-action-col">

                        <button
                          className="remove-reading-btn"
                          onClick={() =>
                            handleDeleteReading(
                              item.id
                            )
                          }
                          title="Remove reading from current view"
                        >

                          <Trash2 size={16} />

                        </button>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}


          {/* FOOTER */}

          <div className="readings-footer-note">

            <Sparkles
              size={14}
              style={{
                color:
                  'var(--teal-600)',
                flexShrink: 0
              }}
            />

            <span>

              New readings are saved to
              MongoDB and automatically
              sent to the real ML prediction API.

            </span>

          </div>

        </div>

      </div>

    </div>

  );

}