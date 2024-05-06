import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import LoadingPage from "@/components/LoadingPage";
import PessoaPage from "@/components/pessoa/PessoaPage";

import { ParentescoCompleto, PessoaCompleta, TipoPessoa } from "../../../lib/interfaces/Filtros";

export default function PessoaForm() {
	const router = useRouter();
	const [data, setData] = useState<PessoaCompleta>();
	const [tipo, setTipo] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { id } = router.query;

	const session = Cookies.get('session');
	const user = session ? JSON.parse(session) : undefined;


	useEffect(() => {
		if (id) {
			setIsLoading(true);

			axios.get(`/api/pessoa/${id}`)
				.then(response => {
					if (response.data.professorId) {
						setTipo(TipoPessoa.professor);
					} else if (response.data.secretarioId) {
						setTipo(TipoPessoa.secretario);
					}
					setIsLoading(false);
					setData(response.data);
				})
				.catch(error => {
					setIsLoading(false);
					console.error(error);
					toast('Ocorreu um erro ao buscar o Usuário', {
						type: 'error',
					});
				});
		} 
	}, [id]);

	const checkTipo = (tipo: number) => {
		if (tipo === TipoPessoa.professor) {
			return "professor";
		} else if (tipo === TipoPessoa.secretario) {
			return "secretario";
		} else {
			return "usuário";
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	 
		const formData = new FormData(event.currentTarget);
		const nome = formData.get('nome') as string;
		const email = formData.get('email') as string;
		const telefone = formData.get('telefone') as string;
		const senha = formData.get('senha') as string;
		const matricula = formData.get('matricula') as string;
		const parentescoA = JSON.parse(formData.get('parentescoA')as string) as ParentescoCompleto[];
		const tipoPessoa = formData.get('tipoPessoa') as string;
	

		const body = {
			id,
			nome,
			email,
			telefone,
			matricula,
			senha,
			tipoPessoa,
			professor: {
				parentescoA,
				parentescoB: data?.professor?.parentescoA,
			}
		};    

		
		axios.put(`/api/pessoa/${id}`, body)
			.then(response => {
				toast('Usuário editado com sucesso', {
					type: 'success',
				});

				router.push(`/pessoa/${response.data.id}`);
			})
			.catch(error => {
				console.error(error);

				const message = error.response?.data?.message;
				toast(message ? message : 'Ocorreu um erro ao editar o Usuário', {
					type: 'error',
				});
			});
	};

  
	return (
		<>
			{	isLoading ? 
				<LoadingPage />
				:
				<PessoaPage data={data} tipo={checkTipo(tipo)} user={user} isSecretarioExclusive={user?.id === id ? false : true} handleSubmit={handleSubmit}/>
			}
		</>
	);
}