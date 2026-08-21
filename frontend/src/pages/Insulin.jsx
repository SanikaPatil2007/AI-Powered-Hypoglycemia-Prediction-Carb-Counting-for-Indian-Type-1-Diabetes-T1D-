import React, { useEffect, useState } from 'react';

import {
  INITIAL_DEMO_INSULIN_RECORDS,
  INSULIN_TYPES,
  INSULIN_CONTEXTS
} from '../data/insulinData';

import { mockPatientSummary } from '../data/mockData';

import {
  formatInsulinDateTime,
  getInsulinTypeBadge,
  calculateInsulinSummary
} from '../services/insulinService';

import {
  saveInsulinRecord,
  getInsulinRecords,
  deleteInsulinRecord
} from '../services/insulinApi';

import {
  Syringe,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  Activity,
  Utensils,
  BookOpen,
  Info
} from 'lucide-react';


/**
 * Insulin Tracking Page
 *
 * This page:
 * - Loads insulin records from MongoDB
 * - Saves new records to MongoDB
 * - Deletes records from MongoDB
 * - Displays saved records
 * - Calculates display-only summaries
 *
 * The application does NOT calculate or recommend insulin doses.
 */

export default function Insulin() {

  // ============================================================
  // RECORD STATE
  // ============================================================

  const [records, setRecords] = useState(
    INITIAL_DEMO_INSULIN_RECORDS
  );

  const [loadingRecords, setLoadingRecords] = useState(true);

  // ============================================================
  // FILTER STATE
  // ============================================================

  const [filterType, setFilterType] = useState('All');

  // ============================================================
  // FORM STATE
  // ============================================================

  const getNowLocalDateTime = () => {
    const now = new Date();

    now.setMinutes(
      now.getMinutes() - now.getTimezoneOffset()
    );

    return now.toISOString().slice(0, 16);
  };

  const [typeInput, setTypeInput] =
    useState('Rapid-acting');

  const [unitsInput, setUnitsInput] =
    useState('');

  const [contextInput, setContextInput] =
    useState('Before Meal');

  const [dateTimeInput, setDateTimeInput] =
    useState(getNowLocalDateTime());

  const [noteInput, setNoteInput] =
    useState('');

  const [formError, setFormError] =
    useState('');

  const [notification, setNotification] =
    useState(null);


  // ============================================================
  // TOAST
  // ============================================================

  const showToast = (
    message,
    type = 'success'
  ) => {

    setNotification({
      message,
      type
    });

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };


  // ============================================================
  // LOAD INSULIN RECORDS FROM MONGODB
  // ============================================================

  useEffect(() => {

    const loadInsulinRecords = async () => {

      try {

        setLoadingRecords(true);

        const savedRecords =
          await getInsulinRecords();

        if (
          Array.isArray(savedRecords) &&
          savedRecords.length > 0
        ) {

          const formattedRecords =
            savedRecords.map((record) => ({

              id: record._id,

              _id: record._id,

              type: record.type,

              units: Number(record.units),

              timestamp: record.timestamp,

              context: record.context || '',

              note: record.note || ''

            }));

          setRecords(formattedRecords);

        } else {

          // MongoDB has no records yet.
          // Keep demo records visible.

          setRecords(
            INITIAL_DEMO_INSULIN_RECORDS
          );
        }

      } catch (error) {

        console.error(
          'Failed to load insulin records:',
          error
        );

        setRecords(
          INITIAL_DEMO_INSULIN_RECORDS
        );

        showToast(
          'Could not load saved insulin records. Showing demo records.',
          'info'
        );

      } finally {

        setLoadingRecords(false);

      }
    };


    loadInsulinRecords();

  }, []);


  // ============================================================
  // SUMMARY
  // ============================================================

  const summary =
    calculateInsulinSummary(records);


  // ============================================================
  // SAVE INSULIN RECORD
  // ============================================================

  const handleSaveRecord = async (e) => {

    e.preventDefault();

    setFormError('');


    // ------------------------------------------------------------
    // Validate insulin type
    // ------------------------------------------------------------

    if (!typeInput) {

      setFormError(
        'Please select an insulin type.'
      );

      return;
    }


    // ------------------------------------------------------------
    // Validate units
    // ------------------------------------------------------------

    const val = Number(unitsInput);

    if (
      !unitsInput ||
      isNaN(val)
    ) {

      setFormError(
        'Please enter a valid numeric dose in Units.'
      );

      return;
    }


    if (
      val <= 0 ||
      val > 100
    ) {

      setFormError(
        'Dose must be between 0.5 and 100 Units.'
      );

      return;
    }


    // ------------------------------------------------------------
    // Validate date/time
    // ------------------------------------------------------------

    if (!dateTimeInput) {

      setFormError(
        'Please provide a valid date and time.'
      );

      return;
    }


    const dateObj =
      new Date(dateTimeInput);


    if (
      isNaN(dateObj.getTime())
    ) {

      setFormError(
        'Please provide a valid date and time.'
      );

      return;
    }


    // ------------------------------------------------------------
    // Create frontend record
    // ------------------------------------------------------------

    const newRecord = {

      id:
        'ins-' + Date.now(),

      type:
        typeInput,

      units:
        Math.round(val * 10) / 10,

      timestamp:
        dateObj.toISOString(),

      context:
        contextInput,

      note:
        noteInput.trim() || ''

    };


    // ------------------------------------------------------------
    // SAVE TO MONGODB
    // ------------------------------------------------------------

    try {

      const response =
        await saveInsulinRecord(
          newRecord
        );


      /*
       * Use MongoDB's real ID when backend
       * returns it.
       */

      const savedRecord = {

        ...newRecord,

        id:
          response?.id ||
          response?.record?._id ||
          newRecord.id,

        _id:
          response?.id ||
          response?.record?._id ||
          newRecord.id

      };


      // ----------------------------------------------------------
      // Update UI only after successful save
      // ----------------------------------------------------------

      setRecords((prev) => [
        savedRecord,
        ...prev
      ]);


      // ----------------------------------------------------------
      // Reset form
      // ----------------------------------------------------------

      setUnitsInput('');

      setNoteInput('');

      setDateTimeInput(
        getNowLocalDateTime()
      );

      setFormError('');


      showToast(
        `Recorded ${savedRecord.units} Units of ${savedRecord.type} (${contextInput})`
      );


    } catch (error) {

      console.error(
        'Failed to save insulin record:',
        error
      );

      setFormError(
        error.message ||
        'Failed to save insulin record. Please make sure the backend is running.'
      );

    }

  };


  // ============================================================
  // DELETE INSULIN RECORD
  // ============================================================

  const handleDeleteRecord = async (id) => {

    try {

      /*
       * Demo records may not have MongoDB IDs.
       * Only call DELETE API when we have a real MongoDB ID.
       */

      const record =
        records.find(
          (item) =>
            item.id === id ||
            item._id === id
        );


      if (!record) {
        return;
      }


      const mongoId =
        record._id || record.id;


      /*
       * MongoDB ObjectIds are normally 24 characters.
       * Demo IDs such as ins-123456 are not MongoDB IDs.
       */

      const isMongoId =
        typeof mongoId === 'string' &&
        /^[a-fA-F0-9]{24}$/.test(mongoId);


      if (isMongoId) {

        await deleteInsulinRecord(
          mongoId
        );

      }


      // Remove from UI

      setRecords((prev) =>
        prev.filter(
          (r) =>
            r.id !== id &&
            r._id !== id
        )
      );


      showToast(
        'Insulin record removed',
        'info'
      );


    } catch (error) {

      console.error(
        'Failed to delete insulin record:',
        error
      );

      showToast(
        error.message ||
        'Failed to delete insulin record',
        'error'
      );

    }

  };


  // ============================================================
  // RESTORE DEMO RECORDS
  // ============================================================

  const handleRestoreDemo = () => {

    setRecords(
      INITIAL_DEMO_INSULIN_RECORDS
    );

    showToast(
      'Restored default insulin records',
      'info'
    );

  };


  // ============================================================
  // FILTER RECORDS
  // ============================================================

  const filteredRecords =
    records.filter((r) => {

      if (
        filterType === 'All'
      ) {
        return true;
      }

      return (
        r.type === filterType
      );

    });


  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="insulin-page">

      {/* ======================================================
          TOAST
      ====================================================== */}

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
          PAGE HEADER
      ====================================================== */}

      <div
        className="page-header-row"
        style={{
          marginBottom: '1.25rem'
        }}
      >

        <div>

          <h2 className="page-header-title">
            Insulin Log & Dose Tracking
          </h2>

          <p className="page-header-subtitle">
            Manual logging and tracking of
            user-administered insulin doses.
          </p>

        </div>

      </div>


      {/* ======================================================
          TOP SUMMARY GRID
      ====================================================== */}

      <div className="insulin-top-grid">


        {/* ==================================================
            TODAY'S INSULIN
        ================================================== */}

        <div
          className="card recorded-insulin-card"
        >

          <div className="card-header-flex">

            <div>

              <span className="card-title">
                Today's Recorded Insulin
              </span>

              <div className="card-sub-timestamp">

                {summary.todayEventsCount}

                {summary.todayEventsCount === 1
                  ? ' event'
                  : ' events'}

                {' '}recorded today

              </div>

            </div>

          </div>


          <div className="insulin-split-pills">

            <div className="split-pill rapid">

              <span className="split-label">
                Rapid:
              </span>

              <span className="split-val">
                {summary.rapidUnitsToday} U
              </span>

            </div>


            <div className="split-pill">

              <span className="split-label">
                Long:
              </span>

              <span className="split-val">
                {summary.longUnitsToday} U
              </span>

            </div>

          </div>


          <div className="latest-insulin-sub">

            {summary.latestRecord ? (

              <>

                Most Recent:

                <strong>
                  {summary.latestRecord.units}U
                  {' '}
                  ({summary.latestRecord.type})
                </strong>

                {' • '}

                {formatInsulinDateTime(
                  summary.latestRecord.timestamp
                )}

              </>

            ) : (

              'No recorded insulin events logged yet'

            )}

          </div>


          <div className="demo-safety-tag">

            Personal Dose Log • Prescribed
            Administration

          </div>

        </div>


        {/* ==================================================
            INFORMATION CARD
        ================================================== */}

        <div
          className="card insulin-info-card"
        >

          <div className="card-header-flex">

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

                <BookOpen size={18} />

              </div>


              <h3
                className="card-title"
                style={{
                  color:
                    'var(--primary-900)',
                  fontWeight: 700
                }}
              >

                Insulin Tracking & Safe Practice

              </h3>

            </div>


            <ShieldCheck
              size={20}
              color="var(--primary-700)"
            />

          </div>


          <p className="info-card-text">

            This module allows users to
            manually log prescribed insulin
            injections for personal tracking
            and medical review.

          </p>


          <div className="info-bullet-list">

            <div className="info-bullet-item">

              <span className="bullet-dot teal"></span>

              <span>
                <strong>
                  Rapid-acting:
                </strong>{' '}
                Used according to the
                user's prescribed treatment
                plan.
              </span>

            </div>


            <div className="info-bullet-item">

              <span className="bullet-dot purple"></span>

              <span>

                <strong>
                  Long-acting:
                </strong>{' '}
                Provides background insulin
                according to the prescribed
                treatment plan.

              </span>

            </div>

          </div>


          <div
            className="info-prescribed-notice"
          >

            <Info
              size={14}
              style={{
                flexShrink: 0,
                marginTop: '2px',
                color:
                  'var(--primary-700)'
              }}
            />

            <span>

              <strong>
                Important:
              </strong>{' '}
              Always follow the insulin
              regimen and instructions
              provided by your healthcare
              professional.

            </span>

          </div>

        </div>


      </div>


      {/* ======================================================
          CARB CONTEXT
      ====================================================== */}

      <div
        className="card insulin-context-card"
      >

        <div className="card-header-flex">

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

              <Utensils size={18} />

            </div>


            <div>

              <h3 className="card-section-title">
                Today's Carbohydrate Context
              </h3>

              <div className="card-subtext">
                From Carb Counter
              </div>

            </div>

          </div>


          <Activity
            size={20}
            color="var(--teal-600)"
          />

        </div>


        <div className="context-metric">

          <div className="context-metric-value">

            {mockPatientSummary.todaysCarbsTotal}

            <span className="context-unit">
              g
            </span>

          </div>

          <div className="context-metric-sub">
            4 Indian meals logged
          </div>

        </div>


        <div className="context-disclaimer-note">

          <AlertCircle
            size={13}
            style={{
              flexShrink: 0,
              color:
                'var(--text-muted)'
            }}
          />

          <span>

            Data shown for clinical context
            only. The application does not
            calculate or suggest insulin doses
            from these values.

          </span>

        </div>

      </div>


      {/* ======================================================
          BOTTOM GRID
      ====================================================== */}

      <div className="insulin-bottom-grid">


        {/* ==================================================
            LOG FORM
        ================================================== */}

        <div
          className="card insulin-entry-card"
        >

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
                className="card-icon-pill amber"
                style={{
                  width: '36px',
                  height: '36px'
                }}
              >

                <Plus size={18} />

              </div>


              <h3 className="card-section-title">

                Log Insulin Record

              </h3>

            </div>


            <span className="entry-manual-badge">

              Manual Entry

            </span>

          </div>


          {/* FORM ERROR */}

          {formError && (

            <div
              className="form-error-message"
            >

              <AlertCircle size={16} />

              <span>
                {formError}
              </span>

            </div>

          )}


          <form
            onSubmit={handleSaveRecord}
            className="insulin-form"
          >


            {/* INSULIN TYPE */}

            <div className="form-group">

              <label
                className="form-label"
                htmlFor="insulin-type-select"
              >

                Insulin Type

                <span className="req-star">
                  *
                </span>

              </label>


              <select
                id="insulin-type-select"
                className="form-select"
                value={typeInput}
                onChange={(e) =>
                  setTypeInput(
                    e.target.value
                  )
                }
              >

                {INSULIN_TYPES.map(
                  (type) => (

                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* DOSE */}

            <div className="form-group">

              <label
                className="form-label"
                htmlFor="insulin-units-input"
              >

                Dose Amount

                <span className="req-star">
                  *
                </span>

              </label>


              <div
                className="input-with-unit-wrapper"
              >

                <input
                  id="insulin-units-input"
                  type="number"
                  min="0.5"
                  max="100"
                  step="0.5"
                  className="form-input insulin-input-large"
                  placeholder="e.g. 4"
                  value={unitsInput}
                  onChange={(e) =>
                    setUnitsInput(
                      e.target.value
                    )
                  }
                />

                <span className="input-unit">
                  Units
                </span>

              </div>

            </div>


            {/* CONTEXT */}

            <div className="form-group">

              <label
                className="form-label"
                htmlFor="insulin-context-select"
              >

                Context / Timing

                <span className="req-star">
                  *
                </span>

              </label>


              <select
                id="insulin-context-select"
                className="form-select"
                value={contextInput}
                onChange={(e) =>
                  setContextInput(
                    e.target.value
                  )
                }
              >

                {INSULIN_CONTEXTS.map(
                  (context) => (

                    <option
                      key={context}
                      value={context}
                    >
                      {context}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* DATE TIME */}

            <div className="form-group">

              <label
                className="form-label"
                htmlFor="insulin-datetime-input"
              >

                Date & Time

              </label>


              <input
                id="insulin-datetime-input"
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
                htmlFor="insulin-note-input"
              >

                Note / Medication Brand

                <span className="opt-label">
                  (Optional)
                </span>

              </label>


              <input
                id="insulin-note-input"
                type="text"
                className="form-input"
                placeholder="e.g. Humalog / Novorapid / Lantus"
                value={noteInput}
                onChange={(e) =>
                  setNoteInput(
                    e.target.value
                  )
                }
              />

            </div>


            {/* SAVE BUTTON */}

            <button
              type="submit"
              className="btn-save-insulin"
              disabled={loadingRecords}
            >

              <Plus size={18} />

              <span>
                Save Record
              </span>

            </button>


            <div
              className="form-user-record-notice"
            >

              Entered dose is saved as a
              user-recorded log and is not
              computed or recommended by the
              software.

            </div>

          </form>

        </div>


        {/* ==================================================
            RECENT RECORDS
        ================================================== */}

        <div
          className="card recent-insulin-card"
        >

          <div
            className="card-header-flex"
            style={{
              marginBottom: '1rem'
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

                <Syringe size={18} />

              </div>


              <div>

                <h3 className="card-section-title">

                  Recent Insulin Records

                </h3>


                <div className="card-subtext">

                  {records.length}
                  {' '}
                  total logged events

                </div>

              </div>

            </div>


            {records.length <
              INITIAL_DEMO_INSULIN_RECORDS.length && (

              <button
                className="btn-reset-demo"
                onClick={handleRestoreDemo}
                type="button"
                title="Restore default insulin records"
              >

                <RotateCcw size={14} />

                <span>
                  Restore Records
                </span>

              </button>

            )}

          </div>


          {/* FILTER */}

          <div className="insulin-filter-bar">

            {[
              'All',
              'Rapid-acting',
              'Long-acting'
            ].map((filter) => (

              <button
                key={filter}
                type="button"
                className={`filter-pill ${
                  filterType === filter
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  setFilterType(filter)
                }
              >

                {filter}

              </button>

            ))}

          </div>


          {/* LOADING */}

          {loadingRecords ? (

            <div
              className="empty-readings-state"
            >

              <Syringe
                size={36}
                color="var(--text-light)"
                style={{
                  margin:
                    '0 auto 0.75rem auto'
                }}
              />

              <p className="empty-readings-title">

                Loading saved records...

              </p>

              <p className="empty-readings-desc">

                Getting insulin records
                from the database.

              </p>

            </div>

          ) : filteredRecords.length === 0 ? (

            /* EMPTY */

            <div
              className="empty-readings-state"
            >

              <Syringe
                size={36}
                color="var(--text-light)"
                style={{
                  margin:
                    '0 auto 0.75rem auto'
                }}
              />


              <p className="empty-readings-title">

                No insulin records found

              </p>


              <p className="empty-readings-desc">

                {filterType !== 'All'
                  ? `No records matching filter "${filterType}".`
                  : 'Use the form on the left to record your first insulin event.'
                }

              </p>

            </div>

          ) : (

            /* RECORD LIST */

            <div
              className="recent-insulin-scroll-list"
            >

              {filteredRecords.map(
                (item, index) => {

                  const typeTheme =
                    getInsulinTypeBadge(
                      item.type
                    );

                  const isNewest =
                    index === 0 &&
                    filterType === 'All';


                  return (

                    <div
                      key={
                        item.id ||
                        item._id ||
                        index
                      }
                      className={`insulin-record-row ${
                        isNewest
                          ? 'latest-row'
                          : ''
                      }`}
                    >


                      {/* DOSE */}

                      <div
                        className="insulin-val-col"
                      >

                        <div
                          className="insulin-dose-text"
                        >

                          {item.units}

                          <span
                            className="insulin-unit-label"
                          >
                            Units
                          </span>

                        </div>


                        <span
                          className="insulin-type-badge"
                          style={{
                            backgroundColor:
                              typeTheme.bg,

                            color:
                              typeTheme.color,

                            borderColor:
                              typeTheme.border
                          }}
                        >

                          {typeTheme.label}

                        </span>

                      </div>


                      {/* META */}

                      <div
                        className="insulin-meta-col"
                      >

                        <div
                          className="insulin-context-tag"
                        >

                          {item.context ||
                            'No context'}

                        </div>


                        <div
                          className="insulin-time-text"
                        >

                          {formatInsulinDateTime(
                            item.timestamp
                          )}

                        </div>


                        {item.note && (

                          <div
                            className="insulin-note-text"
                          >

                            {item.note}

                          </div>

                        )}

                      </div>


                      {/* DELETE */}

                      <div
                        className="insulin-action-col"
                      >

                        <button
                          type="button"
                          className="remove-reading-btn"
                          onClick={() =>
                            handleDeleteRecord(
                              item.id ||
                              item._id
                            )
                          }
                          title="Delete this record"
                        >

                          <Trash2
                            size={16}
                          />

                        </button>

                      </div>


                    </div>

                  );

                }
              )}

            </div>

          )}


          {/* DISCLAIMER */}

          <div
            className="insulin-record-disclaimer"
          >

            <ShieldCheck
              size={14}
              style={{
                color:
                  'var(--teal-600)',
                flexShrink: 0
              }}
            />

            <span>

              Records are preserved for
              personal tracking and timeline
              review. Always consult a qualified
              healthcare professional regarding
              insulin treatment.

            </span>

          </div>

        </div>

      </div>

    </div>

  );

}