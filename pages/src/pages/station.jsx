import { useParams } from "react-router";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Station() {
  let { station } = useParams();
  const { data, error } = useSWR(
    `https://trains-production.samrobbins.workers.dev/json/${station}`,
    fetcher
  );
  if (error)
    return (
      <div className="text-center pt-4 font-array text-3xl">
        Looks like that station does not exist
      </div>
    );
  if (!data) return null;
  console.log(data);
  return (
    <>
      <div className="pt-6">
        <h1 className="text-center text-3xl font-semibold">
          {data.GetStationBoardResult.locationName}
        </h1>
        {data.GetStationBoardResult.trainServices ? (
          <table className="mx-auto my-6 text-2xl">
            <thead>
              <th className="px-4 border">Time</th>
              <th className="px-4 border">Destination</th>
              <th className="px-4 border">Platform</th>
              <th className="px-4 border">Expected</th>
            </thead>
            <tbody className="font-array text-amber-300">
              {data.GetStationBoardResult.trainServices.service.map((item) => (
                <tr key={item.std}>
                  <td className="border pl-2 border-white">{item.std}</td>
                  <td className="border pl-2 border-white">
                    {item.destination.location.crs}
                  </td>
                  <td className="border pl-2 border-white">
                    {item.platform || ""}
                  </td>
                  <td className="border pl-2 border-white">
                    {item.cancelReason ? "Cancelled" : item.etd}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2 className="text-center font-array text-amber-300 text-xl">
            This station has no departures
          </h2>
        )}
      </div>
    </>
  );
}
