import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Define the structure of a single EventReport
interface EventReport {
  description: string;
  date: Date;
  location: [number, number];
}


interface MainMapProps {
  eventReportList: EventReport[];
}


const MainMap: React.FC<MainMapProps> = ({eventReportList}) => {
  // Default center position and zoom level
  const defaultPosition: [number, number] = [49.27694889810881, -122.91926811371421]; 
  const zoomLevel: number = 13;

  return (
    <MapContainer center={defaultPosition} zoom={zoomLevel} style={{ height: '100vh', width: '100vw' }} >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

    {eventReportList.map((report, index) => (
      <Marker key={index} position={report.location}>
        <Popup>
          {report.description}
        </Popup>
      </Marker> 
    ))}

 


    </MapContainer>
  );
};

export default MainMap;

