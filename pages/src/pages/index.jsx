import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="text-center font-array text-5xl text-yellow-300 pt-6">
      <h1 className="pb-10">Departure Boards</h1>
      <h2 className="pb-4">Go to /stationcode to view your station</h2>
      <p className="text-4xl">
        For example{" "}
        <Link className="underline text-white" to="/kgx">
          /kgx
        </Link>
      </p>
      <p className="text-2xl pt-6">
        This also works from the command line, try{" "}
        <span className="font-mono text-white">curl departures.tk</span>
      </p>
    </div>
  );
}
