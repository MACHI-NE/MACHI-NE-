import MainMap from "./components/Map"
import { useState } from "react";
import { ReportForm } from "./components/ReportForm/index.tsx";
import { ReportFormData } from "./types.ts";
import { EmergencyModal } from "./components/EmergencyModal";
import Sidebar from "./components/sidebar"
import { getReports } from "./store/reportStore.ts";
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
  let totalEvents : ReportFormData[] = getReports();
  let initVisEvents : ReportFormData[] = []
  const [totEvents, setTotEvents] = useState(totalEvents);
  const [visEvents, setVisEvents] = useState(initVisEvents);
  const [selectCoord, setSelectCoord] = useState<[number, number] | null>([49.27694889810881, -122.91926811371421]);

  function addReportEvent(newEvent:ReportFormData) 
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
  function removeReportEvent(remEvent:ReportFormData) 
  {
    //refresh total events
    totalEvents = getReports();
    setTotEvents(totalEvents);
    //refresh visible events
    var remIndex = visEvents.indexOf(remEvent, 0); //get index of entry to remove
    if (remIndex > -1) //if the removed entry is in the rendered visible events,
    { //remove it
      visEvents.splice(remIndex, 1);
    }
  }

  function closeEmergencyModal()
  {
    setSelectedReport(null);
  }
  function updateSelectedStatus(updateEvent:ReportFormData, newStatus: 'OPEN' | 'RESOLVED') //for updating status from map pin
  {
    //refresh map page
    totalEvents = getReports();
    setTotEvents(totalEvents);
    // update visible
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
        setSelectedCoord={setSelectCoord}
        onReportSelect={setSelectedReport}
      />
      {showForm && <ReportForm onClose={() => setShowForm(false)} onSubmit={(newEntry:ReportFormData) => addReportEvent(newEntry)}/>}
      {selectedReport && (
        <EmergencyModal
          report={selectedReport}
          onClose={() => closeEmergencyModal()}
          onStatusUpdate={(updatedEvent:ReportFormData, newStatus:'OPEN' | 'RESOLVED') => updateSelectedStatus(updatedEvent,newStatus)}
          onReportRemove={(reportToRemove:ReportFormData) => removeReportEvent(reportToRemove)}
        />
      )}
    </div>
  );
}
