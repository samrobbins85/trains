import "../styles/index.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<link
					rel="preload"
					href="/fonts/Inter.var.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
