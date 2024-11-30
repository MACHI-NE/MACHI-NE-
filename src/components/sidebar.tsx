import './sidebar.css'
import { ReportFormData } from "../types";
import { ReportForm } from './ReportForm';
import { EmergencyModal } from './EmergencyModal';
import { useState } from "react";

enum SortMethod
{
    Time,
    Proximity,
    Type
}

export function Sidebar({displayedEventList}: {displayedEventList:ReportFormData[]})
{
    let displayedUIEvents: React.ReactElement[] = []; //list of UI objects
    let index : number = 1;
    const [showForm, setShowForm] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ReportFormData | null>(null);
    const [eventsList, setEventsList] = useState(displayedUIEvents);

    function addEventUIItem(emergency:ReportFormData)
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

    initEventsList(displayedEventList);
    return (
        <div id="sidebar">
            <p><strong>MACHI(NE) Emergency System</strong></p>
            <button
                onClick={() => setShowForm(!showForm)}>
                {showForm ? "Hide Report Form" : "New Report"}
            </button>
           
            {showForm && <ReportForm onClose={() => setShowForm(false)} />}
            {selectedReport && (
                <EmergencyModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}
            <p></p>
            <button>Location</button>
            <button>Type</button>
            <button>Time</button>
            <button>Status</button>
            <ul>
                <>{eventsList}</>
            </ul>
        </div>
    );
}

function EventUIObj({emergency}:{emergency:ReportFormData})
{
    return <button id="eventUIItem">
            {emergency.location}, {emergency.type}, {emergency.time}, {emergency.status}
        </button>;
}