import axios from "axios";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { toast } from "react-toastify";

import { RedirectLogin } from "@/auth"; 
import InputText from "@/components/InputText";


const inter = Inter({style: "normal", weight: "400", subsets: ["latin"]});


export default function LoginPage() {
	const router = useRouter();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	 
		const formData = new FormData(event.currentTarget);
		const email = formData.get('email');
		const senha = formData.get('senha');
	 

		axios.post('/api/login', {
			email, senha 
		}).then(() => {
			toast('Login realizado com sucesso', {
				type: 'success',
				autoClose: 1000,
			});
	
			// add loading time
			setTimeout(() => {
				router.push('/afastamento');
			}, 1100);
		}).catch(error => {
			const {data} = error.response;
			
			toast(data.message ? data.message : 'Ocorreu um erro', {
				type: 'error',
			});
		});
	};


	return (
		<RedirectLogin>
			<main>
				<Head>
					<title>Login | SCAP</title>
					<meta property="og:title" content="Login | SCAP" key="title" />
				</Head>

				<div className="min-h-screen bg-slate-700 grid grid-cols-6 grid-rows-6 justify-center items-center">
					<div className="bg-gray-50 h-full rounded-md 
					col-span-2 col-start-3 row-start-2 row-span-4
					px-8 py-12 
					drop-shadow-[0_14px_28px_rgba(15,23,42,0.6)]
					">
						<form 
							onSubmit={handleSubmit}
							className="h-full"
						>
							<div className="w-full h-full flex flex-col items-center justify-between">
								<div>
									<div className="flex item</div>s-center justify-center mb-1">
										<Image src="/logoUfes.png" alt="Logo Ufes" width={80} height={80} />
									</div>
									<p className={`text-xl font-bold text-cente text-gray-500 ${inter.className}`}>
									Acesso ao SCAP
									</p>
								</div>

								<div className="w-full max-w-md">
									<InputText name="email" label="Email" required className="mb-6" type="email" />

									<InputText name="senha" label="Senha" required type="password" />
								</div>

								<div className="w-full max-w-md">
									<button type="submit" className={`w-full bg-blue-950 hover:bg-blue-930 text-white rounded-md py-2 mt-6 ${inter.className}`}>
								Fazer Login
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</main>
		</RedirectLogin>
	);
}
