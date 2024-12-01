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
  let initVisEvents : ReportFormData[] = []
  const [totEvents, setTotEvents] = useState(totalEvents);
  const [visEvents, setVisEvents] = useState(initVisEvents);
  const [selectCoord, setSelectCoord] = useState<[number, number] | null>([49.27694889810881, -122.91926811371421]);

  function addReportEvent(newEvent:ReportFormData) // NOTE: changing report status does not update the sidebar
  {
    setTotEvents((prevTotEvents)=>{
      var temp = prevTotEvents.slice();
      temp.push(newEvent);
      return temp;
    });
    setVisEvents((prevVisEvents)=>{
      var temp = prevVisEvents.slice();
      temp.push(newEvent);
      return temp;
    });
  }

  function closeEmergencyModal()
  {
    setSelectedReport(null);
    //refresh map page
    totalEvents = localStorage.getItem('reports') ? JSON.parse(localStorage.getItem('reports') || '[]') : testingList;
    setTotEvents(totalEvents);
  }
  function updateVisEventStatus(updateEvent:ReportFormData, newStatus: 'OPEN' | 'RESOLVED') //for updating status from map pin
  {
    var oldIndex = visEvents.indexOf(updateEvent, 0); //get index of old entry in unrefreshed visible events
    var newEntry : ReportFormData = { //create new copy if updated status
      location: updateEvent.location,
      type: updateEvent.type,
      time: updateEvent.time,
      description: updateEvent.description,
      witnessName: updateEvent.witnessName,
      witnessContact: updateEvent.witnessContact,
      customType: updateEvent.customType,
      image: updateEvent.image, 
      coordinates: updateEvent.coordinates,
      status: newStatus};
    if (oldIndex > -1)
    {
      visEvents[oldIndex] = newEntry;
    }
  }

  function refreshVisibleEvents(visEventsList:ReportFormData[])
  {
    setVisEvents(visEventsList);
  }
  function clickSidebarItem(clickedEvent:ReportFormData)
  {
    setSelectedReport(clickedEvent); // display info
    // highlight on map
    var newCoords : [number, number] | null = clickedEvent.coordinates;
    // pass new coords to map
    setSelectCoord((oldCoords)=>{
      var temp = oldCoords;
      temp = newCoords;
      return temp;
    });
  }

  return (
    <div>
      <Sidebar 
        viewableEventList={visEvents}
        totalEventList={totEvents}
        onReportSelect={(clickedEvent) =>{
          clickSidebarItem(clickedEvent)
        }}
        onReportAdd={addReportEvent}
      />
      <MainMap 
        eventReportList={totEvents}
        setVisiblePoints={(lis) => {
          console.clear()
          refreshVisibleEvents(lis)
        }}
        selectedCoord={selectCoord}
        onReportSelect={setSelectedReport}
      />
      {showForm && <ReportForm onClose={() => setShowForm(false)} onSubmit={(newEntry:ReportFormData) => addReportEvent(newEntry)}/>}
      {selectedReport && (
        <EmergencyModal
          report={selectedReport}
          onClose={() => closeEmergencyModal()}
          onStatusUpdate={(updatedEvent:ReportFormData, newStatus:'OPEN' | 'RESOLVED') => updateVisEventStatus(updatedEvent,newStatus)}
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
