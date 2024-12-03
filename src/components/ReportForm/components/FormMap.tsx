import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { setTempLocation } from './locationState';

// Custom hook to manage location state
function useLocation(saved: boolean = false, initialCoords: LatLng) {
    const [location, setLocation] = useState<LatLng>(initialCoords);
    const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
    
    const map = useMapEvents({
        locationfound: (e) => {
            
            // Only set location if not using saved coordinates
            if (!saved) {
                setLocation(e.latlng);
                setTempLocation(e.latlng);
            }
        },

        click: (e) => {
            setLocation(e.latlng);
            setTempLocation(e.latlng);
        }
    });

    // Only request location if not using saved coordinates
    React.useEffect(() => {
        if (!saved && !hasRequestedLocation) {
            map.locate();
            setHasRequestedLocation(true);
        }
    }, [map, saved, hasRequestedLocation]);

    // Set initial coordinates
    React.useEffect(() => {
        if (saved) {
            setLocation(initialCoords);
            setTempLocation(initialCoords);
        }
    }, [saved, initialCoords]);

    return location;
}

// Component to render a marker on the map
function LocationMarker({ coordinates, saved, locationText }: { coordinates: LatLng, saved: boolean, locationText?: string }) {
    const location = useLocation(saved, coordinates);
    const map = useMap();

    // Always center on initial coordinates when saved
    React.useEffect(() => {
        if (saved) {
            map.setView(coordinates, map.getZoom());
        }
    }, [coordinates, map, saved]);

    return (
        <Marker position={location}>
            <Popup>{locationText || 'Selected location'}</Popup>
        </Marker>
    );
}

// Main map component
export function Map({ coordinates, saved, locationText }: { coordinates: LatLng, saved: boolean, locationText?: string }) {
    return (
        <div className="h-full w-full">
            <MapContainer center={coordinates} zoom={18} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker coordinates={coordinates} saved={saved} locationText={locationText} />
            </MapContainer>
        </div>
    );
}