import React from 'react';
import { Activity, Menu, X } from 'lucide-react';

/**
 * Header Component
 * Displays brand logo, prototype badge, user avatar, and mobile toggle.
 */
export default function Header({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="mobile-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="brand-logo">
          <div className="brand-icon-wrapper">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="brand-title">T1D Care Assistant</h1>
            <div className="brand-subtitle">AI-Powered Diabetes Support</div>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="badge-prototype">
          <span className="badge-dot"></span>
          <span>Assistant Active</span>
        </div>

        <div className="user-profile-summary">
          <div className="user-avatar">RK</div>
          <span className="user-name">Rajesh Kumar</span>
        </div>
      </div>
    </header>
  );
}
