


import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s.5-2 3-3C16 2 17 8 17 8z"
                fill="#4ade80"
              />
            </svg>
          </div>

          <span className="footer-brand-name">CropAI</span>
        </div>

        <p className="footer-tagline">
          AI-Powered Crop Yield Prediction Platform
        </p>

        <div className="footer-links">
          <span>XGBoost ML Model</span>
          <span className="footer-dot">·</span>

          <span>ICRISAT Dataset</span>
          <span className="footer-dot">·</span>

          <span>22 Indian States</span>
          <span className="footer-dot">·</span>

          <span>16 Crop Types</span>
        </div>

        <p className="footer-copy">
          © 2026 CropAI. Built with FastAPI, React, MongoDB & XGBoost.
        </p>
      </div>
    </footer>
  );
}