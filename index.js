import c from "ansi-colors";
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
  return new Response(JSON.stringify(resp), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
