/*
(setup/register)
import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
        </Routes>
    );
};

export default App;

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
(main)
*/


import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import { ReportForm } from "./components/ReportForm/index.tsx";

const App: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="login"
          element={
            <>
              <Login />
              <button onClick={() => setShowForm(!showForm)}>
                {showForm ? "Hide Report Form" : "View Report Form"}
              </button>
              {showForm && <ReportForm onClose={() => setShowForm(false)} />}
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
