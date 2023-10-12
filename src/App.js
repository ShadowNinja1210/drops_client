import Sections from "./components/Sections";
import Axios from "axios";
import Vigamox from "./assets/Vigamox.jpg";
import Optive from "./assets/Optive.jpg";
import Pred_Forte from "./assets/Pred_Forte.jpg";

import "./app.css";
import { useEffect, useState } from "react";

const App = () => {
  // Use State for the Data
  const [dropInfo, setDropInfo] = useState([]);
  const [showtime, setShowtime] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const baseURL = "https://drops-back.vercel.app";
  let day_num = 0;

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

  const startDate = new Date("October 07, 2023");

  day_num = Math.ceil(dateDiffInDays(startDate, currentDate) + 1);

  const options = {
    hour: "numeric", // "numeric", "2-digit"
    minute: "numeric", // "numeric", "2-digit"
    hour12: true, // true or false
  };

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
      alert("Error updating drop:", error);
    }
  };

  // Define a function to fetch drop information
  const fetchShowTime = async () => {
    try {
      const response = await Axios.get(`${baseURL}/get-showtime`);
      console.log(response.data.time);
      return response.data.time; // Assuming the response contains the showTime
    } catch (error) {
      alert("Error fetching showTime:", error);
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
      alert("Error fetching drop information:", error);
      return []; // Return an empty array in case of an error
    }
  };

  const createDrop = async () => {
    try {
      await Axios.get(`${baseURL}/create-drop`);
      await fetchDropInfo(formattedDate).then((data) => setDropInfo(data));
      return null;
    } catch (error) {
      alert("Error creating drop");
    }
  };

  // Use Effect to fetch the data
  useEffect(() => {
    // Fetch drop information when the component mounts
    Axios.get(`${baseURL}/create-drop`);
    fetchDropInfo(formattedDate).then((data) => setDropInfo(data));
    fetchShowTime().then((data) => setShowtime(data));
  }, [formattedDate]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="time">
          <h2>Day No.</h2>
          <h1>{day_num}</h1>
        </div>
        <div className="time">
          <h2>Last updated</h2>
          <h1>{showtime}</h1>
        </div>
      </header>

      <main className="App-main">
        {dropInfo.length === 0 ? (
          <button className="create-button" onClick={createDrop()}>
            Create
          </button>
        ) : (
          dropInfo.map((info, index) => {
            let times, imgUrl;

            if (info.name === "Optive") {
              times = 3;
              imgUrl = Optive;
            } else if (info.name === "Vigamox") {
              times = 3;
              imgUrl = Vigamox;
            } else {
              if (day_num <= 10) {
                times = 4;
              } else if (day_num <= 20) {
                times = 3;
              } else if (day_num <= 30) {
                times = 2;
              }
              imgUrl = Pred_Forte;
            }

            if (day_num > 1 && info.name === "Homide") {
              return null;
            } else if (day_num > 2 && info.name === "Milflox") {
              return null;
            } else
              return (
                <Sections
                  key={index}
                  times={times}
                  name={info.name}
                  imgUrl={imgUrl}
                  done={info.count}
                  buttonClick={() => {
                    const updatedTime = new Intl.DateTimeFormat("en-US", options).format(new Date());
                    setCurrentTime(updatedTime);
                    updateDrop(info.name, info.count + 1, currentTime);
                  }}
                />
              );
          })
        )}
      </main>
    </div>
  );
};

export default App;
