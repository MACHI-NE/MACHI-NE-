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

enum SortingMode {
    Time,
    Region,
    Type,
    Status
}

const Sidebar: React.FC<SidebarProps> = ({viewableEventList, totalEventList, onReportSelect, onReportAdd}) =>
{
    let displayedUIEvents: React.ReactElement[] = []; //list of UI objects
    let index : number = 1;
    const [showForm, setShowForm] = useState(false);
    const [showAll, setShowAll] = useState(true);
    const [selectedReport, setSelectedReport] = useState<ReportFormData | null>(null);
    const [eventsList, setEventsList] = useState(displayedUIEvents);
    const [sortMod, setSortMod] = useState(SortingMode.Time);
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
            setEventsList(displayedUIEvents); //change the state of the rendered array of button objs 
    }
    function toggleViewMode()
    {
        var viewingAll : boolean = true;
        if (showAll)
            viewingAll = false;
        setShowAll(viewingAll);
    }
    function updateSort(newMode:SortingMode)
    {
        setSortMod(newMode);

        if (showAll){
            totalEventList = sortEventList(totalEventList);
            refreshEventsList(totalEventList);
        }
        else{
            viewableEventList = sortEventList(viewableEventList);
            refreshEventsList(viewableEventList);
        }
    }
    function sortMostRecent(emergencies:ReportFormData[]) //sorts with most recent (latest) events at top of list
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
    function sortRegionAlpha(emergencies:ReportFormData[])
    {
        let sortedEvents: ReportFormData[] = emergencies.slice();
        sortedEvents.sort((a, b) => 
            {
                //sort by type name, in alphabetical 
                if (a.location < b.location) 
                    return -1;
                else if (a.location < b.location)
                    return 1;
                return 0; 
            });
        return sortedEvents;
    }
    function sortTypeAlpha(emergencies:ReportFormData[])
    {
        let sortedEvents: ReportFormData[] = emergencies.slice();
        sortedEvents.sort((a, b) => 
            {
                //sort by type name, in alphabetical 
                if (a.type < b.type) 
                    return -1;
                else if (a.type < b.type)
                    return 1;
                return 0; 
            });
        return sortedEvents;
    }
    function sortStatus(emergencies:ReportFormData[])
    {
        let sortedEvents: ReportFormData[] = emergencies.slice();
        sortedEvents.sort((a, b) => 
            {
                //sort by type name, in alphabetical 
                if (a.status=='OPEN' && b.status=='RESOLVED') 
                    return -1; //place 'a' earlier if is open
                else if (a.status=='RESOLVED' && b.status=='OPEN')
                    return 1;
                return 0; // 
            });
        return sortedEvents;
    }
    function sortEventList(emergencies:ReportFormData[]) //sorts based on selected filters
    {
        let sortedEvents : ReportFormData[] = emergencies.slice();
        if (sortMod == SortingMode.Time)
            sortedEvents = sortMostRecent(emergencies); // sort by time
        else if (sortMod == SortingMode.Region)
            sortedEvents = sortRegionAlpha(emergencies); //sort by type name
        else if (sortMod == SortingMode.Type) 
            sortedEvents = sortTypeAlpha(emergencies);
        else
            sortedEvents = sortStatus(emergencies);

        return sortedEvents;
    }

    if (showAll){
        totalEventList = sortEventList(totalEventList);
        refreshEventsList(totalEventList);
    }
    else{
        viewableEventList = sortEventList(viewableEventList);
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
            
                <p><strong>Sorting Options:</strong></p>
                <button
                    onClick={() => updateSort(SortingMode.Time)}>
                    {sortMod == SortingMode.Time ? "⏶ Time" : "- Time"}
                </button>
                <button
                    onClick={() => updateSort(SortingMode.Region)}>
                    {sortMod == SortingMode.Region ? "⏶ Region" : "- Region"}
                </button>
                <button
                    onClick={() => updateSort(SortingMode.Type)}>
                    {sortMod == SortingMode.Type ? "⏶ Type" : "- Type"}
                </button>
                <button
                    onClick={() => updateSort(SortingMode.Status)}>
                    {sortMod == SortingMode.Status ? "⏶ Status" : "- Status"}
                </button>
                <p><strong>-- Emergency Reports --</strong></p>
                
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
                    onReportRemove={() => null}
                />
            )}
        </div>
    );
}

export default Sidebar;