import React, { useState } from 'react';
import { TARGET_MIN, TARGET_MAX, getStatusTheme, formatReadingDateTime } from '../services/glucoseService';
import { TrendingUp, Activity, Info } from 'lucide-react';

/**
 * Responsive SVG Glucose Trend Chart
 * Visualizes glucose readings, target range (70-180 mg/dL), and trend lines.
 */
export default function GlucoseChart({ readings = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!readings || readings.length === 0) {
    return (
      <div className="glucose-chart-empty">
        <Activity size={36} color="var(--text-light)" />
        <p>No glucose readings available. Log a reading below to generate trend chart.</p>
      </div>
    );
  }

  // Sort chronological (oldest to newest for left-to-right display)
  const sortedReadings = [...readings].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // SVG Coordinate space
  const svgWidth = 800;
  const svgHeight = 280;
  const padLeft = 60;
  const padRight = 40;
  const padTop = 30;
  const padBottom = 45;

  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  // Compute dynamic or standard Y bounds
  const rawValues = sortedReadings.map((r) => Number(r.value) || 100);
  const dataMax = Math.max(...rawValues, TARGET_MAX);
  const dataMin = Math.min(...rawValues, TARGET_MIN);

  const yMin = Math.max(30, Math.floor((dataMin - 20) / 10) * 10);
  const yMax = Math.min(320, Math.ceil((dataMax + 30) / 10) * 10);

  const getY = (val) => {
    const clamped = Math.max(yMin, Math.min(yMax, val));
    const ratio = (clamped - yMin) / (yMax - yMin);
    return padTop + chartHeight * (1 - ratio);
  };

  const getX = (index) => {
    if (sortedReadings.length === 1) {
      return padLeft + chartWidth / 2;
    }
    return padLeft + (index / (sortedReadings.length - 1)) * chartWidth;
  };

  // Build line & area path
  const points = sortedReadings.map((r, i) => ({
    x: getX(i),
    y: getY(Number(r.value)),
    reading: r,
    isLatest: r.id === readings[0]?.id
  }));

  const linePathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaPathD =
    points.length > 0
      ? `${linePathD} L ${points[points.length - 1].x} ${padTop + chartHeight} L ${points[0].x} ${padTop + chartHeight} Z`
      : '';

  // Grid lines
  const gridLevels = [60, 70, 100, 140, 180, 220].filter(
    (lvl) => lvl >= yMin && lvl <= yMax
  );

  const targetTopY = getY(TARGET_MAX);
  const targetBottomY = getY(TARGET_MIN);
  const targetHeight = Math.max(0, targetBottomY - targetTopY);

  return (
    <div className="glucose-chart-container">
      <div className="chart-header-row">
        <div className="chart-title-wrap">
          <TrendingUp size={20} className="chart-teal-icon" />
          <h3 className="chart-title">Glucose Trend & In-Range Trajectory</h3>
        </div>
        <div className="chart-legend-row">
          <div className="legend-item">
            <span className="legend-swatch target-zone"></span>
            <span>Target Zone (70–180 mg/dL)</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch latest-point"></span>
            <span>Latest Reading</span>
          </div>
        </div>
      </div>

      <div className="svg-wrapper">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="glucose-trend-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Trend line gradient */}
            <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#12304a" />
              <stop offset="50%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>

            {/* Shaded Area fill gradient */}
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f766e" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#ccfbf1" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Target band pattern */}
            <linearGradient id="targetBandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          {/* Shaded Target In-Range Band (70 - 180 mg/dL) */}
          <rect
            x={padLeft}
            y={targetTopY}
            width={chartWidth}
            height={targetHeight}
            fill="url(#targetBandGrad)"
            rx="4"
          />

          {/* Target Zone Boundary Lines */}
          <line
            x1={padLeft}
            y1={targetTopY}
            x2={padLeft + chartWidth}
            y2={targetTopY}
            stroke="#16a34a"
            strokeDasharray="4 4"
            strokeWidth="1.2"
            opacity="0.85"
          />
          <text
            x={padLeft + chartWidth - 6}
            y={targetTopY - 6}
            textAnchor="end"
            fontSize="10"
            fontWeight="700"
            fill="#16a34a"
          >
            Target Max (180)
          </text>

          <line
            x1={padLeft}
            y1={targetBottomY}
            x2={padLeft + chartWidth}
            y2={targetBottomY}
            stroke="#16a34a"
            strokeDasharray="4 4"
            strokeWidth="1.2"
            opacity="0.85"
          />
          <text
            x={padLeft + chartWidth - 6}
            y={targetBottomY + 14}
            textAnchor="end"
            fontSize="10"
            fontWeight="700"
            fill="#16a34a"
          >
            Target Min (70)
          </text>

          {/* Background Y-Grid lines */}
          {gridLevels.map((lvl) => {
            const yPos = getY(lvl);
            const isTargetLine = lvl === TARGET_MIN || lvl === TARGET_MAX;
            if (isTargetLine) return null; // Already rendered with dashed accent
            return (
              <g key={lvl}>
                <line
                  x1={padLeft}
                  y1={yPos}
                  x2={padLeft + chartWidth}
                  y2={yPos}
                  stroke="var(--border-light)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <text
                  x={padLeft - 10}
                  y={yPos + 3}
                  textAnchor="end"
                  fontSize="11"
                  fontWeight="600"
                  fill="var(--text-light)"
                >
                  {lvl}
                </text>
              </g>
            );
          })}

          {/* Target Min & Max Y-Axis text labels */}
          <text
            x={padLeft - 10}
            y={targetTopY + 4}
            textAnchor="end"
            fontSize="11"
            fontWeight="700"
            fill="#059669"
          >
            180
          </text>
          <text
            x={padLeft - 10}
            y={targetBottomY + 4}
            textAnchor="end"
            fontSize="11"
            fontWeight="700"
            fill="#059669"
          >
            70
          </text>

          {/* Area Fill */}
          <path d={areaPathD} fill="url(#areaGradient)" />

          {/* Trend Line Path */}
          <path
            d={linePathD}
            fill="none"
            stroke="url(#trendGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const val = Number(pt.reading.value);
            const theme = getStatusTheme(pt.reading.status);
            const isHovered = hoveredPoint?.reading.id === pt.reading.id;

            return (
              <g
                key={pt.reading.id || idx}
                className="chart-point-group"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer Glow Ring for Latest Point */}
                {pt.isLatest && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill="#0d9488"
                    opacity="0.25"
                    className="pulse-circle"
                  />
                )}

                {/* Point Main Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : pt.isLatest ? 6 : 4.5}
                  fill={theme.color}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 3 : 2}
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Latest Tag Callout */}
                {pt.isLatest && !isHovered && (
                  <g>
                    <rect
                      x={pt.x - 24}
                      y={pt.y - 28}
                      width="48"
                      height="18"
                      rx="9"
                      fill="var(--primary-900)"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 16}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill="#ffffff"
                    >
                      LATEST
                    </text>
                  </g>
                )}

                {/* X-Axis Time Label */}
                <text
                  x={pt.x}
                  y={padTop + chartHeight + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="var(--text-muted)"
                >
                  {formatReadingDateTime(pt.reading.timestamp).split(',')[1]?.trim() ||
                    formatReadingDateTime(pt.reading.timestamp)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="chart-tooltip-box"
            style={{
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${(hoveredPoint.y / svgHeight) * 100}%`
            }}
          >
            <div className="tooltip-header">
              <span className="tooltip-val">{hoveredPoint.reading.value}</span>
              <span className="tooltip-unit">mg/dL</span>
              <span
                className={`tooltip-badge status-${hoveredPoint.reading.status.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {hoveredPoint.reading.status}
              </span>
            </div>
            <div className="tooltip-context">{hoveredPoint.reading.context}</div>
            <div className="tooltip-time">
              {formatReadingDateTime(hoveredPoint.reading.timestamp)}
            </div>
          </div>
        )}
      </div>

      <div className="chart-footer-note">
        <Info size={14} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
        <span>
          <strong>Target Glucose Standard:</strong> 70–180 mg/dL is the standard target range. Plotted data represents historical health logs.
        </span>
      </div>
    </div>
  );
}
