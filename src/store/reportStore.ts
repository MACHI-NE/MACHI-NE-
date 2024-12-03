import { ReportFormData } from "../types";

export const addReport = (report: ReportFormData) => {
    const storedReports = getReports();
    storedReports.push(report);
    localStorage.setItem('reports', JSON.stringify(storedReports));
};

export const getReports = (): ReportFormData[] => {
    const storedReports = localStorage.getItem('reports');
    return storedReports ? JSON.parse(storedReports) : [];
};

export const updateReportStatus = (report: ReportFormData, newStatus: 'OPEN' | 'RESOLVED') => {
    const storedReports = getReports();
    const updatedReports = storedReports.map(r => {
        if (r.coordinates?.[0] === report.coordinates?.[0] &&
            r.coordinates?.[1] === report.coordinates?.[1] &&
            r.time === report.time) {
            return { ...r, status: newStatus };
        }
        return r;
    });

    localStorage.setItem('reports', JSON.stringify(updatedReports));
    return updatedReports;
};

export const editReport = (report: ReportFormData, newReport: ReportFormData) => {
    const storedReports = getReports();
    console.log(storedReports);
    console.log(report);    
    const filteredReports = storedReports.filter(r =>
        !(r.coordinates?.[0] === report.coordinates?.[0] &&
            r.coordinates?.[1] === report.coordinates?.[1] &&
            r.time === report.time)
    );
    filteredReports.push(newReport);
    
    localStorage.setItem('reports', JSON.stringify(filteredReports));
    console.log(filteredReports);
    return filteredReports;
};

export const deleteReport = (report: ReportFormData) => {
    const storedReports = getReports();
    const filteredReports = storedReports.filter(r =>
        !(r.coordinates?.[0] === report.coordinates?.[0] &&
            r.coordinates?.[1] === report.coordinates?.[1] &&
            r.time === report.time)
    );

    localStorage.setItem('reports', JSON.stringify(filteredReports));
    return filteredReports;
};

export const initializePassword = () => {
    if (!localStorage.getItem('adminPassword')) {
        // Set default password hash (for "temp")
        localStorage.setItem('adminPassword', '9990775155c3518a0d7917f7780b24aa');
    }
};

export const getStoredPassword = () => {
    return localStorage.getItem('adminPassword');
};

export const updatePassword = (newPasswordHash: string) => {
    localStorage.setItem('adminPassword', newPasswordHash);
};