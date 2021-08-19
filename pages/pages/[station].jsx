import Head from "next/head";
import useSWR from "swr";
import { useRouter } from "next/router";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function IndexPage() {
	const router = useRouter();
	const { station } = router.query;
	const { data, error } = useSWR(
		`http://departures.tk/json/${station}`,
		fetcher
	);
	if (error)
		return (
			<div className="text-center pt-4 font-array text-3xl">
				Looks like that station does not exist
			</div>
		);
	if (!data) return null;
	return (
		<>
			<Head>
				<title>{data.GetStationBoardResult.locationName}</title>
			</Head>
			<div className="pt-6">
				<h1 className="text-center text-3xl font-semibold">
					{data.GetStationBoardResult.locationName}
				</h1>
				<table className="mx-auto my-6 text-2xl">
					<thead>
						<th className="px-4 border">Time</th>
						<th className="px-4 border">Destination</th>
						<th className="px-4 border">Platform</th>
						<th className="px-4 border">Expected</th>
					</thead>
					<tbody className="text-yellow-300 font-array">
						{data.GetStationBoardResult.trainServices.service.map(
							(item) => (
								<tr key={item.std}>
									<td className="border pl-2">{item.std}</td>
									<td className="border pl-2">
										{item.destination.location.crs}
									</td>
									<td className="border pl-2">
										{item.platform || ""}
									</td>
									<td className="border pl-2">
										{item.cancelReason
											? "Cancelled"
											: item.etd}
									</td>
								</tr>
							)
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}
