import { useState } from "react";
import { X } from "lucide-react";
import styles from './styles.module.css';
import { FormInput, resetLocation } from './components/FormInput';
import { ImageUpload } from './components/FormImageUpload';
import type { ReportFormProps, ReportFormData } from './types';

// Define incident types for the dropdown
const incidentTypes = [
    { value: "", label: "Select a type", disabled: true },
    { value: "Medical", label: "Medical Emergency" },
    { value: "Traffic", label: "Traffic/Vehicle Incident" },
    { value: "Crime", label: "Crime/Violence" },
    { value: "Fire", label: "Fire" },
    { value: "Natural", label: "Natural Disaster" },
    { value: "Other", label: "Other" }
];

export function ReportForm({ onClose }: ReportFormProps) {
    // State to manage form data
    const [formData, setFormData] = useState<ReportFormData>({
        location: "",
        type: "",
        time: "",
        description: "",
        witnessName: "",
        witnessContact: "",
        customType: "",
        image: null,
        coordinates: null
    });
    // State to manage reset counter for map
    const [resetCounter, setResetCounter] = useState(0);
    // State to manage animation for closing the form
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

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
        console.log(formData);
        onClose();
    };

    // Handle coordinate changes from the map
    const handleCoordinateChange = (coords: { lat: number; lng: number }) => {
        setFormData(prev => ({
            ...prev,
            coordinates: coords
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
        // Form container with backdrop
        <div
            className={`fixed inset-0 flex items-center justify-center bg-slate-600 bg-opacity-50 backdrop-blur-sm ${isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'
                }`}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div className={styles.formWrapper}>
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="close-btn"
                    aria-label="Close form"
                >
                    <X size={24} />
                </button>

                {/* Form title */}
                <h1 className="text-xl text-center font-bold md:pt-6 p-3">Create a new report</h1>

                {/* Form element */}
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <div className={styles.formContent}>
                        <div className={`${styles.formColumn} ${styles.formColumnLeft}`}>
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
                                        value={formData.coordinates ? `${formData.coordinates.lat.toFixed(6)}, ${formData.coordinates.lng.toFixed(6)}` : ''}
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

                                {/* Time input */}
                                <FormInput
                                    id="time"
                                    name="time"
                                    type="datetime-local"
                                    label="Time:"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="flex gap-3">
                                    {/* Witness name input */}
                                    <FormInput
                                        id="witnessName"
                                        name="witnessName"
                                        label="Witness Name:"
                                        placeholder="Enter name"
                                        value={formData.witnessName}
                                        onChange={handleChange}
                                        
                                    />
                                    {/* Witness contact input */}
                                    <FormInput
                                        id="witnessContact"
                                        name="witnessContact"
                                        label="Contact Info:"
                                        placeholder="Phone or email"
                                        value={formData.witnessContact}
                                        onChange={handleChange}
                                        
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

                        <div className={`${styles.formColumn} ${styles.formColumnRight}`}>
                            {/* Image upload component */}
                            <ImageUpload formData={formData} setFormData={setFormData} />
                        </div>
                    </div>
                    <div className={styles.submitContainer}>
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