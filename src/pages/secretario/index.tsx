import Cookies from "js-cookie";
import { Inter } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import ProtectedRoute from "@/auth";
import NavBar from "@/components/NavBar";
import TablePessoa from "@/components/pessoa/TabelaPessoa";
import { ChevronRightIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { Pessoa } from "@prisma/client";

import { FiltrosPessoa, TipoPessoa } from "../../../lib/interfaces/Filtros";

const inter = Inter({style: "normal", weight: "400", subsets: ["latin"]});

export default function ProfessorListagem() {
	const [paramsFilter, setParamsFilter] = useState<FiltrosPessoa>({tipo: TipoPessoa.secretario} as FiltrosPessoa);

	const session = Cookies.get('session');
	const user = session ? JSON.parse(session) : undefined;

	return (
		<ProtectedRoute>
			<main>
				<Head>
					<title>Secretários | SCAP</title>
					<meta property="og:title" content="SCAP" key="title" />
				</Head>

				<div className="h-screen bg-gray-50 flex">
					<NavBar />

					<div className="flex-grow px-8 py-11">
						<div className="flex items-center justify-between flex-row mb-4">
							<nav className={`flex leading-6 items-center text-md text-slate-500 ${inter.className}`}>
							Secretários 
								<ChevronRightIcon className="inline-block w-6 h-6" />
								Listagem
							</nav>

							{user?.secretarioId &&
                <button 
                	className="flex py-1 px-2 rounded-md items-center text-green-600 border-[1px] border-green-200 bg-green-100  hover:text-green-800"
                >
                	<Link href={{pathname: "/pessoa", query: {tipo: TipoPessoa.secretario}}}  className='w-full flex flex-row select-none items-center'>
                		<PlusCircleIcon className="w-6 h-6 mr-2" />
										Adicionar Secretário
                	</Link>
                </button>
							}
						</div>

						<div className="w-full grid grid-cols-4 flex-col py-4">
							<div className="col-span-1">
								<input
									type="text"
									placeholder="Filtrar por nome"
									className="w-full border-[1px] border-slate-200 text-slate-500 rounded-md px-2 py-1 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
									onChange={(e) => setParamsFilter({...paramsFilter, nome: e.target.value})}
								/>
							</div>

							<div className="col-span-4">
								<TablePessoa params={paramsFilter} currentUser={user} getId={(pessoa: Pessoa) => pessoa.secretarioId} type="secretario" />
							</div>
						</div>
					</div>
				</div>
			</main>
		</ProtectedRoute>
	);

}