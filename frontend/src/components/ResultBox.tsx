// import "./ResultBox.css";

// interface ResultBoxProps {
//   yieldValue: number;
//   modelUsed: string;
//   unit: string;
// }

// export default function ResultBox({ yieldValue, modelUsed, unit }: ResultBoxProps) {
//   return (
//     <div className="result-box">
//       <div className="result-icon">
//         <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
//           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="#16a34a"/>
//         </svg>
//       </div>
//       <div className="result-content">
//         <p className="result-label">Predicted Yield</p>
//         <p className="result-value">
//           {yieldValue.toFixed(2)} <span className="result-unit">{unit}</span>
//         </p>
//         <div className="result-meta">
//           <span className="model-badge">Model Used: {modelUsed}</span>
//         </div>
//       </div>
//     </div>
//   );
// }


import "./ResultBox.css";

interface ResultBoxProps {
  yieldValue: number;
  production: number;
  unit: string;
}

export default function ResultBox({
  yieldValue,
  production,
  unit,
}: ResultBoxProps) {
  return (
    <div className="result-box">
      <div className="result-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
            fill="#16a34a"
          />
        </svg>
      </div>

      <div className="result-content">
        <p className="result-label">Predicted Yield</p>

        <p className="result-value">
          {yieldValue.toFixed(2)}{" "}
          <span className="result-unit">{unit}</span>
        </p>

        <div className="result-meta">
          <span className="model-badge">
            Estimated Production: {production.toFixed(2)} tons
          </span>
        </div>
      </div>
    </div>
  );
}