import React, { useState } from 'react';
import { INITIAL_DEMO_HISTORY_RECORDS } from '../data/historyData';
import {
  RECORD_TYPES,
  TIME_PERIODS,
  filterHistoryRecords,
  getRecordTypeMeta,
  formatHistoryDateTime,
  calculateHistoryStats
} from '../services/historyService';
import {
  History as HistoryIcon,
  Search,
  Droplets,
  Utensils,
  Syringe,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Info,
  Calendar
} from 'lucide-react';

/**
 * Health History Page Component
 * Unified timeline review for Glucose, Indian Meals, Insulin doses, and AI Risk predictions.
 */
export default function History() {
  // Master history records state initialized with comprehensive demo dataset
  const [records, setRecords] = useState(INITIAL_DEMO_HISTORY_RECORDS);

  // Filters State
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Expandable record cards tracker (set of expanded record IDs)
  const [expandedRecordIds, setExpandedRecordIds] = useState(new Set());

  // Toast notification state
  const [notification, setNotification] = useState(null);

  // Stats calculation
  const stats = calculateHistoryStats(records);

  // Filtered records
  const filteredRecords = filterHistoryRecords(
    records,
    selectedType,
    selectedPeriod,
    searchQuery
  );

  // Toast helper
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Toggle card expansion
  const toggleExpand = (id) => {
    setExpandedRecordIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Delete individual record
  const handleDeleteRecord = (id, title) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    showToast(`Removed "${title}" record`, 'info');
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedType('All');
    setSelectedPeriod('All');
    setSearchQuery('');
    showToast('Filters reset to default view', 'info');
  };

  // Restore initial demo records
  const handleRestoreDemoData = () => {
    setRecords(INITIAL_DEMO_HISTORY_RECORDS);
    showToast('Restored full demo history dataset', 'info');
  };

  // Render Icon according to record type
  const renderTypeIcon = (type) => {
    switch (type) {
      case 'Glucose':
        return <Droplets size={18} />;
      case 'Meals':
        return <Utensils size={18} />;
      case 'Insulin':
        return <Syringe size={18} />;
      case 'Risk Prediction':
        return <Sparkles size={18} />;
      default:
        return <HistoryIcon size={18} />;
    }
  };

  return (
    <div className="history-page">
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`toast-notification ${notification.type}`}>
          <CheckCircle2 size={18} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header-row" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h2 className="page-header-title">Health History</h2>
          <p className="page-header-subtitle">
            Review your recent glucose, meals, insulin, and risk records.
          </p>
        </div>
      </div>

      {/* Top 4-Metric Overview Grid */}
      <div className="history-metrics-grid">
        <div className="history-metric-card">
          <div className="metric-header-flex">
            <span className="metric-label">Total History Records</span>
            <div className="metric-icon-circle blue">
              <Layers size={18} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{stats.total}</span>
            <span className="metric-sub-tag">Logged Events</span>
          </div>
          <div className="metric-footer-text">{stats.todayCount} records logged today</div>
        </div>

        <div className="history-metric-card">
          <div className="metric-header-flex">
            <span className="metric-label">Glucose Logs</span>
            <div className="metric-icon-circle blue">
              <Droplets size={18} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{stats.glucoseCount}</span>
            <span className="metric-sub-tag">Readings</span>
          </div>
          <div className="metric-footer-text">Target zone: 70–180 mg/dL</div>
        </div>

        <div className="history-metric-card">
          <div className="metric-header-flex">
            <span className="metric-label">Indian Meals</span>
            <div className="metric-icon-circle teal">
              <Utensils size={18} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{stats.mealsCount}</span>
            <span className="metric-sub-tag">Meal Entries</span>
          </div>
          <div className="metric-footer-text">Carb estimations logged</div>
        </div>

        <div className="history-metric-card">
          <div className="metric-header-flex">
            <span className="metric-label">Insulin & AI Risk</span>
            <div className="metric-icon-circle amber">
              <Syringe size={18} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{stats.insulinCount + stats.riskCount}</span>
            <span className="metric-sub-tag">Events</span>
          </div>
          <div className="metric-footer-text">
            {stats.insulinCount} doses • {stats.riskCount} risk evaluations
          </div>
        </div>
      </div>

      {/* Main Filter & Search Panel */}
      <div className="card history-filter-panel">
        {/* Search Bar */}
        <div className="history-search-row">
          <div className="search-box-wrapper" style={{ marginBottom: 0, flex: 1 }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="food-search-input"
              placeholder="Search history (e.g., Roti, 118, Bolus, Breakfast, Pav Bhaji, Lantus)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                Clear
              </button>
            )}
          </div>

          {records.length < INITIAL_DEMO_HISTORY_RECORDS.length && (
            <button
              className="btn-restore-history"
              onClick={handleRestoreDemoData}
              title="Restore default history records"
            >
              <RotateCcw size={14} />
              <span>Restore History Data</span>
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="filter-controls-flex">
          {/* Record Type Filters */}
          <div className="filter-group">
            <span className="filter-group-label">Record Type:</span>
            <div className="filter-pills-row">
              {RECORD_TYPES.map((type) => (
                <button
                  key={type}
                  className={`history-filter-pill ${selectedType === type ? 'active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Time Period Filters */}
          <div className="filter-group">
            <span className="filter-group-label">Time Period:</span>
            <div className="filter-pills-row">
              {TIME_PERIODS.map((period) => (
                <button
                  key={period}
                  className={`history-filter-pill period ${selectedPeriod === period ? 'active' : ''}`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Results Summary Header */}
        <div className="history-results-bar">
          <div>
            Showing <strong>{filteredRecords.length}</strong> of {records.length} records
            {selectedType !== 'All' && <span className="active-tag-chip">Type: {selectedType}</span>}
            {selectedPeriod !== 'All' && <span className="active-tag-chip">Period: {selectedPeriod}</span>}
            {searchQuery && <span className="active-tag-chip">Query: "{searchQuery}"</span>}
          </div>

          {(selectedType !== 'All' || selectedPeriod !== 'All' || searchQuery) && (
            <button className="btn-reset-text" onClick={handleResetFilters}>
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* History Records Timeline List */}
      <div className="history-records-container">
        {filteredRecords.length === 0 ? (
          <div className="card history-empty-state">
            <HistoryIcon size={44} color="var(--text-light)" style={{ margin: '0 auto 0.75rem auto' }} />
            <h4 className="empty-state-title">No records found for the selected filters.</h4>
            <p className="empty-state-desc">
              Try choosing a different record type, expanding the time period to "All", or clearing your search keywords.
            </p>
            <button className="btn-primary" onClick={handleResetFilters} style={{ marginTop: '1rem' }}>
              Reset Filters to View All Records
            </button>
          </div>
        ) : (
          <div className="history-records-list">
            {filteredRecords.map((rec) => {
              const meta = getRecordTypeMeta(rec.type);
              const isExpanded = expandedRecordIds.has(rec.id);

              return (
                <div key={rec.id} className={`history-record-card ${isExpanded ? 'expanded' : ''}`}>
                  {/* Card Header Row */}
                  <div className="record-main-row" onClick={() => toggleExpand(rec.id)}>
                    {/* Type Icon Pill */}
                    <div
                      className="record-type-icon-pill"
                      style={{
                        backgroundColor: meta.bg,
                        color: meta.color,
                        borderColor: meta.border
                      }}
                    >
                      {renderTypeIcon(rec.type)}
                    </div>

                    {/* Value and Title */}
                    <div className="record-core-info">
                      <div className="record-title-row">
                        <span className="record-value-bold">{rec.value}</span>
                        <span
                          className="record-type-chip"
                          style={{
                            backgroundColor: meta.bg,
                            color: meta.color,
                            borderColor: meta.border
                          }}
                        >
                          {rec.type}
                        </span>
                        {rec.status && <span className="record-status-chip">{rec.status}</span>}
                      </div>

                      <div className="record-context-row">
                        <span className="record-context-label">{rec.context}</span>
                        {rec.note && <span className="record-note-preview">• {rec.note}</span>}
                      </div>
                    </div>

                    {/* Date / Time */}
                    <div className="record-timestamp-col">
                      <div className="timestamp-badge">
                        <Clock size={13} />
                        <span>{formatHistoryDateTime(rec.timestamp)}</span>
                      </div>
                    </div>

                    {/* Actions: Expand Toggle & Delete */}
                    <div className="record-action-btns" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="record-icon-btn expand"
                        onClick={() => toggleExpand(rec.id)}
                        title={isExpanded ? 'Collapse record details' : 'Expand record details'}
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>

                      <button
                        className="record-icon-btn delete"
                        onClick={() => handleDeleteRecord(rec.id, rec.title || rec.value)}
                        title="Delete this record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Details Drawer */}
                  {isExpanded && (
                    <div className="record-expanded-details">
                      <div className="expanded-details-grid">
                        <div className="detail-item">
                          <span className="detail-label">Record Identifier</span>
                          <span className="detail-val">{rec.id}</span>
                        </div>

                        <div className="detail-item">
                          <span className="detail-label">Exact Timestamp</span>
                          <span className="detail-val">
                            {new Date(rec.timestamp).toLocaleString()}
                          </span>
                        </div>

                        <div className="detail-item">
                          <span className="detail-label">Category Context</span>
                          <span className="detail-val">{rec.context}</span>
                        </div>

                        {rec.details?.targetRange && (
                          <div className="detail-item">
                            <span className="detail-label">Clinical Target Range</span>
                            <span className="detail-val">{rec.details.targetRange}</span>
                          </div>
                        )}

                        {rec.details?.medicationType && (
                          <div className="detail-item">
                            <span className="detail-label">Medication Class</span>
                            <span className="detail-val">{rec.details.medicationType}</span>
                          </div>
                        )}

                        {rec.details?.brand && (
                          <div className="detail-item">
                            <span className="detail-label">Logged Brand / Method</span>
                            <span className="detail-val">{rec.details.brand}</span>
                          </div>
                        )}

                        {rec.details?.probability && (
                          <div className="detail-item">
                            <span className="detail-label">Hypo Risk Probability</span>
                            <span className="detail-val text-amber">{rec.details.probability}</span>
                          </div>
                        )}
                      </div>

                      {/* Meal items breakdown if applicable */}
                      {rec.details?.items && rec.details.items.length > 0 && (
                        <div className="meal-breakdown-box">
                          <div className="breakdown-title">Meal Composition Breakdown:</div>
                          <div className="breakdown-items-list">
                            {rec.details.items.map((item, idx) => (
                              <div key={idx} className="breakdown-item-row">
                                <span>{item.qty}x {item.name}</span>
                                <span className="breakdown-item-carbs">{item.carbs}g carbs (~{item.cals} kcal)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Risk rationale if applicable */}
                      {rec.details?.rationale && (
                        <div className="risk-rationale-box">
                          <div className="rationale-title">AI Prediction Context:</div>
                          <p className="rationale-text">{rec.details.rationale}</p>
                          <div className="rationale-safety-tag">
                            Non-diagnostic predictive estimate.
                          </div>
                        </div>
                      )}

                      {/* General Note */}
                      {rec.note && !rec.details?.rationale && (
                        <div className="record-full-note">
                          <strong>Note / Annotation:</strong> {rec.note}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Safety Compliance Footer Note */}
      <div className="history-footer-disclaimer">
        <Info size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--text-muted)' }} />
        <span>
          <strong>Health History Notice:</strong> The records shown are patient activity logs. This module is intended for health timeline review only and does not provide automated diagnoses, insulin dosing adjustments, or medical prescriptions.
        </span>
      </div>
    </div>
  );
}
