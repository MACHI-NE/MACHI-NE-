import MainMap from "./components/Map"
import { useState } from "react";
import { ReportForm } from "./components/ReportForm/index.tsx";
import { ReportFormData } from "./types.ts";
import { EmergencyModal } from "./components/EmergencyModal";
import Sidebar from "./components/sidebar"
import { getReports } from "./store/reportStore.ts";
import { initializePassword } from './store/reportStore';

export default function App() {
  initializePassword();

  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportFormData | null>(null);
  let totalEvents: ReportFormData[] = getReports();
  const initVisEvents: ReportFormData[] = []
  const [totEvents, setTotEvents] = useState(totalEvents);
  const [visEvents, setVisEvents] = useState(initVisEvents);
  const [selectCoord, setSelectCoord] = useState<[number, number] | null>(null);

  function addReportEvent(newEvent: ReportFormData) {
    setTotEvents((prevTotEvents) => {
      const temp = prevTotEvents.slice();
      temp.push(newEvent);
      return temp;
    });
    setVisEvents((prevVisEvents) => {
      const temp = prevVisEvents.slice();
      temp.push(newEvent);
      return temp;
    });
  }
  function removeReportEvent(remEvent: ReportFormData) {
    //refresh total events
    totalEvents = getReports();
    setTotEvents(totalEvents);
    //refresh visible events
    const remIndex = visEvents.indexOf(remEvent, 0); //get index of entry to remove
    if (remIndex > -1) //if the removed entry is in the rendered visible events,
    { //remove it
      visEvents.splice(remIndex, 1);
    }
  }

  function closeEmergencyModal() {
    setSelectedReport(null);
  }
  function updateSelectedStatus(updateEvent: ReportFormData, oldReport: ReportFormData) //for updating status from map pin
  {
    //refresh map page
    totalEvents = getReports();
    setTotEvents(totalEvents);
    //update visible
    console.log("old event:");
    console.log(oldReport);
    const oldIndex = visEvents.indexOf(oldReport, 0); //get index of old entry in unrefreshed visible events

    if (oldIndex > -1) {
      console.log("vis refreshed");
      visEvents[oldIndex] = updateEvent;
    }
  }

  function refreshVisibleEvents(visEventsList: ReportFormData[]) {
    setVisEvents(visEventsList);
  }
  function clickSidebarItem(clickedEvent: ReportFormData) {
    setSelectedReport(clickedEvent); // display info
    // highlight on map
    const newCoords: [number, number] | null = clickedEvent.coordinates;
    // pass new coords to map
    setSelectCoord((oldCoords) => {
      let temp = oldCoords;
      temp = newCoords;
      return temp;
    });
  }

  function handleReportEdit(oldReport: ReportFormData, newReport: ReportFormData) {
    setTotEvents(prevTotEvents =>
      prevTotEvents.map(report =>
        (report.coordinates?.[0] === oldReport.coordinates?.[0] &&
          report.coordinates?.[1] === oldReport.coordinates?.[1] &&
          report.time === oldReport.time)
          ? newReport
          : report
      )
    );

    setVisEvents(prevVisEvents =>
      prevVisEvents.map(report =>
        (report.coordinates?.[0] === oldReport.coordinates?.[0] &&
          report.coordinates?.[1] === oldReport.coordinates?.[1] &&
          report.time === oldReport.time)
          ? newReport
          : report
      )
    );

    setSelectedReport(newReport);
  }

  return (
    <div>
      <Sidebar
        viewableEventList={visEvents}
        totalEventList={totEvents}
        onReportSelect={(clickedEvent) => {
          clickSidebarItem(clickedEvent)
        }}
        onReportAdd={addReportEvent}
      />
      <MainMap
        eventReportList={totEvents}
        setVisiblePoints={(lis) => {
          refreshVisibleEvents(lis)
        }}
        selectedCoord={selectCoord}
        setSelectedCoord={setSelectCoord}
        onReportSelect={setSelectedReport}
      />
      {showForm && <ReportForm onClose={() => setShowForm(false)} onSubmit={(newEntry: ReportFormData) => addReportEvent(newEntry)} />}
      {selectedReport && (
        <EmergencyModal
          report={selectedReport}
          onClose={() => closeEmergencyModal()}
          onStatusUpdate={(updatedEvent: ReportFormData, oldEvent: ReportFormData) => updateSelectedStatus(updatedEvent, oldEvent)}
          onReportRemove={(reportToRemove: ReportFormData) => removeReportEvent(reportToRemove)}
          onReportEdit={(oldReport, newReport) => handleReportEdit(oldReport, newReport)}
        />
      )}
    </div>
  );
}
