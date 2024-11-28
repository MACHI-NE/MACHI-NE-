import MainMap from "./components/Map"
import { useState } from "react";
import { ReportForm } from "./components/ReportForm/index.tsx";


export default function App() {
  const [showForm, setShowForm] = useState(false);

  return (
      <div>
      <MainMap eventReportList={
        [
        {
          description: "Community Cleanup Event",
          date: new Date("2024-11-28"),
          location: [49.2827, -123.1207],
        },
        {
          description: "Local Farmers Market",
          date: new Date("2024-12-01"),
          location: [49.2632, -123.830],
        }
      ]}
      setVisiblePoints={
        (lis) => {
          console.clear()
          lis.forEach((a)=>{
            console.log(a.description)})
        }

      }

      />
    </div>
  )
  //   <div>
  //     <button onClick={() => setShowForm(!showForm)}>
  //       {showForm ? "Hide Report Form" : "View Report Form"}
  //     </button>
  //     {showForm && <ReportForm onClose={() => setShowForm(false)} />}
  //   </div>
  // );
}