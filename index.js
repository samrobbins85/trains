import c from "ansi-colors";
import { table } from "table";
import { Router } from "itty-router";
import station_list from "./station_locations";
import { findNearest } from "geolib";
const useStaffVersion = false;
const LiveDepartureBoardService = require("ldbs-json");

const router = Router();

addEventListener("fetch", (event) => {
  event.respondWith(router.handle(event.request));
});

async function getDepartureBoard(station) {
  const api = new LiveDepartureBoardService(nationalrail, useStaffVersion);
  const resp = await api.call("GetDepBoardWithDetails", { crs: station });
  const data = resp.GetStationBoardResult.trainServices.service.map((item) => [
    c.yellowBright(item.std),
    c.yellowBright(item.destination.location.crs),
    c.yellowBright(item.platform || ""),
    c.yellowBright(item.etd),
  ]);
  data.unshift(["Time", "Destination", "Plat", "Expected"]);
  return table(data, {
    header: {
      alignment: "center",
      content: resp.GetStationBoardResult.locationName,
    },
  });
}

router.get("/:station", async ({ params }) => {
  let input = decodeURIComponent(params.station).toUpperCase();
  const result = await getDepartureBoard(input);
  return new Response(result);
});

router.get("/", async (request) => {
  const cf = request.cf;
  var closest = "KGX";
  if (cf !== undefined && cf.country === "GB") {
    closest = findNearest(
      { latitude: cf.latitude, longitude: cf.longitude },
      station_list
    );
  }
  const result = await getDepartureBoard(closest["3alpha"]);
  return new Response(result);
});
