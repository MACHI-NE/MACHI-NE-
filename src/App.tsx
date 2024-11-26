import { useState } from "react";
import { ReportForm } from "./components/ReportForm/index.tsx";

export default function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Report Form" : "View Report Form"}
      </button>
      {showForm && <ReportForm onClose={() => setShowForm(false)} />}
    </div>
  );
}