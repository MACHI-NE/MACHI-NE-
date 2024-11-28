import MainMap from "./components/Map"

export default function App() {
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
}