import React from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Droplets, 
  Syringe, 
  History, 
  Info,
  ShieldCheck
} from 'lucide-react';

/**
 * Sidebar Component
 * Provides clean navigation with responsive mobile drawer support.
 */
export default function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'carb-counter', label: 'Carb Counter', icon: Utensils },
    { id: 'glucose', label: 'Glucose', icon: Droplets },
    { id: 'insulin', label: 'Insulin', icon: Syringe },
    { id: 'history', label: 'History', icon: History },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside className={`app-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-section-label">Navigation Menu</div>
        <ul className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={18} className="nav-icon" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-footer-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <ShieldCheck size={16} color="var(--primary-800)" />
            <div className="sidebar-footer-title">Indian T1D Focus</div>
          </div>
          <p className="sidebar-footer-desc">
            Tailored carbohydrate estimations for traditional Indian meals & smart prediction.
          </p>
        </div>
      </aside>
    </>
  );
}
