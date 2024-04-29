import Head from "next/head";

export default function PageNotFoundorNoRight() {
	return (
		<div>
			<Head>
				<title>Not Found | SCAP</title>
				<meta property="og:title" content="SCAP" key="title" />
			</Head>

			<div className="min-h-screen bg-gray-50 flex">
				<div className="flex-grow px-8 py-11">
					<div className="w-full bg-slate-100 rounded-md py-6 px-4 drop-shadow-[0_2px_4px_rgba(15,23,42,0.2)]">
						<h1 className="text-slate-700 capitalize font-bold text-2xl mb-5">404 - Not Found</h1>
						<h1 className="text-slate-600 text-lg mb-5">Essa página não existe ou você não tem permissão para acessar essa página</h1>
					</div>
				</div>
			</div>
		</div>
	);
}