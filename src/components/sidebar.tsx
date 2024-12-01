import './sidebar.css'
import { ReportFormData } from "../types";
import { ReportForm } from './ReportForm';
import { EmergencyModal } from './EmergencyModal';
import { useState } from "react";

interface SidebarProps {
    viewableEventList: ReportFormData[];
    totalEventList: ReportFormData[];
    onReportSelect: (report: ReportFormData) => void;
    onReportAdd: (report: ReportFormData) => void;
}

const Sidebar: React.FC<SidebarProps> = ({viewableEventList, totalEventList, onReportSelect, onReportAdd}) =>
{
    let displayedUIEvents: React.ReactElement[] = []; //list of UI objects
    let index : number = 1;
    const [showForm, setShowForm] = useState(false);
    const [showAll, setShowAll] = useState(true);
    const [selectedReport, setSelectedReport] = useState<ReportFormData | null>(null);
    const [eventsList, setEventsList] = useState(displayedUIEvents);
    const [reportsText, setReportsText] = useState("-- Emergency Reports --");
    // UI object to create in sidebar list
    function EventUIObj({emergency}:{emergency:ReportFormData}) //functional component of event UI list item
    {
        return <button className="sidebar-event-item" onClick={() => onReportSelect(emergency)}>
                <strong>{emergency.location}, {emergency.type}</strong>
                <p></p> {new Date(emergency.time).toLocaleString()} , {emergency.status}
            </button>
    }
    function addReportEvent(newEvent:ReportFormData) //when adding new report via sidebar
    {
        onReportAdd(newEvent); //trigger report list update in main app
        displayedUIEvents.push(<EventUIObj emergency={newEvent} key={index++}/>);
        console.log(displayedUIEvents);
        setEventsList(displayedUIEvents);
        setReportsText("Successfully Added Report:");
    } 
    function refreshEventsList(emergencies:ReportFormData[]) //for handling list rerendering after map moves
    {
        var prevRender : React.ReactElement[] = eventsList; //get array from last render
        emergencies.forEach(emergency => { 
            displayedUIEvents.push(<EventUIObj emergency={emergency} key={index++}/>); //create new array
        });
        // if there was a change, rerender
        var changeDetected : boolean = false;
        if (prevRender.length != displayedUIEvents.length) // if lengths are not equal, there was a change
            changeDetected = true;
        else //otherwise, lengths were equal, check each entry
        {
            for (let i = 0; i < prevRender.length; i++){
                if (prevRender[i].props.emergency != displayedUIEvents[i].props.emergency){ //compare
                    changeDetected = true;
                    break;
                }
            }
        }
        if (changeDetected)
        {
            //update success text if no longer needed
            if (prevRender.length == 1 && reportsText == "Successfully Added Report:")
                setReportsText("-- Emergency Reports --");
            setEventsList(displayedUIEvents); //change the state of the rendered array of button objs 
        }
    }
    function toggleViewMode()
    {
        console.log(showAll);
        var viewingAll : boolean = true;
        if (showAll)
            viewingAll = false;
        setShowAll(viewingAll);
        console.log(showAll);
    }
    function sortEventsList(emergencies:ReportFormData[]) //sorts with most recent (latest) events at top of list
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

    if (showAll){
        totalEventList = sortEventsList(totalEventList);
        refreshEventsList(totalEventList);
    }
    else{
        viewableEventList = sortEventsList(viewableEventList);
        refreshEventsList(viewableEventList);
    }
   
    // sort by most recent
    return (
        <div>
            <div className="sidebar-component">
                <p><strong>MACHI(NE) Emergency System</strong></p>
                <button
                    onClick={() => setShowForm(!showForm)}>
                    {showForm ? "[-] Close Form" : "[+] Add Report"}
                </button>

                <button
                    onClick={() => toggleViewMode()}>
                    {showAll ? "Viewing All" : "Viewing Nearby"}
                </button>
            
                <p></p>
                <p><strong>{reportsText}</strong></p>
                <ul>
                    {eventsList}
                </ul>
            </div>
            {showForm && <ReportForm onClose={() => setShowForm(false)} onSubmit={(newEntry:ReportFormData) => addReportEvent(newEntry)}/>}
            {selectedReport && (
                <EmergencyModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    onStatusUpdate={() => null}
                />
            )}
        </div>
    );
}

export default Sidebar;