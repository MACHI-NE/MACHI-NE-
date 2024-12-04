import React, { useEffect } from 'react';
import { MapContainer, ZoomControl, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ReportFormData } from '../types';
import { useMap } from 'react-leaflet';

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
  setSelectedCoord: (coord: [number, number] | null) => void;
  onReportSelect: (report: ReportFormData) => void;
}



// function MapEvents takes in List of reports and func for visible points
const MapEvents: React.FC<{ eventReportList: ReportFormData[]; setVisiblePoints: (visiblePoints: ReportFormData[]) => void }>
  = ({ eventReportList, setVisiblePoints }) => {
    const initialLoadRef = React.useRef(true);

    const map = useMapEvents({
      moveend: () => {
        const bounds = map.getBounds();
        const visiblePoints = eventReportList.filter((report) => {
          return report.coordinates && bounds.contains(L.latLng(report.coordinates))
        });
        setVisiblePoints(visiblePoints);
      }
    });

    useEffect(() => {
      // Check if map is ready and we haven't done initial load
      if (map && initialLoadRef.current) {
        const bounds = map.getBounds();
        const visiblePoints = eventReportList.filter((report) => {
          return report.coordinates && bounds.contains(L.latLng(report.coordinates))
        });
        setVisiblePoints(visiblePoints);
        initialLoadRef.current = false;
      }
    }, [map, eventReportList, setVisiblePoints]);

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



const MainMap: React.FC<MainMapProps> = ({ eventReportList, setVisiblePoints, selectedCoord = null, setSelectedCoord, onReportSelect }) => {
  const defaultPosition: [number, number] = [49.17, -122.94];
  const zoomLevel: number = 10.3;
  return (
    <div className="MapComponent w-full h-full relative z-0">
      <MapContainer
        center={defaultPosition}
        zoom={zoomLevel}
        zoomControl={false}
        className='w-screen h-screen z-0'
      >
        <ZoomControl position="topright"/>
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
            ref={(markerRef) => {
              if (report.coordinates == selectedCoord && markerRef) {
                markerRef.openPopup();
              }
            }}
            eventHandlers={{
              click: () => {
                setSelectedCoord(report.coordinates)
              },
              popupclose: () => {
                setSelectedCoord(null)
              }
            }}
          >
            <Popup
              className='p-0 m-0'
              autoPan={false}
              keepInView={false}
              autoPanPadding={[0, 0]}
              eventHandlers={{
                popupclose: () => {
                  setSelectedCoord(null)
                }
              }}
            >
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