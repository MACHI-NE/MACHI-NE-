import './sidebar.css'

enum SortMethod
{
    Time,
    Proximity,
    Type
}

interface EmergencyEvent //testing purposes only
{
    location: string;
    type: string;
    time: string;
    status: string;
}

export function Sidebar()
{
    //test events
    /*
    var testEvent1: EmergencyEvent(location:"a",type:"a");
    var eventList: EventUIObj[];
    var width: string = "20";
    var sortingMode: SortMethod = SortMethod.Proximity;
    */
    return (
        <div>
            <button>Function 1</button>
            <button>Function 2</button>
            <button>X</button>
            <ul>
                <>{}</>
            </ul>
        </div>
    );
}

function EventUIObj(location:string,type:string,time:string,status:string)
{
    return (
        <button>
            Location:{location} Type:{type} Time:{time} Status:{status}
        </button>
    );
}

export function CollapseSideBar()
{
    
}

export function RefreshEventList()
{

}