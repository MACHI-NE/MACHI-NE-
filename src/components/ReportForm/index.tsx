import { useState } from "react";
import { X } from "lucide-react";
import styles from './styles.module.css';
import { FormInput } from './components/FormInput';
import { ImageUpload } from './components/ImageUpload';
import type { ReportFormProps, ReportFormData } from './types';

const incidentTypes = [
    { value: "", label: "Select a type" },
    { value: "Medical", label: "Medical Emergency" },
    { value: "Traffic", label: "Traffic/Vehicle Incident" },
    { value: "Crime", label: "Crime/Violence" },
    { value: "Fire", label: "Fire" },
    { value: "Natural", label: "Natural Disaster" },
    { value: "Other", label: "Other" }
];

export function ReportForm({ onClose }: ReportFormProps) {
    const [formData, setFormData] = useState<ReportFormData>({
        location: "",
        type: "",
        time: "",
        description: "",
        witnessName: "",
        witnessContact: "",
        customType: "",
        image: null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        onClose();
    };

    return (
        <div className={styles.formWrapper}>
            <button
                onClick={onClose}
                className="close-btn"
                aria-label="Close form"
            >
                <X size={24} />
            </button>

            <h1 className="text-xl text-center font-bold pt-6">Create a new report</h1>

            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.formContent}>
                    <div className={`${styles.formColumn} ${styles.formColumnLeft}`}>
                        <div className="space-y-1">
                            <div className="flex gap-3">
                                <FormInput
                                    id="location"
                                    name="location"
                                    label="Location:"
                                    placeholder="Enter location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                                <FormInput
                                    id="coordinates"
                                    name="coordinates"
                                    type="map"
                                    label="Map:"
                                    placeholder="Enter location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
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

                            <FormInput
                                id="time"
                                name="time"
                                type="datetime-local"
                                label="Time:"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex gap-3">
                            <FormInput
                                id="witnessName"
                                name="witnessName"
                                label="Witness Name:"
                                placeholder="Enter name"
                                value={formData.witnessName}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                id="witnessContact"
                                name="witnessContact"
                                label="Contact Info:"
                                placeholder="Phone or email"
                                value={formData.witnessContact}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <FormInput
                            id="description"
                            name="description"
                            label="Description:"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            isTextArea
                            containerClassName="flex-1 flex flex-col min-h-0"
                        />
                    </div>

                    <div className={`${styles.formColumn} ${styles.formColumnRight}`}>
                        <ImageUpload formData={formData} setFormData={setFormData} />
                    </div>
                </div>
                <div className={styles.submitContainer}>
                    <button
                        type="submit"
                        className="submit-btn"
                    >
                        Submit Report
                    </button>
                </div>
            </form>
        </div>
    );
}