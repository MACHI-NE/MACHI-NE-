import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { setTempLocation } from './FormInput';

// Custom hook to manage location state
function useLocation(saved: boolean = false) {
    const [location, setLocation] = useState<LatLng | null>(null);
    const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
    
    // Event handlers for map
    const map = useMapEvents({
        
        // User location found
        locationfound: (e) => {

            // Only use user location if not saved and no location set
            if (!saved && !location) {
                setLocation(e.latlng);
                setTempLocation(e.latlng);
            }
        },

        // Map clicked
        click: (e) => {
            setLocation(e.latlng);
            setTempLocation(e.latlng);
        }
    });

    // Request location on first render only
    React.useEffect(() => {
        if (!saved && !hasRequestedLocation) {
            map.locate();
            setHasRequestedLocation(true);
        }
    }, [map, saved, hasRequestedLocation]);

    return location;
}

// Component to render a marker on the map
function LocationMarker({ coordinates, saved, locationText }: { coordinates: LatLng, saved: boolean, locationText?: string }) {
    
    // If no click or location found, default to coordinates (CMPT 272 lecture hall)
    const location = useLocation(saved) || coordinates;
    const map = useMap();

    // Fly animation to location
    React.useEffect(() => {
        map.flyTo(location, map.getZoom());
    }, [location, map]);

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