import MainMap from "./components/Map"
import { useState } from "react";
import { ReportForm } from "./components/ReportForm/index.tsx";
import { ReportFormData } from "./types.ts";
import { EmergencyModal } from "./components/EmergencyModal";
import Sidebar from "./components/sidebar"
// import MainMap from "./components/Map"
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Register from "./register";
// import Login from "./login";

// const App: React.FC = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="register" element={<Register />} />
//       <Route path="login" element={<Login />} />
//     </Routes>
//   );
// };

// export default App;
export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportFormData | null>(null);
  let totalEvents : ReportFormData[] = localStorage.getItem('reports') ? JSON.parse(localStorage.getItem('reports') || '[]') : testingList;
  const [totEvents, setTotEvents] = useState(totalEvents);
  let visibleEvents : ReportFormData[] = localStorage.getItem('reports') ? JSON.parse(localStorage.getItem('reports') || '[]') : testingList;
  const [visEvents, setVisEvents] = useState(visibleEvents);

  function addReportEvent(newEvent:ReportFormData) // NOTE: changing report status does not update the sidebar
  {
    setTotEvents((prevTotEvents)=>{
      var temp = prevTotEvents.slice();
      temp.push(newEvent);
      return temp;
    });
  }

  function closeEmergencyModal(closedEntry:ReportFormData)
  {
    console.log(closedEntry);
    setSelectedReport(null);
    //refresh page
    totalEvents = localStorage.getItem('reports') ? JSON.parse(localStorage.getItem('reports') || '[]') : testingList;
    setTotEvents(totalEvents);
  }

  function refreshVisibleEvents(visEventsList:ReportFormData[])
  {
    visibleEvents = visEventsList.slice();
    setVisEvents(visEventsList);
  }

  return (
    <div>
      <Sidebar 
        displayedEventList={visEvents}
        onReportSelect={setSelectedReport}
        onReportAdd={addReportEvent}
      />
      <MainMap 
        eventReportList={totEvents}
        setVisiblePoints={(lis) => {
          console.clear()
          refreshVisibleEvents(lis)
        }}
        selectedPoint={testing}
        onReportSelect={setSelectedReport}
      />
      {showForm && <ReportForm onClose={() => setShowForm(false)} onSubmit={(newEntry:ReportFormData) => addReportEvent(newEntry)}/>}
      {selectedReport && (
        <EmergencyModal
          report={selectedReport}
          onClose={(closedEntry:ReportFormData) => closeEmergencyModal(closedEntry)}
        />
      )}
    </div>
  );
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
    image: "https://example.com/image.png", // Changed from File to URL string
    coordinates: [49.2827, -123.1207],
    status: 'OPEN'
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
    status: 'OPEN'
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
    status: 'OPEN'
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
    status: 'OPEN'
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
    status: 'OPEN'
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
    status: 'OPEN'
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
    status: 'OPEN'
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
  status: 'OPEN'
}
