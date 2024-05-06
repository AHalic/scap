/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import InputMask from 'react-input-mask';
import { toast } from "react-toastify";
import {v4 as uuidv4} from 'uuid';

import ProtectedRoute from "@/auth";
import NavBar from "@/components/NavBar";
import { ChevronRightIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Pessoa, TipoParentesco } from "@prisma/client";

import { ParentescoCompleto, PessoaCompleta, TipoPessoa } from "../../../lib/interfaces/Filtros";
import ParentescoModal from "./ParentescoModal";

const inter = Inter({style: "normal", weight: "400", subsets: ["latin"]});


export default function PessoaPage({data, isSecretarioExclusive=false, disabled=false, user, tipo="usuário", handleSubmit}: {
  data?: PessoaCompleta | undefined,
	isSecretarioExclusive?: boolean,
  disabled?: boolean,
	user?: PessoaCompleta,
  tipo?: string,
  handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}) {

	return (
		<ProtectedRoute isSecretarioExclusive={isSecretarioExclusive}>
			<div>
				<Head>
					<title>{tipo} | SCAP</title>
					<meta property="og:title" content="SCAP" key="title" />
				</Head>

				<div className="min-h-screen bg-gray-50 flex">
					<NavBar />

					<div className="flex-grow px-8 py-11">
						<div className="flex items-center justify-between flex-row mb-4">
							<nav className={`flex capitalize leading-6 items-center text-md text-slate-500 ${inter.className}`}>
								{tipo} 
								<ChevronRightIcon className="inline-block w-6 h-6" />
                Cadastro
							</nav>
						</div>

						<div className="w-full bg-slate-100 rounded-md py-6 px-4 drop-shadow-[0_2px_4px_rgba(15,23,42,0.2)]">
							<h1 className="text-slate-700 capitalize font-bold text-2xl mb-5">Cadastro de {tipo}</h1>
							<FormPessoa data={data} disabled={disabled} handleSubmit={handleSubmit} user={user} tipo={tipo} />
						</div>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
}

const FormPessoa = ({data, disabled=false, user, handleSubmit, tipo}: {
  data?: PessoaCompleta | undefined, 
  disabled?: boolean,
	user?: PessoaCompleta,
  tipo?: string,
  handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}) => {
	const checkSelected = (data: PessoaCompleta | undefined) => {
		if (data?.professorId) {
			return TipoPessoa.professor;
		} else if (data?.secretarioId) {
			return TipoPessoa.secretario;
		}

		else {
			if (tipo === "professor") {
				return TipoPessoa.professor;
			} else if (tipo === "secretario") {
				return TipoPessoa.secretario;
			}
		}

		return undefined;
	};

	const router = useRouter();
	const [modalParentesco, setModalParentesco] = useState(false);
	const [selectedRole, setSelectedRole] = useState<TipoPessoa | undefined>(checkSelected(data));
	const [parentes, setParentes] = useState<ParentescoCompleto[]>(data?.professor?.parentescoB || []);

	useEffect(() => {
		setParentes(data?.professor?.parentescoB || []);
	}, [data]);

	const handleRoleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSelectedRole(Number(event.target.value));
	};

	const handleAddParentesco = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();

		const formData = new FormData(event.currentTarget);

		const professorA = formData.get('professorA');
		const professorAFormatted = professorA ? JSON.parse(professorA as string) as Pessoa :
			undefined;

		const tipo = formData.get('tipo') as TipoParentesco;

		if (!professorAFormatted || !tipo) {
			toast('Preencha todos os campos', {
				type: 'error',
			});
			return;
		}

		if (parentes.find((p) => p.professorA.pessoa.id === professorAFormatted.id)) {
			toast('Parentesco já cadastrado', {
				type: 'error',
			});
			return;
		}

		const professorBId = formData.get('professorBId');
		const professorAId = formData.get('professorAId');
		const id = formData.get('id') || uuidv4();

		const parentesco = {
			id,
			professorAId: professorAId,
			professorA: {pessoa: professorAFormatted},
			tipo,
			professorBId
		} as ParentescoCompleto;

		setParentes((prev) => [...prev, parentesco]);

		setModalParentesco(false);
		event.currentTarget.reset();
	};

	return (
		<>
			<form className="w-full h-full" onSubmit={handleSubmit}>
				<div className="grid grid-cols-8 gap-4 mb-8">
					{/* radio to select if it is professor ou secretario */}
					<div className="col-span-8">
						<label htmlFor="tipo" className="block text-base font-medium text-slate-600">
              Tipo *
						</label>
						<div className={`mt-1 ml-1 ${data ? '' : 'hover:cursor-pointer'} flex items-center`}>
							<div className="flex items-center">
								{/* Professor Radio Button */}
								<input
									type="radio"
									id="professorRadio"
									name="tipoPessoa"
									value={TipoPessoa.professor}
									className="hidden"
									disabled={!!data}
									checked={selectedRole === TipoPessoa.professor}
									onChange={handleRoleChange}
								/>
								<label htmlFor="professorRadio" className="flex items-center mr-4">
									<div className="w-6 h-6 border border-slate-400 rounded-full flex items-center justify-center mr-2">
										<div className={`w-3 h-3 ${data ? 'bg-slate-400': 'bg-blue-400'} rounded-full ${selectedRole === TipoPessoa.professor ? 'block' : 'hidden'}`}></div>
									</div>
									<span className="text-slate-600">Professor</span>
								</label>

								{/* Secretario Radio Button */}
								<input
									type="radio"
									id="secretarioRadio"
									name="tipoPessoa"
									value={TipoPessoa.secretario}
									className="hidden"
									disabled={!!data}
									checked={selectedRole === TipoPessoa.secretario}
									onChange={handleRoleChange}
								/>
								<label htmlFor="secretarioRadio" className="flex items-center">
									<div className="w-6 h-6 border border-slate-400 rounded-full flex items-center justify-center mr-2">
										<div className={`w-3 h-3 ${data ? 'bg-slate-400': 'bg-blue-400'} rounded-full ${selectedRole === TipoPessoa.secretario ? 'block' : 'hidden'}`}></div>
									</div>
									<span className="text-slate-600">Secretario</span>
								</label>
							</div>
						</div>
					</div>

					{/* Nome */}
					<div className="col-span-8">
						<label htmlFor="nome" className="block text-base font-medium text-slate-600">
               Nome *
						</label>
						<input
							name="nome"
							id="nome"
							title="Nome"
							defaultValue={data?.nome}
							required
							placeholder="Nome"
							disabled={disabled}
							className={`w-full bg-white border border-gray-300 ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
						/>
					</div>

					{/* Email */}
					<div className="col-span-8">
						<label htmlFor="email" className="block text-base font-medium text-slate-600">
               Email *
						</label>
						<input
							name="email"
							id="email"
							title="Email"
							type="email"
							defaultValue={data?.email}
							required
							placeholder="Email"
							disabled={disabled}
							className={`w-full bg-white border border-gray-300 ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
						/>
					</div>

					{/* Telefone */}
					<div className="col-span-4">
						<label htmlFor="telefone" className="block text-base font-medium text-slate-600">
							 Telefone *
						</label>
						<InputMask
							mask="+55 (99) 99999-9999"
							defaultValue={data?.telefone || ''}
							disabled={disabled}
							type="tel"
						>
							<input
								name="telefone"
								id="telefone"
								title="Telefone"
								type="tel"
								defaultValue={data?.telefone || ''}
								placeholder="Telefone"
								pattern="\+55 \([0-9]{2}\) [0-9]{5}-[0-9]{4}"
								className={`w-full bg-white border border-gray-300 ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
							/>
						</InputMask>
					</div>

					{/* Matricula */}
					<div className="col-span-4">
						<label htmlFor="matricula" className="block text-base font-medium text-slate-600">
						Matrícula
						</label>
						<input
							name="matricula"
							id="matricula"
							title="Matrícula"
							defaultValue={data?.matricula}
							placeholder="Matrícula"
							required
							disabled={disabled}
							className={`w-full bg-white border border-gray-300 ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
						/>
					</div>

					{/* Senha */}
					{/* if is not secretario or user doesnt show */}
					{(user?.secretarioId || (data?.id === user?.id)) && (
						<div className="col-span-4">
							<label htmlFor="senha" className="block text-base font-medium text-slate-600">
							 Senha *
							</label>
							<input
								name="senha"
								id="senha"
								title="Senha"
								type="password"
								required={!data}
								placeholder="Senha"
								disabled={disabled}
								className={`w-full bg-white border border-gray-300 ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
							/>
						</div>
					)}



					{/* Table of parents */}
					{/* show if its professor */}
					{selectedRole === TipoPessoa.professor && (
						<div className="col-span-8">
							<label htmlFor="parentesco" className="flex items-center text-base font-medium text-slate-600">
								Parentesco
								{user?.secretarioId && (
									<button type="button" onClick={() => setModalParentesco(true)} className="text-green-500 ml-2 hover:text-green-800 h-full" title="Abrir Formulário">
										<PlusCircleIcon className="w-5 h-6" />
									</button>
								)
								}
							</label>
							<div className="mt-1">
								<input type="hidden" name="parentescoA" value={JSON.stringify(parentes)} />
								<table className="w-full border-collapse">
									<thead >
										<tr className="text-left text-sm bg-slate-200 text-slate-500">
											<th className="py-2 px-4 border border-slate-300">Nome</th>
											<th className="py-2 px-4 border border-slate-300">Parentesco</th>
											<th className="py-2 px-4 border w-20 border-slate-300"></th>
										</tr>
									</thead>
									<tbody className="bg-slate-100">
										{parentes?.length > 0 ? parentes.map((parente, index) => (
											<tr key={index} className="bg-slate-100">
												<td className="border py-2 px-4 text-slate-500">{parente.professorA.pessoa.nome}</td>
												<td className="border py-2 px-4 text-slate-500">{parente.tipo}</td>
												<td className="border py-2 px-4 text-slate-500 text-center">
													{user?.secretarioId && (
														<button title="Remover parentesco" type="button" onClick={() => {
															setParentes((prev) => prev.filter((p) => p.id !== parente.id));
														}} className="text-red-400 hover:text-red-600">
															<TrashIcon className="w-5 h-6" />
														</button>
													)}
												</td>
											</tr>
										)) : 
											<tr>
												<td className="border py-2 px-4 text-slate-500 text-sm text-center" 
													colSpan={3}>
														Nenhum parentesco cadastrado
												</td>
											</tr>
										}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
				

				<ParentescoModal
					openState={[modalParentesco, setModalParentesco]}
					handleAdd={handleAddParentesco}
					professorBId={data?.professorId}
				/>

				<div>
					{(user?.secretarioId || (data && data?.id === user?.id)) && (
						<button type="submit" className="bg-green-600 capitalize hover:opacity-80 text-white font-bold py-2 px-6 rounded mr-4">
							{data ? 'Salvar' : `Criar ${tipo}`}
						</button>
					)}

					<button type="button" onClick={() => {router.push(`/${tipo === "usuario" ? "professor" : tipo}`);}} className="bg-slate-300 hover:opacity-70 text-slate-500 font-bold py-2 px-6 rounded">
            Fechar
					</button>
				</div>
			</form>
    
		</>

	);
};