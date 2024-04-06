import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/router";


const inter = Inter({style: "normal", weight: "400", subsets: ["latin"]});

export default function NavBar() {
	const router = useRouter();

	return (
		<nav className="flex flex-col bg-blue-930 w-48 h-screen">
			<div className="flex items-center justify-center h-16 bg-blue-950">
				<Image src="/logoUfes.png" alt="Logo Ufes" width={80} height={80} />
			</div>

			<div className="flex mb-8 mt-4 flex-col items-start justify-start flex-grow ">
				<div
					className={`block p-4 lg:inline-block lg:mt-0 text-lg w-full
            ${router.pathname === '/afastamentos' ? 'font-bold text-slate-50' : 'text-slate-300 hover:text-slate-50 hover:cursor-pointer'} 
            transition duration-200 ease-in-out ${inter.className} border-b-2 border-blue-950`
					}
				>
					<a
						onClick={() => {
							if (router.pathname !== "/afastamentos") {
								router.push("/afastamentos");
							}
						}}
					>
        Afastamentos
						{/* 
          Listagem
          Cadastro de Afastamento
            Anexo de Documentos
            Alterar Estado -> Secretario
          Deferir Parecer
        */}
					</a>
				</div>

				<div
					className={`block p-4 lg:inline-block lg:mt-0 text-lg w-full
            ${router.pathname === '/professores' ? 'font-bold text-slate-50' : 'text-slate-300 hover:text-slate-50 hover:cursor-pointer'}
            transition duration-200 ease-in-out ${inter.className} border-b-2 border-blue-950`
					}
				>
					<a
						onClick={() => {
							if (router.pathname !== "/professores") {
								router.push("/professores");
							}
						}}
					>
        Professores
					</a>
				</div>

				<div
					className={`block p-4 lg:inline-block lg:mt-0 text-lg w-full
            ${router.pathname === '/secretarios' ? 'font-bold text-slate-50' : 'text-slate-300 hover:text-slate-50 hover:cursor-pointer'} 
            transition duration-200 ease-in-out ${inter.className} border-b-2 border-blue-950`
					}
				>
					<a
						onClick={() => {
							if (router.pathname !== "/secretarios") {
								router.push("/secretarios");
							}
						}}
					>
        Secretários
					</a>
				</div>
			</div>

			<div className={`flex items-center justify-center h-12 text-lg bg-blue-950 ${router.pathname === '/perfil' ? 'font-bold text-slate-50' : 'text-slate-300 hover:text-slate-50 hover:cursor-pointer'} transition duration-200 ease-in-out ${inter.className}`}>
				<a
					onClick={() => {
						if (router.pathname !== "/perfil") {
							router.push("/perfil");
						}
					}}
				>
          Perfil
				</a>
			</div>
		</nav>
	);
}