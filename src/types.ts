export interface ReportFormData {
    location: string;
    type: string;
    time: string;
    description: string;
    witnessName: string;
    witnessContact: string;
    customType: string;
    image: File | string | null;
    coordinates: [number, number] | null;
    status: 'OPEN' | 'RESOLVED';
}

export interface ReportFormProps {
    onClose: () => void;
}

