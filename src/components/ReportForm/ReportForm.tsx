import { useState } from "react";
import { X } from "lucide-react"; // Import X icon from lucide-react
interface ReportFormProps {
    onClose: () => void;
}

export function ReportForm({ onClose }: ReportFormProps) {
    const [formData, setFormData] = useState({
        location: "",
        type: "",
        time: "",
        description: "",
        witnessName: "",
        witnessContact: "",
        customType: "",
        image: null as File | null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        onClose();
    };

    return (
        <div className="w-full md:w-2/3 h-4/5 bg-slate-200 text-slate-800 relative rounded-xl">
            <button
                onClick={onClose}
                className="close-btn"
                aria-label="Close form"
            >
                <X size={24} />
            </button>

            <h1 className="text-xl text-center font-bold pt-6">Create a new report</h1>
            <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100%-4rem)]">
                <div className="flex p-6 pt-3 flex-1 min-h-0">
                    <div className="w-1/2 pe-3 flex flex-col">
                        <div className="space-y-1">
                            <div className="form-field">
                                <label htmlFor="location" className="form-label">Location: </label>
                                <br />
                                <input
                                    id="location"
                                    type="text"
                                    name="location"
                                    placeholder="Enter location"
                                    className="form-input"
                                    onChange={handleChange}
                                    value={formData.location}
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="type" className="form-label">Type: </label>
                                <br />
                                <div className="flex gap-3">
                                    <select
                                        id="type"
                                        name="type"
                                        className={`${formData.type === "Other" ? "w-2/5" : ""} form-input`}
                                        onChange={handleChange}
                                        value={formData.type}
                                        aria-label="Select incident type"
                                        required
                                    >
                                        <option value="" disabled>Select a type</option>
                                        <option value="Medical">Medical Emergency</option>
                                        <option value="Traffic">Traffic/Vehicle Incident</option>
                                        <option value="Crime">Crime/Violence</option>
                                        <option value="Fire">Fire</option>
                                        <option value="Natural">Natural Disaster</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {formData.type === 'Other' && (
                                        <input
                                            id="customType"
                                            type="text"
                                            name="customType"
                                            placeholder="Enter emergency type"
                                            className="form-input"
                                            onChange={handleChange}
                                            value={formData.customType}
                                            required
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="form-field">
                                <label htmlFor="time" className="form-label">Time: </label>
                                <br />
                                <input
                                    id="time"
                                    type="datetime-local"
                                    name="time"
                                    className="form-input"
                                    onChange={handleChange}
                                    value={formData.time}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="form-field">
                                <label htmlFor="witnessName" className="form-label">Witness Name: </label>
                                <br />
                                <input
                                    id="witnessName"
                                    type="text"
                                    name="witnessName"
                                    placeholder="Enter name"
                                    className="form-input"
                                    onChange={handleChange}
                                    value={formData.witnessName}
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="witnessContact" className="form-label">Contact Info: </label>
                                <br />
                                <input
                                    id="witnessContact"
                                    type="text"
                                    name="witnessContact"
                                    placeholder="Phone or email"
                                    className="form-input"
                                    onChange={handleChange}
                                    value={formData.witnessContact}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-field flex-1 flex flex-col mt-1 min-h-0">
                            <label htmlFor="description" className="form-label">Description: </label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Enter description"
                                className="form-input flex-1 min-h-0 resize-none"
                                onChange={handleChange}
                                value={formData.description}
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div className="w-1/2 ps-3 flex flex-col">
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
                                        setFormData({
                                            ...formData,
                                            image: file
                                        });
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
                    </div>
                </div>
                <div className="px-6 pb-3 mx-auto">
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