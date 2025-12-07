export default function DepartureTable({ data, isHome }) {
  return (
    <>
      <link
        href="https://api.fontshare.com/v2/css?f[]=array@401&display=swap"
        rel="stylesheet"
      />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <title>{data.locationName} - Departure Board</title>
      <body class="bg-black text-white">
        <div className="pt-6">
          <h1 className="text-center text-3xl font-semibold">
            {data.locationName}
          </h1>
          {data.trainServices ? (
            <table className="mx-auto my-6 text-2xl">
              <thead>
                <th className="px-4 border">Time</th>
                <th className="px-4 border">Destination</th>
                <th className="px-4 border">Platform</th>
                <th className="px-4 border">Expected</th>
              </thead>
              <tbody className="font-array text-amber-300">
                {data.trainServices.map((item) => (
                  <tr key={item.std}>
                    <td className="border pl-2 border-white">{item.std}</td>
                    <td className="border pl-2 border-white">
                      {item.destination[0].locationName}
                    </td>
                    <td className="border pl-2 border-white">
                      {item.platform || ""}
                    </td>
                    <td className="border pl-2 border-white">
                      {item.isCancelled ? "Cancelled" : item.etd}
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
        {isHome && (
          <div class="text-center">
            <p>Go to /stationcode to view your station</p>
            <p>
              For example{" "}
              <a href="/kgx" class="text-white underline">
                /kgx
              </a>
            </p>
            <p>
              This also works from the command line, try{" "}
              <span class="text-amber-300">
                curl https://trains.samrobbins.uk
              </span>
            </p>
          </div>
        )}
      </body>
    </>
  );
}
