import { useState } from "react";
import { ReportForm } from "./components/ReportForm/index.tsx";

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setShowForm(false);
      setIsAnimatingOut(false);
    }, 190);
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Report Form" : "View Report Form"}
      </button>
      {(showForm || isAnimatingOut) && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-slate-600 bg-opacity-50 backdrop-blur-sm ${isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'
            }`}
          onClick={(e) => {
            const target = e.target as HTMLDivElement;
            if (target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <ReportForm onClose={handleClose} />
        </div>
      )}
    </div>
  );
}