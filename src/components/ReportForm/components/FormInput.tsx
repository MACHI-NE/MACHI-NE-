import React, { useState } from 'react';
import { X } from 'lucide-react';
import {Map} from './FormMap';

interface FormInputProps {
    id: string;
    name: string;
    label: string;
    type?: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    options?: { value: string; label: string; }[];
    className?: string;
    isTextArea?: boolean;
    containerClassName?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
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
    containerClassName = ''
}) => {
    const [showMap, setShowMap] = useState(false);
    const inputClasses = `form-input ${className}`;

    const MapModal = () => (
        <div className="map-modal" onClick={() => setShowMap(false)}>
            <div className="map-container" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setShowMap(false)}
                className="close-btn"
                aria-label="Close form"
            >
                <X size={24} />
            </button>
            <div className="h-full w-full flex flex-col items-center justify-center">
                    <h1 className="text-xl text-center font-bold pb-3">Choose location on Map</h1>
                    <Map coordinates={{ lat: 49.27834103633773, lng: -122.91735596301538 }} />
            </div>
            </div>
        </div>
    );

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
                        {options.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        id={id}
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        className={inputClasses}
                        onChange={onChange}
                        value={value}
                        required={required}
                    />
                )
                :
                <>
                    <button
                        id={id}
                        type="button"
                        name={name}
                        className={inputClasses}
                        onClick={() => setShowMap(true)}
                    >
                        {value || 'Select Location'}
                    </button>
                    {showMap && <MapModal />}
                </>
            }
        </div>
    );
};