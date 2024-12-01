import { X } from "lucide-react";
import { ReportFormData } from "../types";
import { useState } from "react";
import { updateReportStatus } from "../store/reportStore";

interface EmergencyModalProps {
    report: ReportFormData;
    onClose: () => void;
    onStatusUpdate: (updatedEvent : ReportFormData, newStatus:'OPEN' | 'RESOLVED') => void;
    onReportRemove: (reportToRemove:ReportFormData) => void;
}

export function EmergencyModal({ report, onClose , onStatusUpdate, onReportRemove}: EmergencyModalProps) {
    console.log(report)
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [status, setStatus] = useState<'OPEN' | 'RESOLVED'>(report.status || 'OPEN');

    const handleStatusToggle = () => {
        const newStatus = status === 'OPEN' ? 'RESOLVED' : 'OPEN';
        setStatus(newStatus);
        updateReportStatus(report, newStatus);
        onStatusUpdate(report, newStatus);
    };

    const handleClose = () => {
        setIsAnimatingOut(true);
        setTimeout(() => {
            onClose();
            setIsAnimatingOut(false);
        }, 190);
    };

    return (
        <div className={`modal-backdrop ${
            isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'
        }`}
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="modal-container">
                <button onClick={handleClose} className="close-btn" aria-label="Close modal">
                    <X size={24} />
                </button>

                <h1 className="modal-header">Emergency Report Details</h1>
                
                {/* Status Section */}
                <div className="submitContainer flex justify-center items-center bg-slate-200">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-semibold">Status:</span>
                        <span className={`px-2 py-1 text-base font-bold rounded border ${status === 'OPEN'
                            ? 'bg-yellow-300 text-yellow-950 border-yellow-500'
                            : 'bg-green-500 text-green-950 border-green-700'
                            }`}>
                            {status}
                        </span>
                        <button
                            onClick={handleStatusToggle}
                            className="submit-btn text-base"
                            type="button"
                        >
                            Mark as {status === 'OPEN' ? 'RESOLVED' : 'OPEN'}
                        </button>

                    </div>
                </div>

                <div className="modal-divider"></div>
                <div className="modal-content">
                    <div className="formContainer">
                        <div className="formContent">
                            <div className="formColumn formColumnLeft">
                                <div className="flex flex-col gap-4 shrink-0">
                                    {/* Incident Section */}
                                    <div className="space-y-2">
                                        <h3 className="form-label mb-0 text-lg text-slate-700">Incident Details</h3>
                                        <hr className="border-slate-300" />
                                        <div className="space-y-3 pt-1">
                                            <div>
                                                <h3 className="form-label mb-0">Type</h3>
                                                <p className="text-lg">{report.type === 'Other' ? report.customType : report.type}</p>
                                            </div>

                                            <div>
                                                <h3 className="form-label mb-0">Time</h3>
                                                <p className="text-lg">{new Date(report.time).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Section */}
                                    <div className="space-y-2">
                                        <h3 className="form-label mb-0 text-lg text-slate-700">Location Information</h3>
                                        <hr className="border-slate-300" />
                                        <div className="pt-1">
                                            <p className="text-lg">{report.location}</p>
                                            <p className="text-base text-slate-600">
                                                Coordinates: {report.coordinates?.[0].toFixed(6)}, {report.coordinates?.[1].toFixed(6)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Witness Section - Only show if there's witness info */}
                                    {report.witnessName && (
                                        <div className="space-y-2">
                                            <h3 className="form-label mb-0 text-lg text-slate-700">Witness Information</h3>
                                            <hr className="border-slate-300" />
                                            <div className="flex gap-3 pt-1">
                                                <div className="flex-1">
                                                    <h3 className="form-label mb-0">Name</h3>
                                                    <p className="text-lg">{report.witnessName}</p>
                                                </div>
                                                {report.witnessContact && (
                                                    <div className="flex-1">
                                                        <h3 className="form-label mb-0">Contact</h3>
                                                        <p className="text-lg">{report.witnessContact}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Description Section */}
                                <div className="flex-1 mt-4 space-y-2">
                                    <h3 className="form-label mb-0 text-lg text-slate-700">Description</h3>
                                    <hr className="border-slate-300" />
                                    <p className="text-lg h-max overflow-y-scroll pt-1">
                                        {report.description}
                                    </p>
                                </div>
                            </div>

                            {/* Image Section */}
                            {report.image && (
                                <div className="formColumn formColumnRight space-y-2">
                                    <h3 className="form-label mb-0 text-lg text-slate-700">Image</h3>
                                    <hr className="border-slate-300" />
                                    <div className="h-full flex items-center justify-center">
                                        <img
                                            src={report.image}
                                            alt="Report image"
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}
