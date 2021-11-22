import c from "ansi-colors";
import { table } from "table";
import { Router } from "itty-router";
import station_list from "./station_locations";
import { findNearest } from "geolib";
const useStaffVersion = false;
const LiveDepartureBoardService = require("ldbs-json");

const terminals = [
  "curl",
  "httpie",
  "lwp-request",
  "wget",
  "python-requests",
  "openbsd ftp",
  "powershell",
  "fetch",
  "aiohttp",
];

const router = Router();

addEventListener("fetch", (event) => {
  event.respondWith(router.handle(event.request));
});

async function getDepartureData(station) {
  const api = new LiveDepartureBoardService(nationalrail, useStaffVersion);
  const resp = await api.call("GetDepBoardWithDetails", { crs: station });
  return resp;
}

async function getDepartureBoard(station) {
  const departureData = await getDepartureData(station);
  if (departureData) {
    if (departureData.GetStationBoardResult.trainServices) {
      const data = departureData.GetStationBoardResult.trainServices.service.map(
        (item) => [
          c.yellowBright(item.std),
          c.yellowBright(item.destination.location.crs),
          c.yellowBright(item.platform || ""),
          c.yellowBright(item.cancelReason ? "Cancelled" : item.etd),
        ]
      );
      data.unshift(["Time", "Destination", "Plat", "Expected"]);
      return table(data, {
        header: {
          alignment: "center",
          content: departureData.GetStationBoardResult.locationName,
        },
      });
    } else {
      return "That station doesn't have any departures\n";
    }
  } else {
    return "That station could not be found\n";
  }
}

function isTerminal(request) {
  return terminals.some((element) =>
    request.headers.get("User-Agent").includes(element)
  );
}

function nearestStation(cf) {
  let closest = null;
  if (cf !== undefined && cf.country === "GB") {
    closest = findNearest(
      { latitude: cf.latitude, longitude: cf.longitude },
      station_list
    );
  }
  return closest;
}

// This is a browser wanting the equivalent of /
router.get("/json", async (request) => {
  const cf = request.cf;
  const closest = nearestStation(cf);
  return new Response(
    JSON.stringify(await getDepartureData(closest["3alpha"])),
    {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
});

router.get("/:station", async (req) => {
  let input = decodeURIComponent(req.params.station).toUpperCase();
  // Station codes only have length 3
  if (input.length === 3) {
    if (isTerminal(req)) {
      const result = await getDepartureBoard(input);
      return new Response(result);
    } else {
      return Response.redirect(
        `https://trains.pages.dev/${req.params.station}`
      );
    }
  }
});

// This is a browser wanting the equivalent of /station
router.get("/json/:station", async ({ params }) => {
  let input = decodeURIComponent(params.station).toUpperCase();
  if (input.length === 3) {
    return new Response(JSON.stringify(await getDepartureData(input)), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});

router.get("/", async (request) => {
  const cf = request.cf;
  if (isTerminal(request)) {
    console.log(JSON.stringify(cf));
    const closest = nearestStation(cf);
    console.log(closest);
    const result = await getDepartureBoard(closest["3alpha"] || "KGX");
    return new Response(result);
  } else {
    return Response.redirect("https://trains.pages.dev");
  }
});

router.all("*", () => new Response("Not Found.", { status: 404 }));
