import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Map } from './FormMap';
import { LatLng } from 'leaflet';
import { tempLocation, savedLocation, setSavedLocation } from './locationState';

interface FormInputProps {
    id: string;
    name: string;
    label: string;
    type?: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    options?: { value: string; label: string; disabled?: boolean; }[];
    className?: string;
    isTextArea?: boolean;
    containerClassName?: string;
    onCoordinateChange?: (coords: { lat: number; lng: number }) => void;
    resetTrigger?: number;
}

export function FormInput({
    id,
    name,
    label,
    type = 'text',
    value,
    placeholder,
    required = false,
    onChange,
    options,
    className = '',
    isTextArea = false,
    containerClassName = '',
    onCoordinateChange,
    resetTrigger = 0,
}: FormInputProps) {
    const [showMap, setShowMap] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const inputClasses = `form-input ${className}`;

    useEffect(() => {
        if (resetTrigger > 0) {
            setIsSaved(false);
        }
    }, [resetTrigger]);

    useEffect(() => {
        // Initialize saved location if coordinates exist in value
        if (type === "map" && value) {
            const [lat, lng] = value.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
                setIsSaved(true);
                setSavedLocation(new LatLng(lat, lng));
            }
        }
    }, [type, value]);

    // Modal component for map selection
    const MapModal = () => {
        const [isDragging, setIsDragging] = useState(false);
        const [mouseDownPos, setMouseDownPos] = useState<{ x: number, y: number } | null>(null);

        const handleMouseDown = (e: React.MouseEvent) => {
            setMouseDownPos({ x: e.clientX, y: e.clientY });
            setIsDragging(false);
        };

        const handleMouseMove = (e: React.MouseEvent) => {
            if (!mouseDownPos) return;

            const moveThreshold = 5;
            const deltaX = Math.abs(e.clientX - mouseDownPos.x);
            const deltaY = Math.abs(e.clientY - mouseDownPos.y);

            if (deltaX > moveThreshold || deltaY > moveThreshold) {
                setIsDragging(true);
            }
        };

        const handleMouseUp = () => {
            setMouseDownPos(null);
        };

        const handleClose = () => {
            setIsAnimatingOut(true);
            setTimeout(() => {
                setShowMap(false);
                setIsAnimatingOut(false);
            }, 190);
        };

        const handleBackdropClick = () => {
            if (!isDragging) {
                handleClose();
            }
        };

        return (
            <div className={`map-modal ${isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`}
                onClick={handleBackdropClick}
                onMouseUp={handleMouseUp}
            >
                <div className="map-container"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <button onClick={handleClose} className="close-btn" aria-label="Close map">
                        <X size={24} />
                    </button>
                    <div className="h-full w-full flex flex-col items-center justify-center gap-3">
                        <h1 className="text-xl text-center font-bold">Choose Location on Map</h1>
                        <Map
                            coordinates={savedLocation || new LatLng(49.27834103633773, -122.91735596301538)}
                            saved={isSaved}
                            locationText={name === 'coordinates' ? (document.getElementById('location') as HTMLInputElement)?.value : undefined}

                        />
                        <button
                            onClick={() => {
                                if (tempLocation) {  // Only proceed if tempLocation exists
                                    console.log(tempLocation);
                                    setShowMap(false);
                                    setIsSaved(true);
                                    setSavedLocation(tempLocation);
                                    if (onCoordinateChange) {
                                        onCoordinateChange({
                                            lat: tempLocation.lat,
                                            lng: tempLocation.lng
                                        });
                                    }
                                } else {
                                    alert('Please select a location on the map first');
                                }
                            }}
                            className="submit-btn">
                            Save Location
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`form-field ${containerClassName || ''}`}>
            <label htmlFor={id} className="form-label">{label}</label>
            {type !== "map" ? isTextArea
                ? (
                    <textarea
                        id={id}
                        name={name}
                        placeholder={placeholder}
                        className={`${inputClasses} resize-none h-full`}
                        onChange={onChange}
                        value={value}
                        required={required}
                    />
                ) : options ? (
                    <select
                        id={id}
                        name={name}
                        className={inputClasses}
                        onChange={onChange}
                        value={value}
                        required={required}
                    >
                        {options.map(({ value, label, disabled }) => (
                            <option key={value} value={value} disabled={disabled}>
                                {label}
                            </option>
                        ))}
                    </select>
                ) : (type !== "tel" ?
                    <input
                        id={id}
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        className={inputClasses}
                        onChange={onChange}
                        value={value}
                        required={required}
                    /> :
                    <input
                        id={id}
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        className={inputClasses}
                        onChange={onChange}
                        value={value}
                        required={required}
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    />
                )
                :
                <div className="relative">
                    <input
                        type="text"
                        tabIndex={-1}
                        className="sr-only absolute inset-0 w-full h-full"
                        required={required}
                        defaultValue={savedLocation ? 'valid' : ''}
                        onChange={() => { }}  // Add empty onChange handler
                        aria-hidden="true"
                    />
                    <button
                        id={id}
                        type="button"
                        name={name}
                        className={inputClasses}
                        onClick={() => setShowMap(true)}
                    >
                        <p>{savedLocation ? `${savedLocation!.lat.toFixed(6)}, ${savedLocation!.lng.toFixed(6)}` : 'Select Location'}</p>
                    </button>

                    {(showMap || isAnimatingOut) && <MapModal />}
                </div>
            }
        </div>
    );
}