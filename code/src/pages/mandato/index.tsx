import axios from "axios";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import ProtectedRoute from "@/auth";
import ConfirmModal from "@/components/ConfirmModal";
import InputAsync from "@/components/InputAsync";
import NavBar from "@/components/NavBar";
import Section from "@/components/Section";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { MandatoCompleto, TipoPessoa } from "../../../lib/interfaces/Filtros";

const inter = Inter({style: "normal", weight: "400", subsets: ["latin"]});

export default function MandatoPage() {
	const [mandatoChefeAtual, setMandatoChefeAtual] = useState<MandatoCompleto>();
	const [mandatoSubChefeAtual, setMandatoSubChefeAtual] = useState<MandatoCompleto>();

	const session = Cookies.get('session');
	const secretarioId = session ? JSON.parse(session).secretarioId : undefined;
  

	useEffect(() => {
		axios.get("/api/mandato/atual", {params: {isChefe: true}}).then((response) => {
			setMandatoChefeAtual(response.data);
		})
			.catch((error) => {
				console.error(error);

				const message = error.response?.data?.message;
				toast(message ? message : "Ocorreu um erro ao buscar o Mandato Atual", {
					type: "error",
				});
			});
    
		axios.get("/api/mandato/atual", {params: {isChefe: false}}).then((response) => {
			setMandatoSubChefeAtual(response.data);
		})
			.catch((error) => {
				console.error(error);

				const message = error.response?.data?.message;
				toast(message ? message : "Ocorreu um erro ao buscar o Mandato Atual", {
					type: "error",
				});
			});
	}, []);


	return (
		<ProtectedRoute>
			<div>
				<Head>
					<title>Mandato | SCAP</title>
					<meta property="og:title" content="SCAP" key="title" />
				</Head>

				<div className="min-h-screen bg-gray-50 flex">
					<NavBar />

					<div className="flex-grow px-8 py-11">
						<div className="flex items-center justify-between flex-row mb-4">
							<nav className={`flex leading-6 items-center text-md text-slate-500 ${inter.className}`}>
               Mandato
								<ChevronRightIcon className="inline-block w-6 h-6" />
               Formulário
							</nav>
						</div>

						<div className="w-full bg-slate-100 rounded-md py-6 px-4 drop-shadow-[0_2px_4px_rgba(15,23,42,0.2)]">
							<h1 className="text-slate-700 font-bold text-2xl mb-5">Mandatos Atuais</h1>

							<Section title="Chefe">
								<FormMandato mandatoAtual={mandatoChefeAtual} isChefe isSecretario={!!secretarioId} />
							</Section>

							<Section title="Sub-Chefe">
								<FormMandato mandatoAtual={mandatoSubChefeAtual} isChefe={false} isSecretario={!!secretarioId} />
							</Section>
						</div>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
}

const FormMandato = ({mandatoAtual, isSecretario, isChefe}: {
  mandatoAtual?: MandatoCompleto | undefined, 
  isSecretario?: boolean
  isChefe?: boolean
}) => {
	const router = useRouter();
	const formRef = useRef<HTMLFormElement>(null);

	const [isConfirmSubmitModalOpen, setIsConfirmSubmitModalOpen] = useState<string | undefined>();
	const [isConfirmFinishModalOpen, setIsConfirmFinishModalOpen] = useState<string | undefined>();

	const handleSubmit = () => {
		if (!formRef.current) {
			return;
		}

		const formData = new FormData(formRef.current);
		const professorId = formData.get('professorId') as string;
		const isChefe = formData.get('isChefe') as string;
		const dataInicio = DateTime.fromISO(formData.get('dataInicio') as string).toISO();
    
		const dF = formData.get('dataFim') as string | null;
		const dataFim = dF ? DateTime.fromISO(formData.get('dataFim') as string).toISO()
			: null;


		if (dataFim && dataInicio && DateTime.fromISO(dataFim) < DateTime.fromISO(dataInicio)) {
			toast('Data de Fim deve ser maior que a Data de Início', {
				type: 'error',
			});
			return;
		}

		const formBody = {
			professorId,
			isChefe,
			dataInicio,
			dataFim,
		};
    
    
		axios.post('/api/mandato', formBody)
			.then(() => {
				toast('Mandato criado com sucesso', {
					type: 'success',
				});

				router.reload();
			})
			.catch(error => {
				console.error(error);

				const message = error.response?.data?.message;
				toast(message ? message : 'Ocorreu um erro ao criar o Mandato', {
					type: 'error',
				});
			});
	};

	const handleFinishMandato = () => {
		if (!formRef.current) {
			return;
		}

		const formData = new FormData(formRef.current);
    
		const id = formData.get('id') as string;

		const dataInicio = DateTime.fromISO(formData.get('dataInicio') as string).toISO();

		const dF = formData.get('dataFim') as string | null;
		const dataFim = dF ? DateTime.fromISO(formData.get('dataFim') as string).toISO()
			: DateTime.now().toISO();

		if (dataFim && dataInicio && DateTime.fromISO(dataFim) < DateTime.fromISO(dataInicio)) {
			toast('Data de Fim deve ser maior que a Data de Início', {
				type: 'error',
			});
			return;
		}

		const formBody = {
			id,
			dataFim,
		};
    
		axios.put(`/api/mandato/${id}`, formBody)
			.then(() => {
				toast('Mandato finalizado com sucesso', {
					type: 'success',
				});

				router.reload();
			})
			.catch(error => {
				console.error(error);

				const message = error.response?.data?.message;
				toast(message ? message : 'Ocorreu um erro ao finalizar o Mandato', {
					type: 'error',
				});
			});
	};

	return (
		<form className="w-full h-full" ref={formRef}>
			<div className="grid grid-cols-8 gap-4 mb-8">
				<input type="hidden" name="id" value={mandatoAtual?.id} />
				<input type="hidden" name="isChefe" value={String(isChefe)} />

				<div className="col-span-8">
					<label htmlFor="professorId" className="block text-base font-medium text-slate-600">
              Professor *
					</label>
					<InputAsync
						defaultValue={mandatoAtual ? {id: mandatoAtual?.professorId, label: mandatoAtual?.professor?.pessoa.nome} : undefined}
						name="professorId"
						placeholder="Digite o nome do professor"
						light
						disabled={!isSecretario || !!mandatoAtual}
						loadOptions={async (inputValue) => {
							return axios.get('/api/pessoa', { params: {nome: inputValue, tipo: TipoPessoa.professor} })
								.then(response => {
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									return response.data.map((professor: any) => ({
										id: professor.professorId,
										label: professor.nome,
									}));
								})
								.catch(error => {
									console.error(error);
                  
									const message = error.response?.data?.message;
									toast(message ? message : 'Ocorreu um erro ao buscar os Professores', {
										type: 'error',
									});
									return [];
								});
						}}
					/>
				</div>

				{/* Data Início */}
				<div className="col-span-4">
					<label htmlFor="dataInicio" className="block text-base font-medium text-slate-600">
            Data de Início *
					</label>
					<input
						type="date"
						name="dataInicio"
						id="dataInicio"
						title="Data de Início"
						alt="Data de Início"
						disabled={!isSecretario || !!mandatoAtual}
						required
						defaultValue={mandatoAtual?.dataInicio ? new Date(mandatoAtual.dataInicio).toISOString().split('T')[0] : ''}
						className={`w-full border border-gray-300 bg-white ${!isSecretario || !!mandatoAtual ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
					/>
				</div>

				{/* Data Fim */}
				<div className="col-span-4">
					<label htmlFor="dataFim" className="block text-base font-medium text-slate-600">
            Data de Fim
					</label>
					<input
						type="date"
						name="dataFim"
						id="dataFim"
						title="Data de Fim"
						alt="Data de Fim"
						disabled={!isSecretario || !!mandatoAtual?.dataFim}
						defaultValue={mandatoAtual?.dataFim ? new Date(mandatoAtual.dataFim).toISOString().split('T')[0] : ''}
						className={`w-full border border-gray-300 bg-white ${!isSecretario || !!mandatoAtual ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
					/>
				</div>
			</div>

			{isSecretario && (
				<div>
					{mandatoAtual ? (
						<button type="button" onClick={() => setIsConfirmFinishModalOpen(isChefe ? 'Chefe' : 'Sub-chefe')} className="bg-red-600 hover:opacity-80 text-white font-bold py-2 px-2 text-sm rounded mr-4">
              Finalizar Mandato
						</button>
					) : (
            
						<button type="button" onClick={() => setIsConfirmSubmitModalOpen(isChefe ? 'Chefe' : 'Sub-chefe')} className="bg-green-600 hover:opacity-80 text-white font-bold py-2 px-2 text-sm rounded mr-4">
							Salvar Mandato
						</button>
					)}
				</div>
			)}


			<ConfirmModal
				open={isConfirmSubmitModalOpen !== undefined}
				onCancel={() => {setIsConfirmSubmitModalOpen(undefined);}}
				onConfirm={() => {
					handleSubmit();
					setIsConfirmSubmitModalOpen(undefined);
				}}
				title="Salvar Mandato"
				message={`Tem certeza que deseja salvar o mandato de ${isConfirmSubmitModalOpen}?`} 
			/>

			<ConfirmModal
				open={isConfirmFinishModalOpen !== undefined}
				onCancel={() => {setIsConfirmFinishModalOpen(undefined);}}
				onConfirm={() => {
					handleFinishMandato();
					setIsConfirmFinishModalOpen(undefined);
				}}
				title="Terminar mandato Mandato"
				message={`Tem certeza que deseja finalizar o mandato de ${isConfirmFinishModalOpen}?
        Caso uma data final não seja informada, o mandato será finalizado hoje.`
				} 
			/>
		</form>
	);
};