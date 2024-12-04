import './sidebar.css'
import { ReportFormData } from "../types";
import { ReportForm } from './ReportForm';
import { EmergencyModal } from './EmergencyModal';
import { useState } from "react";
import { addReport, getStoredPassword, updatePassword } from '../store/reportStore';
import md5 from "md5";

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

const Sidebar: React.FC<SidebarProps> = ({ viewableEventList, totalEventList, onReportSelect, onReportAdd }) => {
    const displayedUIEvents: React.ReactElement[] = []; //list of UI objects
    let index: number = 1;
    const [showForm, setShowForm] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ReportFormData | null>(null);
    const [eventsList, setEventsList] = useState(displayedUIEvents);
    const [sortMod, setSortMod] = useState(SortingMode.Time);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const hashedCorrectPassword = getStoredPassword() || md5('temp');

    const handlePasswordChange = () => {
        if (md5(oldPassword) === hashedCorrectPassword) {
            const newPasswordHash = md5(newPassword);
            updatePassword(newPasswordHash);
            alert("Password changed successfully");
            setOldPassword("");
            setNewPassword("");
            setShowPasswordChange(false);
        } else {
            alert("Incorrect current password");
            setOldPassword("");
            setNewPassword("");
        }
    };

    // UI object to create in sidebar list
    function EventUIObj({ emergency }: { emergency: ReportFormData }) //functional component of event UI list item
    {
        return <button className="sidebar-event-item" onClick={() => onReportSelect(emergency)}>
            <strong>{emergency.location}, {emergency.type === 'Other' ? emergency.customType : emergency.type}</strong>
            <p></p> {new Date(emergency.time).toLocaleString()} , {emergency.status}
        </button>
    }
    function addReportEvent(newEvent: ReportFormData) //when adding new report via sidebar
    {
        onReportAdd(newEvent); //trigger report list update in main app
    }
    function refreshEventsList(emergencies: ReportFormData[]) //for handling list rerendering after map moves
    {
        displayedUIEvents.length = 0; // Clear the array
        const prevRender: React.ReactElement[] = eventsList; //get array from last render
        emergencies.forEach(emergency => {
            displayedUIEvents.push(<EventUIObj emergency={emergency} key={index++} />); //create new array
        });
        // if there was a change, rerender
        let changeDetected: boolean = false;
        if (prevRender.length != displayedUIEvents.length) // if lengths are not equal, there was a change
            changeDetected = true;
        else //otherwise, lengths were equal, check each entry
        {
            for (let i = 0; i < prevRender.length; i++) {
                if (prevRender[i].props.emergency != displayedUIEvents[i].props.emergency) { //compare
                    changeDetected = true;
                    break;
                }
            }
        }
        if (changeDetected)
            setEventsList(displayedUIEvents); //change the state of the rendered array of button objs 
    }
    function toggleViewMode() {
        let viewingAll: boolean = true;
        if (showAll)
            viewingAll = false;
        setShowAll(viewingAll);
    }
    function updateSort(newMode: SortingMode) {
        setSortMod(newMode);

        if (showAll) {
            totalEventList = sortEventList(totalEventList);
            refreshEventsList(totalEventList);
        }
        else {
            viewableEventList = sortEventList(viewableEventList);
            refreshEventsList(viewableEventList);
        }
    }
    function sortMostRecent(emergencies: ReportFormData[]) //sorts with most recent (latest) events at top of list
    {
        const sortedEvents: ReportFormData[] = emergencies.slice();
        sortedEvents.sort((a, b) => {
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
    function sortRegionAlpha(emergencies: ReportFormData[]) {
        const sortedEvents: ReportFormData[] = emergencies.slice();
        sortedEvents.sort((a, b) => {
            //sort by type name, in alphabetical 
            if (a.location < b.location)
                return -1;
            else if (a.location > b.location)
                return 1;
            return 0;
        });
        return sortedEvents;
    }
    function sortTypeAlpha(emergencies: ReportFormData[]) {
        const sortedEvents: ReportFormData[] = emergencies.slice();
        sortedEvents.sort((a, b) => {
            //sort by type name, in alphabetical 
            if (a.type < b.type)
                return -1;
            else if (a.type > b.type)
                return 1;
            return 0;
        });
        return sortedEvents;
    }
    function sortStatus(emergencies: ReportFormData[]) {
        const sortedEvents: ReportFormData[] = emergencies.slice();
        sortedEvents.sort((a, b) => {
            //sort by type name, in alphabetical 
            if (a.status == 'OPEN' && b.status == 'RESOLVED')
                return -1; //place 'a' earlier if is open
            else if (a.status == 'RESOLVED' && b.status == 'OPEN')
                return 1;
            return 0; // 
        });
        return sortedEvents;
    }
    function sortEventList(emergencies: ReportFormData[]) //sorts based on selected filters
    {
        let sortedEvents: ReportFormData[] = emergencies.slice();
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

    if (showAll) {
        totalEventList = sortEventList(totalEventList);
        refreshEventsList(totalEventList);
    }
    else {
        viewableEventList = sortEventList(viewableEventList);
        refreshEventsList(viewableEventList);
    }

    // sort by most recent
    return (
        <div>
            <div className="sidebar-component flex justify-between flex-col">
                <div>
                    <p><strong>MACHI(NE) Emergency System</strong></p>
                    <button
                        onClick={() => setShowForm(!showForm)}>
                        {showForm ? "[-] Close Form" : "[+] Add Report"}
                    </button>
                    <p><strong>Toggle View Mode</strong></p>
                    <button
                        onClick={() => toggleViewMode()}>
                        {showAll ? "ALL" : "NEARBY"}
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

                {/* Add password change section at bottom */}
                <div className="mt-4 pt-4">
                    {!showPasswordChange ? (
                        <button
                            onClick={() => setShowPasswordChange(true)}
                            className="w-full px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                        >
                            Change Operator Password
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-3 bg-white py-2 border border-slate-500 rounded  placeholder-slate-600"
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-white px-3 py-2 border border-slate-500 rounded placeholder-slate-600"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePasswordChange}
                                    className="flex-1 px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 placeholder-slate-700 rounded"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPasswordChange(false);
                                        setOldPassword("");
                                        setNewPassword("");
                                    }}
                                    className="flex-1 px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showForm && <ReportForm onClose={() => setShowForm(false)} onSubmit={(newEntry: ReportFormData) => {
                addReportEvent(newEntry)
                addReport(newEntry)
            }} />}
            {selectedReport && (
                <EmergencyModal
                    report={selectedReport}
                    onClose={() => {
                        setSelectedReport(null);
                        refreshEventsList(showAll ? totalEventList : viewableEventList);
                    }}
                    onStatusUpdate={(updatedReport, newStatus) => {
                        setSelectedReport({ ...updatedReport, status: newStatus });
                        refreshEventsList(showAll ? totalEventList : viewableEventList);
                    }}
                    onReportRemove={() => setSelectedReport(null)}
                    onReportEdit={(oldReport, newReport) => {
                        setSelectedReport(newReport);
                        refreshEventsList(showAll ? totalEventList : viewableEventList);
                    }}
                />
            )}
        </div>
    );
}

export default Sidebar;