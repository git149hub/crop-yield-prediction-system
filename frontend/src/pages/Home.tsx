import PredictionForm from "../components/PredictionForm";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-gradient-bg" />

      <main className="home-layout">
        <section className="left-section">
          <div className="brand-badge">
            <span className="badge-dot"></span>
            <span>Powered by Machine Learning</span>
          </div>

          <h1 className="hero-title">
            AI Crop Yield
            <br />
            <span className="title-highlight">Prediction</span>
          </h1>

          <p className="hero-description">
            Predict crop productivity using machine learning models trained on
            real agricultural data — trusted by farmers and researchers across India.
          </p>

          <ul className="feature-list">
            <li className="feature-item">
              <div className="feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <strong>Accurate ML Predictions</strong>
                <p>XGBoost model trained on 10+ years of ICRISAT agricultural data</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <strong>Data-Driven Farming Insights</strong>
                <p>State, season, and crop-specific analysis for precise planning</p>
              </div>
            </li>
            <li className="feature-item">
              <div className="feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <strong>Easy-to-Use Interface</strong>
                <p>Get instant predictions in seconds — no expertise required</p>
              </div>
            </li>
          </ul>

          <div className="stats-row">
            <div className="stat">
              <span className="stat-value">22+</span>
              <span className="stat-label">Indian States</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">16+</span>
              <span className="stat-label">Crop Types</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">95%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
        </section>

        <section className="right-section">
          <PredictionForm />
        </section>
      </main>

    </div>
  );
}
