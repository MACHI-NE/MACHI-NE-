import React from 'react';
import { ReportFormData } from '../../../types';

interface ImageUploadProps {
    formData: ReportFormData;
    setFormData: React.Dispatch<React.SetStateAction<ReportFormData>>;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ formData, setFormData }) => (
    <div className={`form-field ${!formData.image ? "md:my-auto" : "flex-1 flex flex-col min-h-0"}`}>
        <label htmlFor="image" className="form-label">Image URL:</label>
        
        <input
            type="text"
            id="image"
            name="image"
            className="form-input"
            placeholder="Enter image URL"
            value={formData.image || ''}
            onChange={(e) => {
                setFormData(prev => ({
                    ...prev,
                    image: e.target.value || null
                }));
            }}
        />

        {formData.image && (
            <div className="flex-1 mt-3 min-h-0">
                <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>
        )}
    </div>
);