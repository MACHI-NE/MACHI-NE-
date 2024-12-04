import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FormInput } from './components/FormInput';
import { ImageUpload } from './components/FormImageUpload';
import { resetLocation, setSavedLocation } from './components/locationState';
import type { ReportFormData } from '../../types';
import { LatLng } from 'leaflet';

// Define incident types for the dropdown
const incidentTypes = [
    { value: "", label: "Select a type", disabled: true },
    { value: "Medical Emergency", label: "Medical Emergency" },
    { value: "Traffic/Vehicle Incident", label: "Traffic/Vehicle Incident" },
    { value: "Crime/Violence", label: "Crime/Violence" },
    { value: "Fire", label: "Fire" },
    { value: "Natural Disaster", label: "Natural Disaster" },
    { value: "Other", label: "Other" }
];
interface ReportFormProps {
    onClose: () => void;
    onSubmit: (addedEntry: ReportFormData) => void;
    report?: ReportFormData
}

export function ReportForm({ onClose, onSubmit, report }: ReportFormProps) {
    // State to manage form data
    const [formData, setFormData] = useState<ReportFormData>(report ? {
        ...report,
        // Convert ISO string to local datetime-local format
        time: report.time ? new Date(report.time).toISOString().slice(0, 16) : ""
    } : {
        location: "",
        type: "",
        time: "",
        description: "",
        witnessName: "",
        witnessContact: "",
        customType: "",
        image: null,
        coordinates: null,
        status: 'OPEN'
    });
    // State to manage reset counter for map
    const [resetCounter, setResetCounter] = useState(0);
    // State to manage animation for closing the form
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    // Initialize map with existing coordinates
    useEffect(() => {
        if (report?.coordinates) {
            const [lat, lng] = report.coordinates;
            setSavedLocation(new LatLng(lat, lng));
        }
    }, [report]);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate image URL
        if (formData.image && !formData.image.match(/\.(jpeg|jpg|gif|png)$/)) {
            alert("Please enter a valid image URL. It must be a JPEG, JPG, GIF, or PNG link.");
            return;
        }

        // Set current time if this is a new report
        const submissionData = !report ? {
            ...formData,
            time: new Date().toISOString()
        } : formData;

        resetLocation();
        setResetCounter(prev => prev + 1);
        onSubmit(submissionData);
        handleClose();
    };

    // Handle coordinate changes from the map
    const handleCoordinateChange = (coords: { lat: number; lng: number }) => {
        setFormData(prev => ({
            ...prev,
            coordinates: [coords.lat, coords.lng]
        }));
    };

    // Handle form close with animation
    const handleClose = () => {
        setIsAnimatingOut(true);
        resetLocation();
        setResetCounter(prev => prev + 1);
        setTimeout(() => {
            onClose();
            setIsAnimatingOut(false);
        }, 190);
    };

    return (
        <div className={`modal-backdrop ${isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'}`}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div className="modal-container">
                <button onClick={handleClose} className="close-btn" aria-label="Close form">
                    <X size={24} />
                </button>

                <h1 className="modal-header">Create a New Report</h1>
                <hr className="modal-divider" />

                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="formContent">
                        <div className="formColumn formColumnLeft">
                            <div className="flex flex-col shrink-0">
                                <div className="flex gap-3">
                                    {/* Location input */}
                                    <FormInput
                                        id="location"
                                        name="location"
                                        label="Location:"
                                        placeholder="Enter location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        containerClassName="w-2/5"
                                        required
                                    />
                                    {/* Map input */}
                                    <FormInput
                                        id="coordinates"
                                        name="coordinates"
                                        type="map"
                                        label="Map:"
                                        placeholder="Enter location"
                                        value={formData.coordinates ? `${formData.coordinates[0].toFixed(6)}, ${formData.coordinates[1].toFixed(6)}` : ''}
                                        onChange={handleChange}
                                        onCoordinateChange={handleCoordinateChange}
                                        required
                                        resetTrigger={resetCounter}
                                        containerClassName="w-3/5"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    {/* Incident type input */}
                                    <FormInput
                                        id="type"
                                        name="type"
                                        type="select"
                                        label="Type:"
                                        value={formData.type}
                                        onChange={handleChange}
                                        options={incidentTypes}
                                        required
                                        containerClassName={formData.type === 'Other' ? 'w-2/5' : ''}
                                    />
                                    {/* Custom type input, for when Other is selected */}
                                    {formData.type === 'Other' && (
                                        <div className="mt-auto flex-1">
                                            <input
                                                id="customType"
                                                type="text"
                                                name="customType"
                                                placeholder="Enter emergency type"
                                                className="form-input form-field flex-grow"
                                                onChange={handleChange}
                                                value={formData.customType}
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Only show time input when editing an existing report */}
                                {report && (
                                    <FormInput
                                        id="time"
                                        name="time"
                                        type="datetime-local"
                                        label="Override Time (Operator Edit Only):"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                    />
                                )}
                                <div className="flex gap-3">
                                    {/* Witness name input */}
                                    <FormInput
                                        id="witnessName"
                                        name="witnessName"
                                        label="Witness Name:"
                                        placeholder="Enter name"
                                        value={formData.witnessName}
                                        onChange={handleChange}
                                        required

                                    />
                                    {/* Witness contact input */}
                                    <FormInput
                                        id="witnessContact"
                                        name="witnessContact"
                                        label="Phone Number (xxx-xxx-xxxx):"
                                        type="tel"
                                        placeholder="Enter phone number"
                                        value={formData.witnessContact}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description input */}
                            <FormInput
                                id="description"
                                name="description"
                                label="Description:"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                isTextArea
                                containerClassName="flex-1 md:min-h-0 flex flex-col"
                            />
                        </div>

                        <div className="formColumn formColumnRight">
                            {/* Image upload component */}
                            <ImageUpload formData={formData} setFormData={setFormData} />
                        </div>
                    </div>
                    <div className="submitContainer">
                        {/* Submit button */}
                        <button
                            type="submit"
                            className="submit-btn"
                            onSubmit={handleSubmit}
                        >
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}