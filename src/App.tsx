
import MainMap from "./components/Map"
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
import { ReportFormData } from "./types.ts";





export default function App() {
  const [showForm, setShowForm] = useState(false);

  return (
      <div>
      <MainMap eventReportList={testingList}
      setVisiblePoints={
        (lis) => {
          console.clear()
          console.log(lis, ",")
        }

      }
      selectedPoint={testing}
      />
    </div>
  )
  //   <div>
  //     <button onClick={() => setShowForm(!showForm)}>
  //       {showForm ? "Hide Report Form" : "View Report Form"}
  //     </button>
  //     {showForm && <ReportForm onClose={() => setShowForm(false)} />}
  //   </div>
  // );
}


const testingList: ReportFormData[] = [
  {
    location: "Downtown Vancouver",
    type: "Community Event",
    time: "10:00 AM",
    description: "Community Cleanup Event",
    witnessName: "John Doe",
    witnessContact: "john.doe@example.com",
    customType: "",
    image: null,
    coordinates: [49.2827, -123.1207],
  },
  {
    location: "Kitsilano Beach Park",
    type: "Market",
    time: "9:00 AM",
    description: "Local Farmers Market",
    witnessName: "Jane Smith",
    witnessContact: "jane.smith@example.com",
    customType: "",
    image: null,
    coordinates: [49.2632, -123.0830],
  },
  // New Fraser Valley Entries
  {
    location: "Abbotsford Exhibition Park",
    type: "Sports Event",
    time: "2:00 PM",
    description: "Youth Soccer Tournament",
    witnessName: "Chris Johnson",
    witnessContact: "chris.johnson@example.com",
    customType: "",
    image: null,
    coordinates: [49.0504, -122.2853],
  },
  {
    location: "Chilliwack Corn Maze",
    type: "Festival",
    time: "1:00 PM",
    description: "Harvest Festival",
    witnessName: "Ella Brown",
    witnessContact: "ella.brown@example.com",
    customType: "",
    image: null,
    coordinates: [49.1579, -121.9572],
  },
  {
    location: "Harrison Hot Springs",
    type: "Recreational Event",
    time: "11:00 AM",
    description: "Lake Cleanup Initiative",
    witnessName: "Mike Davis",
    witnessContact: "mike.davis@example.com",
    customType: "",
    image: null,
    coordinates: [49.3008, -121.7851],
  },
  {
    location: "Mission Raceway Park",
    type: "Motorsport Event",
    time: "3:00 PM",
    description: "Drag Racing Championship",
    witnessName: "Sandra Lee",
    witnessContact: "sandra.lee@example.com",
    customType: "",
    image: null,
    coordinates: [49.1239, -122.3025],
  },
  {
    location: "Langley Event Centre",
    type: "Community Gathering",
    time: "5:00 PM",
    description: "Charity Dinner",
    witnessName: "Olivia Martin",
    witnessContact: "olivia.martin@example.com",
    customType: "",
    image: null,
    coordinates: [49.1013, -122.6578],
  },
];

const testing: ReportFormData = {
    location: "Downtown Vancouver",
    type: "Community Event",
    time: "10:00 AM",
    description: "Community Cleanup Event",
    witnessName: "John Doe",
    witnessContact: "john.doe@example.com",
    customType: "",
    image: null,
    coordinates: [49.2827, -123.1207],
  }
  );
}


/*
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
*/
