import Sections from "./components/Sections";
import Axios from "axios";
import Homide from "./assets/Homide.jpg";
import Milflox from "./assets/Milflox.jpg";
import Pred_Forte from "./assets/Pred_Forte.jpg";

import "./app.css";
import { useEffect, useState } from "react";

const App = () => {
  // Use State for the Data
  const [dropInfo, setDropInfo] = useState([]);

  // Define a function to format the date
  function formatDate(date) {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  }
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  // Define a function to update drop information
  const updateDrop = async (name, count) => {
    try {
      // Send a POST request to the back-end to update drop information
      await Axios.post(`${baseURL}/update-drop`, { name, count, formattedDate });
      fetchDropInfo(formattedDate).then((data) => setDropInfo(data));
    } catch (error) {
      console.error("Error updating drop:", error);
    }
  };

  // Define a function to fetch drop information
  const fetchDropInfo = async (formattedDate) => {
    try {
      // Send a GET request to the back-end to fetch drop information
      console.log(formattedDate);
      const response = await Axios.get(`${baseURL}/get-drop-info?formattedDate=${formattedDate}`);
      return response.data; // Assuming the response contains drop information
    } catch (error) {
      console.error("Error fetching drop information:", error);
      return []; // Return an empty array in case of an error
    }
  };

  // Use Effect to fetch the data
  useEffect(() => {
    // Fetch drop information when the component mounts
    fetchDropInfo(formattedDate).then((data) => setDropInfo(data));
  }, [formattedDate]);
  const baseURL = "https://drops-back.vercel.app";

  return (
    <div className="App">
      <header className="App-header">
        <h1>Week-1</h1>
        <h1>Day-3</h1>
      </header>
      <main className="App-main">
        {dropInfo?.map?.((info, index) => {
          let times, imgUrl;

          if (info.name === "Homide") {
            times = 2;
            imgUrl = Homide;
          } else if (info.name === "Milflox") {
            times = 4;
            imgUrl = Milflox;
          } else {
            times = 8;
            imgUrl = Pred_Forte;
          }
          return <Sections key={index} times={times} name={info.name} imgUrl={imgUrl} done={info.count} buttonClick={() => updateDrop(info.name, info.count + 1)} />;
        })}
      </main>
    </div>
  );
};

export default App;
