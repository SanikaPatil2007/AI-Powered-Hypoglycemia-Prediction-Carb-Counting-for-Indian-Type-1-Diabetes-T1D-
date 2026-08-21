import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

import CarbCounter from './pages/CarbCounter';
import Glucose from './pages/Glucose';
import Insulin from './pages/Insulin';
import History from './pages/History';
import About from './pages/About';

/**
 * Main App Component
 * Handles layout and simple tab navigation state.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Render content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;

      case 'carb-counter':
        return <CarbCounter />;

      case 'glucose':
        return <Glucose />;

      case 'insulin':
        return <Insulin />;

      case 'history':
        return <History />;

      case 'about':
        return <About />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      <div className="app-main-layout">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <main className="content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
