import { Inter } from 'next/font/google';
import Head from 'next/head';

import ProtectedRoute from '@/auth';
import TableAfastamento from '@/components/afastamento/TableAfastamento';
import NavBar from '@/components/NavBar';
import { ChevronRightIcon } from '@heroicons/react/16/solid';

const inter = Inter({style: "normal", weight: "400", subsets: ["latin"]});

export default function AfastamentosPage() {

	return (
		<ProtectedRoute>
			<main>
				<Head>
					<title>Afastamentos | SCAP</title>
					<meta property="og:title" content="SCAP" key="title" />
				</Head>

				<div className="min-h-screen bg-gray-50 flex">
					<NavBar />

					<div className="flex-grow px-8 py-11">
						<nav className={`flex leading-6 items-center text-md text-slate-500 mb-4 ${inter.className}`}>
							 	Afastamentos 
							<ChevronRightIcon className="inline-block w-6 h-6" />
								Listagem
						</nav>

						<div className="w-full">
							<TableAfastamento />
						</div>
					</div>
				</div>
			</main>
		</ProtectedRoute>
	);
}