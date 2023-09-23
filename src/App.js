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
  // Use State for update trigger
  const [updateTrigger, setUpdateTrigger] = useState(false);

  // Use Effect to fetch the data
  useEffect(() => {
    // Fetch drop information when the component mounts
    fetchDropInfo().then((data) => setDropInfo(data));
    console.log(dropInfo);
  }, [updateTrigger, dropInfo]);

  // Define a function to update drop information
  const updateDrop = async (name, count) => {
    try {
      // Send a POST request to the back-end to update drop information
      await Axios.post("https://drops-client-theta.vercel.app/update-drop", { name, count });
      setUpdateTrigger(!updateTrigger);
    } catch (error) {
      console.error("Error updating drop:", error);
    }
  };

  // Define a function to fetch drop information
  const fetchDropInfo = async () => {
    try {
      // Send a GET request to the back-end to fetch drop information
      const response = await Axios.get("https://drops-client-theta.vercel.app/get-drop-info");
      return response.data; // Assuming the response contains drop information
    } catch (error) {
      console.error("Error fetching drop information:", error);
      return []; // Return an empty array in case of an error
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Week-1</h1>
        <h1>Day-3</h1>
      </header>
      <main className="App-main">
        {dropInfo.map((info, index) => {
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
