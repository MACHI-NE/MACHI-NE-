import { ReportFormData } from "../types";

let reports: ReportFormData[] = [];

export const addReport = (report: ReportFormData) => {
    reports = [...reports, report];
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
    reports = updatedReports;
    return updatedReports;
};

export const editReport = (report: ReportFormData, newReport: ReportFormData) => {
    const storedReports = getReports();
    const updatedReports = storedReports.map(r => {
        if (r.coordinates?.[0] === report.coordinates?.[0] &&
            r.coordinates?.[1] === report.coordinates?.[1] &&
            r.time === report.time) {
            return { ...r, ...newReport };
        }
        return r;
    });

    localStorage.setItem('reports', JSON.stringify(updatedReports));
    reports = updatedReports;
    return updatedReports;
};

export const deleteReport = (report: ReportFormData) => {
    const storedReports = getReports();
    const filteredReports = storedReports.filter(r =>
        !(r.coordinates?.[0] === report.coordinates?.[0] &&
            r.coordinates?.[1] === report.coordinates?.[1] &&
            r.time === report.time)
    );

    localStorage.setItem('reports', JSON.stringify(filteredReports));
    reports = filteredReports;
    return filteredReports;
};