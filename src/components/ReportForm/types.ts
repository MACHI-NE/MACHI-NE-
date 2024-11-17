export interface ReportFormData {
    location: string;
    type: string;
    time: string;
    description: string;
    witnessName: string;
    witnessContact: string;
    customType: string;
    image: File | null;
}

export interface ReportFormProps {
    onClose: () => void;
}
