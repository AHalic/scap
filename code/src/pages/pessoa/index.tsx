import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import PessoaPage from "@/components/pessoa/PessoaPage";

import { ParentescoCompleto, TipoPessoa } from "../../../lib/interfaces/Filtros";

export default function PessoaForm() {
	const router = useRouter();
	const { tipo } = router.query;

	const session = Cookies.get('session');
	const user = session ? JSON.parse(session) : undefined;

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
		const parentescoA = JSON.parse(formData.get('parentescoA')as string) as ParentescoCompleto[];
		const tipoPessoa = formData.get('tipoPessoa') as string;

		const body = {
			nome,
			email,
			telefone,
			senha,
			tipoPessoa,
			professor: {
				parentescoA
			}
		};    

		
		axios.post('/api/pessoa', body)
			.then(response => {
				toast('Usuário criado com sucesso', {
					type: 'success',
				});

				router.push(`/pessoa/${response.data.id}`);
			})
			.catch(error => {
				console.error(error);

				const message = error.response?.data?.message;
				toast(message ? message : 'Ocorreu um erro ao criar o Usuário', {
					type: 'error',
				});
			});
	};

	return (
		<PessoaPage tipo={checkTipo(Number(tipo))} user={user} isSecretarioExclusive handleSubmit={handleSubmit}/>
	);
}