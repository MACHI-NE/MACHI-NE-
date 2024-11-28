import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ReportFormData } from '../types';


const greenIcon = L.icon({
    iconUrl: 'src/components/greenMarker.svg',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],

});    

const blueIcon = L.icon({
    iconUrl: 'src/components/blueMarker.svg',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],

});



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

  // const defaultPosition: [number, number] = () => {return(selectedPoint? selectedPoint.coordinates : [49.278987955218824, -122.91669019509023])}; 
  const defaultPosition: [number, number] = (() => {
  return selectedPoint?.coordinates ?? [49.278987955218824, -122.91669019509023]; })();
  const zoomLevel: number = 13;

  return (
    <div className='w-screen h-screen z-0'>
      
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
            icon={(JSON.stringify(report)==JSON.stringify(selectedPoint))? greenIcon: blueIcon}
            eventHandlers={{ mouseover: (e) => { e.target.openPopup(); } }}
          >
            <Popup className='p-0 m-0'>
                <div className='m-0 p-0' style={{height: "100%", width: "100", color:"black"}}>
                  <h3><b>{report.description}</b></h3>
                  <p>Type: {report.type}</p>
                </div>
            </Popup>
          </Marker>
            
          
        ): null)}
      </MapContainer>
    </div>
  );
};




export default MainMap;