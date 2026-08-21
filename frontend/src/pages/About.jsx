import React from 'react';
import {
  Activity,
  Droplets,
  Utensils,
  Syringe,
  History,
  Sparkles,
  ShieldCheck,
  Heart,
  Cpu,
  Globe2,
  Code2,
  CheckCircle2,
  Info,
  Layers,
  FileText
} from 'lucide-react';

/**
 * About Page Component
 * Provides comprehensive project overview, feature summary, AI/ML methodology,
 * Indian dietary context, and medical safety disclaimers.
 */
export default function About() {
  const features = [
    {
      icon: Droplets,
      color: '#0f766e',
      bg: '#ccfbf1',
      border: '#d1e7e5',
      title: 'Glucose Monitoring',
      desc: 'Log blood glucose readings with meal/exercise context, monitor continuous glycemic trends, and track time spent within the standard 70–180 mg/dL target zone.'
    },
    {
      icon: Utensils,
      color: '#0d9488',
      bg: '#ccfbf1',
      border: '#d1e7e5',
      title: 'Indian Food Carb Counter',
      desc: 'Culturally tailored carbohydrate database covering authentic Indian foods, breads, dals, and regional dishes with portion tuning and live daily carb totals.'
    },
    {
      icon: Syringe,
      color: '#0f766e',
      bg: '#ccfbf1',
      border: '#d1e7e5',
      title: 'Insulin Tracking',
      desc: 'Manually record prescribed rapid-acting and long-acting insulin doses, review daily totals, and maintain safe medication logs without automated dosing calculations.'
    },
    {
      icon: History,
      color: '#12304a',
      bg: '#f1f5f9',
      border: '#d1e7e5',
      title: 'Health History',
      desc: 'Centralized health timeline with multi-criteria filtering by record type and time period, expandable record details, and search capabilities.'
    },
    {
      icon: Sparkles,
      color: '#0f766e',
      bg: '#ccfbf1',
      border: '#d1e7e5',
      title: 'AI Hypo Risk Prediction',
      desc: 'Machine learning prediction engine designed to estimate hypoglycemia probability in upcoming hours, promoting timely preventive awareness.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Header */}
      <div className="about-hero-card">
        <div className="about-hero-content">
          <div className="about-tag">
            <Activity size={14} />
            <span>Digital Health Assistant</span>
          </div>
          <h2 className="about-hero-title">T1D Care Assistant</h2>
          <p className="about-hero-subtitle">
            AI-powered support for glucose monitoring, carbohydrate tracking, and hypoglycemia risk awareness.
          </p>
        </div>
      </div>

      {/* 1. About the Project */}
      <div className="card about-section-card">
        <div className="section-heading-row">
          <div className="section-icon-pill blue">
            <Heart size={20} />
          </div>
          <div>
            <h3 className="section-title">About the Project</h3>
            <p className="section-subtitle">Dedicated digital health companion for Type 1 Diabetes management</p>
          </div>
        </div>

        <p className="about-paragraph">
          <strong>T1D Care Assistant</strong> is a specialized digital health platform engineered to help Type 1 Diabetes patients easily log, visualize, and organize critical diabetes data in one unified dashboard. By seamlessly bridging daily glucose trends, authentic Indian carbohydrate calculations, and manual insulin tracking, the platform empowers patients to maintain glycemic control with greater clarity and confidence.
        </p>

        <div className="about-pillars-grid">
          <div className="pillar-box">
            <CheckCircle2 size={18} className="pillar-icon" />
            <div>
              <div className="pillar-title">Unified Tracking</div>
              <div className="pillar-desc">Consolidate glucose, meals, and insulin in a single coherent timeline.</div>
            </div>
          </div>
          <div className="pillar-box">
            <CheckCircle2 size={18} className="pillar-icon" />
            <div>
              <div className="pillar-title">Culturally Relevant</div>
              <div className="pillar-desc">Accurate carbohydrate estimates calibrated for Indian home cooking.</div>
            </div>
          </div>
          <div className="pillar-box">
            <CheckCircle2 size={18} className="pillar-icon" />
            <div>
              <div className="pillar-title">Predictive Awareness</div>
              <div className="pillar-desc">Early warnings for potential hypoglycemic drops before they occur.</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Features */}
      <div className="card about-section-card">
        <div className="section-heading-row">
          <div className="section-icon-pill teal">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="section-title">Key Core Features</h3>
            <p className="section-subtitle">Comprehensive modules designed for daily diabetes management</p>
          </div>
        </div>

        <div className="features-grid">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="feature-item-card">
                <div
                  className="feature-icon-wrapper"
                  style={{
                    backgroundColor: item.bg,
                    color: item.color,
                    borderColor: item.border
                  }}
                >
                  <Icon size={22} />
                </div>
                <h4 className="feature-title">{item.title}</h4>
                <p className="feature-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column: AI / ML & Indian Context */}
      <div className="about-two-col-grid">
        {/* 3. AI / Machine Learning Section */}
        <div className="card about-sub-card">
          <div className="section-heading-row">
            <div className="section-icon-pill purple">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="section-title">AI & Predictive Modeling</h3>
              <p className="section-subtitle">Machine learning for hypoglycemia risk estimation</p>
            </div>
          </div>

          <p className="about-paragraph">
            The platform is designed to incorporate machine learning models that analyze time-series glucose dynamics, recent carbohydrate absorption curves, and historical insulin boluses. By identifying patterns that precede rapid glucose declines, the system calculates estimated risk probabilities (Low, Moderate, High) to prompt proactive patient verification.
          </p>

          <div className="notice-pill purple">
            <Sparkles size={16} />
            <span>
              <strong>Predictive Awareness:</strong> AI predictions provide auxiliary trend awareness and are strictly non-diagnostic.
            </span>
          </div>
        </div>

        {/* 4. Indian Context Section */}
        <div className="card about-sub-card">
          <div className="section-heading-row">
            <div className="section-icon-pill teal">
              <Globe2 size={20} />
            </div>
            <div>
              <h3 className="section-title">Indian Dietary Optimization</h3>
              <p className="section-subtitle">Culturally tailored carbohydrate intelligence</p>
            </div>
          </div>

          <p className="about-paragraph">
            Traditional Indian diets are rich in complex carbohydrate profiles consisting of wheat rotis, regional rice preparations, lentil gravies (dals), and festive sweets. Generic global carb counters frequently lack entries for common Indian staples like Phulka, Dal Tadka, Poha, Idli, and Pav Bhaji. T1D Care Assistant provides tailored serving size metrics and carbohydrate counts to deliver localized accuracy.
          </p>

          <div className="notice-pill teal">
            <Utensils size={16} />
            <span>
              <strong>Regional Coverage:</strong> Covers North, South, and Street Food staples with standard gram portions.
            </span>
          </div>
        </div>
      </div>

      {/* 5. Medical Safety Disclaimer Card */}
      <div className="card about-disclaimer-card">
        <div className="disclaimer-header-row">
          <ShieldCheck size={24} className="disclaimer-accent-icon" />
          <h3 className="disclaimer-card-title">Medical Safety Notice</h3>
        </div>

        <p className="disclaimer-card-body">
          This application is a prototype for educational purposes and is not a substitute for professional medical advice or treatment.
        </p>
      </div>

      {/* 6. Project & Architecture Information */}
      <div className="card about-section-card">
        <div className="section-heading-row">
          <div className="section-icon-pill blue">
            <Code2 size={20} />
          </div>
          <div>
            <h3 className="section-title">Project & Technical Architecture</h3>
            <p className="section-subtitle">Frontend engineering and design standards</p>
          </div>
        </div>

        <div className="tech-specs-grid">
          <div className="tech-spec-item">
            <span className="spec-label">Frontend Framework</span>
            <span className="spec-val">React 18 & Vite</span>
          </div>
          <div className="tech-spec-item">
            <span className="spec-label">Styling System</span>
            <span className="spec-val">Custom CSS Design Tokens</span>
          </div>
          <div className="tech-spec-item">
            <span className="spec-label">UI Iconography</span>
            <span className="spec-val">Lucide Icons</span>
          </div>
          <div className="tech-spec-item">
            <span className="spec-label">Typography</span>
            <span className="spec-val">Plus Jakarta Sans & Inter</span>
          </div>
          <div className="tech-spec-item">
            <span className="spec-label">Chart Rendering</span>
            <span className="spec-val">Responsive Vector SVG</span>
          </div>
          <div className="tech-spec-item">
            <span className="spec-label">State & Data Layers</span>
            <span className="spec-val">Modular Service Architecture</span>
          </div>
        </div>
      </div>
    </div>
  );
}
