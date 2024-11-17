import React from 'react';
import { ReportFormData } from '../types';

interface ImageUploadProps {
    formData: ReportFormData;
    setFormData: React.Dispatch<React.SetStateAction<ReportFormData>>;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ formData, setFormData }) => (
    <div className={`form-field ${!formData.image ? "my-auto" : "flex-1 flex flex-col min-h-0"}`}>
        <label htmlFor="image" className="form-label">Upload Image:</label>
        <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="form-input"
            onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                    setFormData(prev => ({
                        ...prev,
                        image: file
                    }));
                }
            }}
        />
        {formData.image && (
            <div className="flex-1 mt-3 min-h-0">
                <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-full h-full object-contain"
                />
            </div>
        )}
    </div>
);