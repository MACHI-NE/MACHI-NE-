import './sidebar.css'
import { ReportFormData } from "../types";
import { ReportForm } from './ReportForm';
import { EmergencyModal } from './EmergencyModal';
import { useState } from "react";

interface SidebarProps {
    displayedEventList: ReportFormData[];
    onReportSelect: (report: ReportFormData) => void;
}

const Sidebar: React.FC<SidebarProps> = ({displayedEventList, onReportSelect}) =>
{
    let displayedUIEvents: React.ReactElement[] = []; //list of UI objects
    let index : number = 1;
    const [showForm, setShowForm] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ReportFormData | null>(null);
    const [eventsList, setEventsList] = useState(displayedUIEvents);
    // UI object to create in sidebar list
    function EventUIObj({emergency}:{emergency:ReportFormData})
    {
        return <button className="sidebar-event-item" onClick={() => onReportSelect(emergency)}>
                <strong>{emergency.location}, {emergency.type}</strong>
                <p></p> {new Date(emergency.time).toLocaleString()} , {emergency.status}
            </button>;
    }
    function addEventUIItem(emergency:ReportFormData) // for testing purposes
    {
        setEventsList((prevEventList) =>{
            let temp: React.ReactElement[] = prevEventList.slice();
            temp.push(<EventUIObj emergency={emergency} key={index++}/>);
            return temp;
        });
    }
    function initEventsList(emergencies:ReportFormData[])
    {
        emergencies.forEach(emergency => {
            displayedUIEvents.push(<EventUIObj emergency={emergency} key={index++}/>);
        });
    }
    function sortEventsList(emergencies:ReportFormData[]) //show most recent events first
    {
        let sortedEvents: ReportFormData[] = emergencies.slice();
        sortedEvents.sort((a, b) => 
            {
                const timeA = new Date(a.time); //convert date string back into date objects
                const timeB = new Date(b.time);
                //sort with latest date appearing first,
                if (timeA < timeB) //if timeA is earlier, place later in array
                    return 1;
                else if (timeB < timeA)
                    return -1;
                return 0; // if same time
            });
        return sortedEvents;
    }

    displayedEventList = sortEventsList(displayedEventList);
    initEventsList(displayedEventList);
    
    // sort by most recent
    return (
        <div>
            <div className="sidebar-component">
                <p><strong>MACHI(NE) Emergency System</strong></p>
                <button
                    onClick={() => setShowForm(!showForm)}>
                    {showForm ? "[-] Close Form" : "[+] Add Report"}
                </button>
            
                <p></p>
                <p><strong>-- Nearby Reports --</strong></p>
                <ul>
                    <>{eventsList}</>
                </ul>
            </div>
            {showForm && <ReportForm onClose={() => setShowForm(false)} />}
            {selectedReport && (
                <EmergencyModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </div>
    );
}

export default Sidebar;