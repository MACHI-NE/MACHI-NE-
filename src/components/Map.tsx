import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ReportFormData } from '../types';

interface EventReport {
  description: string;
  date: Date;
  location: [number, number];
}

interface MainMapProps {
  eventReportList: EventReport[];
  setVisiblePoints: (visiblePoints: EventReport[]) => void; 
}


// function MapEvents takes in List of reports and func for visible points
const MapEvents: React.FC<{ eventReportList: EventReport[]; setVisiblePoints: (visiblePoints: EventReport[]) => void }> 
  = ({ eventReportList, setVisiblePoints }) => {

  const map = useMapEvents({
    // When the view changes
    moveend: () => {
      const bounds = map.getBounds();
      const visiblePoints = eventReportList.filter((report) =>
        bounds.contains(L.latLng(report.location))
      );
      setVisiblePoints(visiblePoints);
    },

    // When the component itself loads
    load: () => {
      const bounds = map.getBounds();
      const visiblePoints = eventReportList.filter((report) =>
        bounds.contains(L.latLng(report.location))
      );
      setVisiblePoints(visiblePoints);
    }
  });

  return null;
};

const MainMap: React.FC<MainMapProps> = ({ eventReportList, setVisiblePoints }) => {

  const defaultPosition: [number, number] = [49.27694889810881, -122.91926811371421]; 
  const zoomLevel: number = 13;

  return (
    <div className="MapComponent w-full h-full">
      
      <MapContainer
        center={defaultPosition}
        zoom={zoomLevel}
        style={{ height: '500px', width: '500px' }}
      >
        {/* deals with when the map moves, to call setVisiblePoints*/}
        <MapEvents
          eventReportList={eventReportList}
          setVisiblePoints={setVisiblePoints}
        />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {eventReportList.map((report, index) => (
          <Marker key={index} position={report.location}
          
           eventHandlers={{
            mouseover: (e) => {
              e.target.openPopup();
            }
          }}


          
          >
            <Popup>
              <h1>woo</h1>
              <table>
                <tr>
                  <td>adad</td>
                </tr>
              </table>
              {report.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MainMap;