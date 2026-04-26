
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-inner">
          <div className="about-badge">About This Project</div>

          <h1 className="about-title">
            AI-Based Crop Yield Prediction System
          </h1>

          <p className="about-tagline">
            A full-stack machine learning application that predicts crop yield
            using historical agricultural data, helping improve planning,
            productivity, and decision-making.
          </p>
        </div>
      </div>

      <div className="about-container">
        <div className="about-grid">

          {/* PURPOSE */}
          <section className="about-card highlight-card">
            <div className="card-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s.5-2 3-3C16 2 17 8 17 8z" fill="white"/>
              </svg>
            </div>

            <h2>Project Purpose</h2>

            <p>
              This platform predicts agricultural crop yield based on crop type,
              state, district, season, and cultivated area using machine learning.
            </p>

            <p>
              It is designed to support farmers, analysts, and researchers with
              faster, data-driven insights for smarter crop planning.
            </p>
          </section>

          {/* DATASET */}
          <section className="about-card">
            <div className="card-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h2>Dataset Used</h2>

            <ul className="about-list">
              <li>
                <strong>Source:</strong> ICRISAT + Government of India agricultural datasets
              </li>
              <li>
                <strong>Coverage:</strong> 10+ years of crop records across Indian states
              </li>
              <li>
                <strong>Features:</strong> Crop, State, District, Season, Area, Production, Yield
              </li>
              <li>
                <strong>Crops:</strong> Rice, Wheat, Maize, Sugarcane, Cotton, Groundnut and more
              </li>
              <li>
                <strong>Records:</strong> ~246,000 cleaned data rows
              </li>
            </ul>
          </section>

          {/* MODEL */}
          <section className="about-card">
            <div className="card-icon amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h2>ML Model — XGBoost</h2>

            <p>
              The prediction engine uses <strong>XGBoost</strong>, a powerful
              gradient boosting algorithm known for high performance on structured data.
            </p>

            <ul className="about-list">
              <li><strong>Model:</strong> Gradient Boosted Trees</li>
              <li><strong>Strength:</strong> Handles nonlinear patterns efficiently</li>
              <li><strong>Accuracy:</strong> ~95% model performance</li>
              <li><strong>Input Features:</strong> Crop, state, district, season, area</li>
              <li><strong>Libraries:</strong> scikit-learn, pandas, numpy</li>
            </ul>
          </section>

          {/* TECH STACK */}
          <section className="about-card">
            <div className="card-icon teal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h2>Technology Stack</h2>

            <div className="tech-grid">
              <div className="tech-item">
                <span className="tech-tag frontend">Frontend</span>
                <span>React.js + TypeScript</span>
              </div>

              <div className="tech-item">
                <span className="tech-tag backend">Backend</span>
                <span>FastAPI (Python)</span>
              </div>

              <div className="tech-item">
                <span className="tech-tag ml">ML</span>
                <span>XGBoost, scikit-learn</span>
              </div>

              <div className="tech-item">
                <span className="tech-tag api">API</span>
                <span>REST API + Axios</span>
              </div>

              <div className="tech-item">
                <span className="tech-tag charts">Charts</span>
                <span>Recharts</span>
              </div>

              <div className="tech-item">
                <span className="tech-tag storage">Storage</span>
                <span>MongoDB Atlas</span>
              </div>
            </div>
          </section>
        </div>

        {/* API SECTION */}
        <section className="team-section">
          <h2 className="team-title">API Reference</h2>

          <div className="api-cards">

            <div className="api-card">
              <div className="api-method post">POST</div>

              <div className="api-info">
                <code className="api-endpoint">/predict</code>
                <p>Predict crop yield using user inputs.</p>

                <pre className="api-body">{`{
  "crop_type": "Rice",
  "state": "Punjab",
  "district": "Ludhiana",
  "season": "Rabi",
  "area": 2.5
}`}</pre>
              </div>
            </div>

            <div className="api-card">
              <div className="api-method get">GET</div>

              <div className="api-info">
                <code className="api-endpoint">/history</code>
                <p>Fetch latest saved prediction records.</p>
              </div>
            </div>

          </div>
        </section>

        <footer className="about-footer">
          Built with React, FastAPI, MongoDB & Machine Learning • 2026
        </footer>

      </div>
    </div>
  );
}