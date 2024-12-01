import React from 'react';
import { MapContainer, ZoomControl, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ReportFormData } from '../types';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

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
  selectedCoord: [number, number] | null;
  onReportSelect: (report: ReportFormData) => void;
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



// CenterMap component re-centers the map when selectedCoord changes
const CenterMap: React.FC<{ selectedCoord: [number, number] | null }> = ({ selectedCoord }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCoord) {
      map.setView(selectedCoord, 15); // Use setView to move map center
    }
  }, [selectedCoord, map]);

  return null;
};



const MainMap: React.FC<MainMapProps> = ({ eventReportList, setVisiblePoints, selectedCoord = null, onReportSelect }) => {
  var defaultPosition: [number, number] = [49.27694889810881, -122.91926811371421];
  const zoomLevel: number = 13;
  console.log(selectedCoord);
  return (
    <div className="MapComponent w-full h-full relative z-0">
      <MapContainer
        center={defaultPosition}
        zoom={zoomLevel}
        zoomControl={false}
        className='w-screen h-screen z-0'
      >
        <ZoomControl position="bottomright"/>
        {/* deals with when the map moves, to call setVisiblePoints*/}
        <MapEvents
          eventReportList={eventReportList}
          setVisiblePoints={setVisiblePoints}
        />
        <CenterMap selectedCoord={selectedCoord} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {eventReportList.map((report, index) => report.coordinates ? (
          <Marker
            key={index}
            position={report.coordinates}
            icon={(report.coordinates == selectedCoord) ? greenIcon : blueIcon}
            eventHandlers={{ click: (e) => { e.target.openPopup(); } }}
          >
            <Popup className='p-0 m-0'>
              <div className="m-0 p-2 h-full w-full text-black cursor-pointer"
              onClick={() => onReportSelect(report)}>
              <h3><b>{report.type === 'Other' ? report.customType : report.type}</b></h3>
              <p className="text-sm text-gray-600">
                {new Date(report.time).toLocaleString()} • {report.status}
              </p>
              <p className="text-xs text-blue-600 mt-1">Click for more details</p>
              </div>
            </Popup>
          </Marker>
        ) : null)}
      </MapContainer>
    </div>
  );
};


export default MainMap;