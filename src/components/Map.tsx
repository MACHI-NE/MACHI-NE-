import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ReportFormData } from '../types';
import { EmergencyModal } from './EmergencyModal';

interface MainMapProps {
  eventReportList: ReportFormData[];
  setVisiblePoints: (visiblePoints: ReportFormData[]) => void; 
  selectedPoint: null | ReportFormData;
}


// function MapEvents takes in List of reports and func for visible points
const MapEvents: React.FC<{ eventReportList: ReportFormData[]; setVisiblePoints: (visiblePoints: ReportFormData[]) => void }> 
  = ({ eventReportList, setVisiblePoints }) => {

  const map = useMapEvents({
    // When the view changes
    moveend: () => {
      const bounds = map.getBounds();
      const visiblePoints = eventReportList.filter((report) => {
        return report.coordinates && bounds.contains(L.latLng(report.coordinates))
      }
      );
      setVisiblePoints(visiblePoints);
    },

    // When the component itself loads
    load: () => {
      const bounds = map.getBounds();
      const visiblePoints = eventReportList.filter((report) => {
        return report.coordinates && bounds.contains(L.latLng(report.coordinates))
      }
      );
      setVisiblePoints(visiblePoints);
    }
  });

  return null;
};

const MainMap: React.FC<MainMapProps> = ({ eventReportList, setVisiblePoints, selectedPoint=null}) => {
  const [selectedReport, setSelectedReport] = useState<ReportFormData | null>(null);
  const defaultPosition: [number, number] = [49.27694889810881, -122.91926811371421]; 
  const zoomLevel: number = 13;

  return (
    <div className="MapComponent w-full h-full relative z-0">
      <MapContainer
        center={defaultPosition}
        zoom={zoomLevel}
        className='w-screen h-screen z-0'
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
        {eventReportList.map((report, index) => report.coordinates ? (
          <Marker 
            key={index} 
            position={report.coordinates}
            eventHandlers={{ 
              mouseover: (e) => { e.target.openPopup(); }
            }}
          >
            <Popup className='p-0 m-0'>
              <div 
                className="m-0 p-2 h-full w-full text-black cursor-pointer hover:bg-slate-100"
                onClick={() => setSelectedReport(report)}
              >
                <h3 className="font-bold">{report.type}</h3>
                <p className="text-sm">{report.description.slice(0, 100)}...</p>
                <p className="text-xs text-blue-600 mt-1">Click for details</p>
              </div>
            </Popup>
          </Marker>
        ): null)}
      </MapContainer>

      {selectedReport && (
        <EmergencyModal 
          report={localStorage.getItem('report') ? JSON.parse(localStorage.getItem('report') as string) : selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}
    </div>
  );
};

const greenIcon = L.icon({
    iconUrl: 'src/components/greenMarker.svg',

});

const blueIcon = L.icon({
    iconUrl: 'src/components/blueMarker.svg',

});


export default MainMap;