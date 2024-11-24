import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Coordinates } from '../types';

export function MapComponent() {
    const [coordinates, setCoordinates] = useState<Coordinates>({ lat: 0, lng: 0 });
    return <Map coordinates={coordinates} />;
}
function useLocation() {
    const [location, setLocation] = useState<LatLng | null>(null)
    const map = useMapEvents({
        locationfound: (e) => {
            setLocation(e.latlng)
        }
    })


    React.useEffect(() => {
        map.locate();
    }, [map]);

    return location;
}

function LocationMarker({ coordinates }: { coordinates: Coordinates }) {
    const location = useLocation() || coordinates
    const map = useMap();
    
    React.useEffect(() => {
        map.flyTo(location, map.getZoom());
    }, [location, map]);
    
    return (
        <Marker position={location}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

export function Map({ coordinates }: { coordinates: Coordinates }) {
    return (<div className="h-full w-full">
        <MapContainer center={coordinates} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker coordinates={coordinates} />
        </MapContainer>
    </div>);
}