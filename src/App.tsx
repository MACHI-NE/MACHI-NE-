import MainMap from "./components/Map"
import { useState } from "react";
import { ReportForm } from "./components/ReportForm/index.tsx";
import { ReportFormData } from "./types.ts";
import { EmergencyModal } from "./components/EmergencyModal";
import Sidebar from "./components/sidebar"
import { initializePassword } from './store/reportStore';

export default function App() {
  initializePassword();

  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportFormData | null>(null);
  let totalEvents: ReportFormData[] = localStorage.getItem('reports') ? JSON.parse(localStorage.getItem('reports') || '[]') : testingList;
  const initVisEvents: ReportFormData[] = []
  const [totEvents, setTotEvents] = useState(totalEvents);
  const [visEvents, setVisEvents] = useState(initVisEvents);
  const [selectCoord, setSelectCoord] = useState<[number, number] | null>([49.27694889810881, -122.91926811371421]);

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
    totalEvents = localStorage.getItem('reports') ? JSON.parse(localStorage.getItem('reports') || '[]') : testingList;
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
  function updateSelectedStatus(updateEvent: ReportFormData, newStatus: 'OPEN' | 'RESOLVED') {
    // Update both total and visible events
    setTotEvents(prevTotEvents =>
      prevTotEvents.map(event =>
        (event.coordinates?.[0] === updateEvent.coordinates?.[0] &&
          event.coordinates?.[1] === updateEvent.coordinates?.[1] &&
          event.time === updateEvent.time)
          ? { ...event, status: newStatus }
          : event
      )
    );

    setVisEvents(prevVisEvents =>
      prevVisEvents.map(event =>
        (event.coordinates?.[0] === updateEvent.coordinates?.[0] &&
          event.coordinates?.[1] === updateEvent.coordinates?.[1] &&
          event.time === updateEvent.time)
          ? { ...event, status: newStatus }
          : event
      )
    );
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
          console.clear()
          refreshVisibleEvents(lis)
        }}
        selectedCoord={selectCoord}
        onReportSelect={setSelectedReport}
      />
      {showForm && <ReportForm onClose={() => setShowForm(false)} onSubmit={(newEntry: ReportFormData) => addReportEvent(newEntry)} />}
      {selectedReport && (
        <EmergencyModal
          report={selectedReport}
          onClose={() => closeEmergencyModal()}
          onStatusUpdate={(updatedEvent: ReportFormData, newStatus: 'OPEN' | 'RESOLVED') => updateSelectedStatus(updatedEvent, newStatus)}
          onReportRemove={(reportToRemove: ReportFormData) => removeReportEvent(reportToRemove)}
          onReportEdit={(oldReport, newReport) => handleReportEdit(oldReport, newReport)}
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
