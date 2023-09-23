import "./components.css";

const Checks = ({ num, cla }) => {
  return (
    <div className={`checks ${cla}`}>
      <p>{num}</p>
      <div></div>
    </div>
  );
};

const Sections = ({ name, done, times, imgUrl, buttonClick }) => {
  const checksArray = Array.from({ length: times }, (_, index) => <Checks key={index} num={index + 1} cla={index < done ? "done" : "left"} />);

  return (
    <div className="sections">
      <div className="top">
        <h3 className="top_name">{name}</h3>
        <h3 className="top_times">
          <span className="top_times-left"> {done} /</span>
          <span className="top_times-done"> {times}</span>
        </h3>
      </div>
      <div className="body">
        <img src={imgUrl} alt="Homide" />
        <div className="body_checklist">
          <button className="body_checklist-button" onClick={buttonClick}>
            +
          </button>
          <div className="body_checklist-checks">{checksArray}</div>
        </div>
      </div>
    </div>
  );
};

export default Sections;
