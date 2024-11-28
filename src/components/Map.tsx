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

  const defaultPosition: [number, number] = [49.27694889810881, -122.91926811371421]; 
  const zoomLevel: number = 13;

  return (
    <div className="MapComponent w-full h-full">
      
      <MapContainer
        center={defaultPosition}
        zoom={zoomLevel}
        style={{ height: '100vh', width: '100vh' }}
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
            // icon={greenIcon}
            eventHandlers={{ mouseover: (e) => { e.target.openPopup(); } }}
          >
            <Popup className='p-0 m-0'>
              <a href="https://google.com">
                <div className='m-0 p-0' style={{height: "100%", width: "100", color:"black"}}>
                  <h3><b>{report.description}</b></h3>
                  <p>Type: {report.type}</p>
                  {JSON.stringify(report)}
                  
                  {JSON.stringify(selectedPoint)}
                {(JSON.stringify(report)===JSON.stringify(selectedPoint))+"ad"}
                </div>
              </a>
            </Popup>
          </Marker>
            
          
        ): null)}
      </MapContainer>
    </div>
  );
};


var greenIcon = L.icon({
    iconUrl: 'src/components/greenMarker.svg',

});

var blueIcon = L.icon({
    iconUrl: 'src/components/blueMarker.svg',

});


export default MainMap;