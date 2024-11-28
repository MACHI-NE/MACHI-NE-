import React from 'react';
import { ReportFormData } from '../../../types';

// Props interface for the ImageUpload component
interface ImageUploadProps {
    formData: ReportFormData;               // Current form data state
    setFormData: React.Dispatch<React.SetStateAction<ReportFormData>>; // Function to update form data
}

// Component for handling image upload and preview functionality
export const ImageUpload: React.FC<ImageUploadProps> = ({ formData, setFormData }) => (
    // Container div with conditional classes based on whether an image is uploaded
    <div className={`form-field ${!formData.image ? "md:my-auto" : "flex-1 flex flex-col min-h-0"}`}>
        {/* Label for the file input */}
        <label htmlFor="image" className="form-label">Upload Image:</label>
        
        {/* File input element that accepts only image files */}
        <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="form-input"
            onChange={(e) => {
                // Get the first file from the selected files
                const file = e.target.files?.[0];
                if (file) {
                    // Update form data with the selected image file
                    setFormData(prev => ({
                        ...prev,
                        image: file
                    }));
                }
            }}
        />

        {/* Image preview section - only shown when an image is selected */}
        {formData.image && (
            <div className="flex-1 mt-3 min-h-0">
                <img
                    src={URL.createObjectURL(formData.image)} // Create temporary URL for image preview
                    alt="Preview"
                    className="w-full h-full object-contain"
                />
            </div>
        )}
    </div>
);