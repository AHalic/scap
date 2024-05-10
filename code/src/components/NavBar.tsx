import Cookies from "js-cookie";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/router";


const inter = Inter({style: "normal", weight: "400", subsets: ["latin"]});

export default function NavBar() {
	const router = useRouter();

	const session = Cookies.get('session');
	const userId = session ? JSON.parse(session).id : undefined;

	return (
		<nav className="flex flex-col bg-blue-930 w-48">
			<div className="flex items-center justify-center h-16 bg-blue-950">
				<Image src="/logoUfes.png" alt="Logo Ufes" width={80} height={80} />
			</div>

			<div className="flex mb-8 mt-4 flex-col items-start justify-start flex-grow ">
				<div
					className={`block p-4 lg:inline-block lg:mt-0 text-lg w-full
            ${router.pathname === '/afastamento' ? 'font-bold text-slate-50' : 'text-slate-300 hover:text-slate-50 hover:cursor-pointer'} 
            transition duration-200 ease-in-out ${inter.className} border-b-2 border-blue-950`
					}
				>
					<a
						onClick={() => {
							if (router.pathname !== "/afastamento") {
								router.push("/afastamento");
							}
						}}
					>
        		Afastamentos
					</a>
				</div>

				<div
					className={`block p-4 lg:inline-block lg:mt-0 text-lg w-full
            ${router.pathname === '/professor' ? 'font-bold text-slate-50' : 'text-slate-300 hover:text-slate-50 hover:cursor-pointer'}
            transition duration-200 ease-in-out ${inter.className} border-b-2 border-blue-950`
					}
				>
					<a
						onClick={() => {
							if (router.pathname !== "/professor") {
								router.push("/professor");
							}
						}}
					>
        Professores
					</a>
				</div>

				<div
					className={`block p-4 lg:inline-block lg:mt-0 text-lg w-full
            ${router.pathname === '/secretario' ? 'font-bold text-slate-50' : 'text-slate-300 hover:text-slate-50 hover:cursor-pointer'} 
            transition duration-200 ease-in-out ${inter.className} border-b-2 border-blue-950`
					}
				>
					<a
						onClick={() => {
							if (router.pathname !== "/secretario") {
								router.push("/secretario");
							}
						}}
					>
        Secretários
					</a>
				</div>

				<div
					className={`block p-4 lg:inline-block lg:mt-0 text-lg w-full
            ${router.pathname === '/mandato' ? 'font-bold text-slate-50' : 'text-slate-300 hover:text-slate-50 hover:cursor-pointer'} 
            transition duration-200 ease-in-out ${inter.className} border-b-2 border-blue-950`
					}
				>
					<a
						onClick={() => {
							if (router.pathname !== "/mandato") {
								router.push("/mandato");
							}
						}}
					>
        		Mandato
					</a>
				</div>
			</div>

			<div className={`flex items-center justify-center h-12 text-lg bg-blue-950 ${router.pathname === '/perfil' ? 'font-bold text-slate-50' : 'text-slate-300 hover:text-slate-50 hover:cursor-pointer'} transition duration-200 ease-in-out ${inter.className}`}>
				<a
					onClick={() => {
						if (router.pathname !== `pessoa/${userId}`) {
							router.push(`/pessoa/${userId}`);
						}
					}}
				>
          Perfil
				</a>
			</div>
		</nav>
	);
}