import c from "ansi-colors";
import { table } from "table";
const useStaffVersion = false;
const LiveDepartureBoardService = require("ldbs-json");
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const options = {
    crs: "DHM",
  };
  const api = new LiveDepartureBoardService(nationalrail, useStaffVersion);
  const resp = await api.call("GetDepBoardWithDetails", options);
  const data = resp.GetStationBoardResult.trainServices.service.map((item) => [
    c.yellowBright(item.std),
    c.yellowBright(item.destination.location.crs),
    c.yellowBright(item.platform || ""),
    c.yellowBright(item.etd),
  ]);
  data.unshift(["Time", "Destination", "Plat", "Expected"]);
  // const data = [
  //   ["0A", "0B", "0C"],
  //   ["1A", "1B", "1C"],
  //   ["2A", "2B", "2C"],
  // ];
  // return new Response(
  //   c.blue(
  //     `${resp.GetStationBoardResult.trainServices.service[0].destination.location.crs}\n`
  //   )
  // );
  return new Response(
    table(data, {
      header: {
        alignment: "center",
        content: resp.GetStationBoardResult.locationName,
      },
    })
  );
}
