import Sections from "./components/Sections";
import Loader from "./components/Loader";
import Axios from "axios";
import Pred_Forte from "./assets/Pred_Forte.jpg";
import Homide from "./assets/Homide.jpg";
import Vigamox from "./assets/Vigamox.jpg";
import "./app.css";
import { useEffect, useState } from "react";

const App = () => {
  // --------------------------------------------------------------- //
  // Use State for the Data
  const [dropInfo, setDropInfo] = useState([]);
  const [showtime, setShowtime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const baseURL = "https://drops-back.vercel.app";
  // const baseURL = "http://localhost:3500";

  // --------------------------------------------------------------- //
  // Define a function to format the date
  function formatDate(date) {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  }
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  // --------------------------------------------------------------- //
  // Function to calculate the difference in days between two dates
  function dateDiffInDays(dateString1, dateString2) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    const timeDiff = date2 - date1;
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return Math.abs(Math.floor(daysDiff));
  }
  const startDate = new Date("December 20, 2023");
  const day_num = Math.ceil(dateDiffInDays(startDate, currentDate) + 1);
  const week_num = Math.ceil(day_num / 7);
  const week_current = Math.ceil(day_num - (week_num - 1) * 7);

  // --------------------------------------------------------------- //
  // Define a function to format the time
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  // --------------------------------------------------------------- //
  // Define a function to update drop information
  const updateDrop = async (name, count) => {
    try {
      const currentTime = new Date();
      const showTime = new Intl.DateTimeFormat("en-US", options).format(currentTime);
      console.log("POST Request", name, count, showTime);
      setIsLoading(true);
      const response = await Axios.post(`${baseURL}/update-drop`, { name, count, formattedDate });
      await Axios.post(`${baseURL}/update-showtime`, { showTime: showTime });

      const responseData = response.data;

      if (responseData.success === true) {
        setIsLoading(false);
      }
      await fetchDropInfo(formattedDate).then((data) => setDropInfo(data));
      await fetchShowTime().then((data) => setShowtime(data));
    } catch (error) {
      alert("Error updating drop:", error);
    }
  };

  // --------------------------------------------------------------- //
  // Define a function to fetch time
  const fetchShowTime = async () => {
    try {
      const response = await Axios.get(`${baseURL}/get-showtime`);
      console.log(response.data.time);
      return response.data.time;
    } catch (error) {
      alert("Error fetching showTime:", error);
      return "";
    }
  };

  // --------------------------------------------------------------- //
  // Define a function to fetch drop information
  const fetchDropInfo = async (formattedDate) => {
    try {
      console.log(formattedDate);
      setIsLoading(true);
      const response = await Axios.get(`${baseURL}/get-drop-info?formattedDate=${formattedDate}`);
      if (response.data.length !== 0) {
        setIsLoading(false);
      }
      return response.data;
    } catch (error) {
      alert("Error fetching drop information:", error);
      return [];
    }
  };

  // --------------------------------------------------------------- //
  // Define a function to create a drop
  const createDrop = async (formattedDate) => {
    try {
      setIsLoading(true);
      const response = await Axios.get(`${baseURL}/create-drop?formattedDate=${formattedDate}`);
      await fetchDropInfo(formattedDate).then((data) => setDropInfo(data));
      const responseData = response.data;
      if (responseData.success === true) {
        setIsLoading(false);
      }
      return null;
    } catch (error) {
      alert("Error creating drop");
    }
  };

  // --------------------------------------------------------------- //
  // Use Effect to fetch the data
  useEffect(() => {
    createDrop(formattedDate);
    fetchDropInfo(formattedDate).then((data) => setDropInfo(data));
    fetchShowTime().then((data) => setShowtime(data));
  }, []);

  return (
    <div>
      {isLoading ? (
        <>
          <Loader content="Loading..." />
        </>
      ) : (
        <>
          {/* ---------------------------------------- */}
          {/* Header Section */}
          <header className="App-header">
            <div className="time">
              <h2>Week</h2>
              <h1>
                {week_num}
                <sup className="week-current"> {week_current}/7</sup>
              </h1>
            </div>
            <div className="time">
              <h2>Last updated</h2>
              <h1>{showtime}</h1>
            </div>
          </header>

          {/* ---------------------------------------- */}
          {/* Main Section */}
          <main className="App-main">
            {/* If the array coming from the backend is empty then it will show the button */}
            {dropInfo.map((info, index) => {
              let times, imgUrl;

              if (info.name === "Pred Forte") {
                if (week_num === 1) {
                  times = 10;
                } else if (week_num === 2) {
                  times = 8;
                } else if (week_num === 3) {
                  times = 6;
                } else if (week_num === 4) {
                  times = 4;
                } else if (week_num === 5) {
                  times = 3;
                } else if (week_num === 6) {
                  times = 2;
                } else if (week_num === 7) {
                  times = 1;
                }
                imgUrl = Pred_Forte;
              } else if (info.name === "Vigamox") {
                times = 4;
                imgUrl = Vigamox;
              } else if (info.name === "Homide") {
                times = 2;
                imgUrl = Homide;
              }
              return (
                <Sections
                  key={index}
                  times={times}
                  name={info.name}
                  imgUrl={imgUrl}
                  done={info.count}
                  buttonClick={() => updateDrop(info.name, info.count + 1)}
                />
              );
            })}
          </main>
        </>
      )}
    </div>
  );
};

export default App;
