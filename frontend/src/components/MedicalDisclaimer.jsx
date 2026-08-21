import React from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * Medical Disclaimer Component
 * Provides a concise, non-intrusive medical notice.
 */
export default function MedicalDisclaimer() {
  return (
    <div className="disclaimer-banner" role="note">
      <ShieldCheck className="disclaimer-icon" size={20} />
      <div className="disclaimer-content">
        <p>
          This application is a prototype for educational purposes and is not a substitute for professional medical advice or treatment.
        </p>
      </div>
    </div>
  );
}
