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
  const [showtime, setShowtime] = useState("");
  const baseURL = "https://drops-back.vercel.app";
  let week = 0;

  // Define a function to format the date
  function formatDate(date) {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  }
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  function dateDiffInDays(dateString1, dateString2) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    // Calculate the time difference in milliseconds
    const timeDiff = date2 - date1;

    // Convert milliseconds to days
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    return Math.abs(Math.floor(daysDiff)); // Use Math.abs to get a positive value
  }

  const startDate = new Date("September 21, 2023");

  week = Math.ceil((dateDiffInDays(startDate, currentDate) + 1) / 7);

  const options = {
    hour: "numeric", // "numeric", "2-digit"
    minute: "numeric", // "numeric", "2-digit"
    hour12: true, // true or false
  };
  const currentTime = new Intl.DateTimeFormat("en-US", options).format(currentDate);

  // Define a function to update drop information
  const updateDrop = async (name, count, showTime) => {
    try {
      // Send a POST request to the back-end to update drop information
      console.log("POST Request", name, count, showTime);
      await Axios.post(`${baseURL}/update-drop`, { name, count, formattedDate });
      await Axios.post(`${baseURL}/update-showtime`, { showTime: showTime });
      await fetchDropInfo(formattedDate).then((data) => setDropInfo(data));
      await fetchShowTime().then((data) => setShowtime(data));
    } catch (error) {
      console.error("Error updating drop:", error);
    }
  };

  // Define a function to fetch drop information
  const fetchShowTime = async () => {
    try {
      const response = await Axios.get(`${baseURL}/get-showtime`);
      console.log(response.data.time);
      return response.data.time; // Assuming the response contains the showTime
    } catch (error) {
      console.error("Error fetching showTime:", error);
      return "";
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
    fetchShowTime().then((data) => setShowtime(data));
  }, [formattedDate]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="time">
          <h2>Week No.</h2>
          <h1>{week}</h1>
        </div>
        <div className="time">
          <h2>Last updated</h2>
          <h1>{showtime}</h1>
        </div>
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
            switch (week) {
              case 1:
                times = 8;
                break;
              case 2:
                times = 6;
                break;
              case 3:
                times = 4;
                break;
              case 4:
                times = 3;
                break;
              case 5:
                times = 2;
                break;
              case 6:
                times = 1;
                break;
              default:
                times = 0; // Default value when week is not 1 to 6
            }
            imgUrl = Pred_Forte;
          }

          if (week > 1 && info.name === "Homide") {
            return;
          } else if (week > 2 && info.name === "Milflox") {
            return;
          } else return <Sections key={index} times={times} name={info.name} imgUrl={imgUrl} done={info.count} buttonClick={() => updateDrop(info.name, info.count + 1, currentTime)} />;
        })}
      </main>
    </div>
  );
};

export default App;
