import Cookies from "js-cookie";
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

import ProtectedRoute from '@/auth';
import FiltroAfastamentoModal from '@/components/afastamento/FiltroAfastamentoModal';
import TableAfastamento from '@/components/afastamento/TableAfastamento';
import NavBar from '@/components/NavBar';
import { ChevronRightIcon, FunnelIcon, PlusCircleIcon } from '@heroicons/react/16/solid';

import { FiltrosAfastamento } from '../../../lib/interfaces/Filtros';

const inter = Inter({style: "normal", weight: "400", subsets: ["latin"]});

export default function AfastamentosPage() {
	const [paramsFilter, setParamsFilter] = useState<FiltrosAfastamento>({} as FiltrosAfastamento);
	const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

	const session = Cookies.get('session');
	const user = session ? JSON.parse(session) : undefined;
  

	return (
		<ProtectedRoute>
			<main>
				<Head>
					<title>Afastamentos | SCAP</title>
					<meta property="og:title" content="SCAP" key="title" />
				</Head>

				<div className="h-screen bg-gray-50 flex">
					<NavBar />

					<button 
						onClick={() => setIsModalFilterOpen(true)}
						className="fixed bottom-4 right-4 bg-slate-200 text-blue-500 rounded-full p-4 shadow-lg"
					>
						<FunnelIcon className="w-6 h-6" />
					</button>

					<div className="flex-grow px-8 py-11">
						<div className="flex items-center justify-between flex-row mb-4">
							<nav className={`flex leading-6 items-center text-md text-slate-500 ${inter.className}`}>
							 	Afastamentos 
								<ChevronRightIcon className="inline-block w-6 h-6" />
								Listagem
							</nav>

							{user?.professorId &&
								<button 
									className="flex py-1 px-2 rounded-md items-center text-green-600 border-[1px] border-green-200 bg-green-100  hover:text-green-800"
								>
									<Link href="/afastamento/solicitacao" className='w-full flex flex-row select-none items-center'>
										<PlusCircleIcon className="w-4 h-4 mr-2" />
								Solicitar Afastamento
									</Link>
								</button>
							}
						</div>

						<div className="w-full">
							<TableAfastamento params={paramsFilter} currentUser={user} />
						</div>
					</div>

					<FiltroAfastamentoModal isOpenState={[isModalFilterOpen, setIsModalFilterOpen]} paramsState={[paramsFilter, setParamsFilter]} />
				</div>
			</main>
		</ProtectedRoute>
	);
}