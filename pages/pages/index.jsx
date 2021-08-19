import Link from "next/link";

export default function HomePage() {
	return (
		<div className="text-center font-array text-5xl text-yellow-300 pt-6">
			<h1 className="pb-10">Departure Boards</h1>
			<div className="pb-4">Go to /stationcode to view your station</div>
			<div className="text-4xl">
				For example{" "}
				<Link href="/kgx">
					<a className="underline text-white">/kgx</a>
				</Link>
			</div>
		</div>
	);
}
