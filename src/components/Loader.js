import { InfinitySpin } from "react-loader-spinner";

const Loader = ({ content }) => {
  return (
    <div className="loader">
      <InfinitySpin width="200" color="#e1e100" />
      <h1>{content}</h1>
    </div>
  );
};

export default Loader;
