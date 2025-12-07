import { Context, Hono } from "hono";
import { renderer } from "./renderer";
import { findNearest } from "geolib";
import stations from "./data/station_locations";
import c from "ansi-colors";
import { table } from "table";
import { GeolibInputCoordinates } from "geolib/es/types";
import { isTerminal } from "./utils/isTerminal";
import DepartureTable from "./depatureTable";
import type { paths } from "../types/api";
const app = new Hono<{ Bindings: CloudflareBindings }>();
type DepartureBoardResponse =
  paths["/api/20220120/GetDepartureBoard/{crs}"]["get"]["responses"]["200"]["content"]["text/json"];

async function getDepartureData(
  station: string,
  token: string,
  api_url: string
): Promise<DepartureBoardResponse> {
  const data = await fetch(
    api_url + `/LDBWS/api/20220120/GetDepartureBoard/${station}`,
    {
      headers: {
        "x-apikey": token,
      },
    }
  );
  return await data.json();
}

function nearestStation(cf: any) {
  let closest = null as any;
  if (cf !== undefined && cf.country === "GB") {
    closest = findNearest(
      { latitude: cf.latitude!, longitude: cf.longitude! },
      stations.map((station) => ({
        latitude: station.lat,
        longitude: station.long,
        stationName: station.stationName,
        crsCode: station.crsCode,
      }))
    );
  }
  return closest as GeolibInputCoordinates & {
    stationName: string;
    crsCode: string;
  };
}

async function getDepartureBoard(departureData: DepartureBoardResponse) {
  if (departureData) {
    if (departureData.trainServices) {
      const data = departureData.trainServices.map((item: any) => [
        c.yellowBright(item.std),
        c.yellowBright(item.destination[0].locationName),
        c.yellowBright(item.platform || ""),
        c.yellowBright(item.isCancelled ? "Cancelled" : item.etd),
      ]);
      data.unshift(["Time", "Destination", "Plat", "Expected"]);
      return table(data, {
        header: {
          alignment: "center",
          content: departureData.locationName || "",
        },
      });
    } else {
      return "That station doesn't have any departures\n";
    }
  } else {
    return "That station could not be found\n";
  }
}

app.use(renderer);

const handleCRSCode = async (c: Context, code: string, isHome = false) => {
  const departureData = await getDepartureData(
    code,
    c.env.API_TOKEN,
    c.env.API_URL
  );

  if (isTerminal(c.req.header("User-Agent"))) {
    const departureBoard = await getDepartureBoard(departureData);

    return c.body(departureBoard);
  }
  return c.render(<DepartureTable data={departureData} isHome={isHome} />);
};

app.get("/", async (c) => {
  const closest = nearestStation(c.req.raw.cf);
  return handleCRSCode(c, closest.crsCode || "KGX", true);
});

app.get("/:crs", async (c) => {
  const name = c.req.param("crs");
  return handleCRSCode(c, name.toUpperCase());
});

export default app;
