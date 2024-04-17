import { useCallback, useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import { toast } from 'react-toastify';
import {v4 as uuidv4} from 'uuid';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { Documento } from '@prisma/client';

import ConfirmModal from './ConfirmModal';

export default function Dropzone({initialFiles = [], disabled=false}: {initialFiles?: Documento[], disabled?: boolean}) {
	const [files, setFiles] = useState<Documento[]>(initialFiles);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<number | undefined>(undefined);

	useEffect(() => {
		if (initialFiles.length === 0) {
			return;
		}
		setFiles(initialFiles);
	}, [initialFiles]);

		
	const onDrop = useCallback((acceptedFiles: Array<File>) => {
		const uuid = uuidv4();

		const updatedFiles: Documento[] = acceptedFiles.map(file => ({
			id: uuid,
			titulo: file.name,
			url: URL.createObjectURL(file),
			afastamentoId: ''
		}));

		if (files.some(file => updatedFiles.some(updatedFile => updatedFile.titulo === file.titulo))) {
			toast('Arquivos com o mesmo nome não são permitidos',
				{ type: 'error' });
			return;
		}
		
		setFiles(prev => [...prev, ...updatedFiles]);
	}, [files]);

	// const onDrop = useCallback((acceptedFiles: Array<File>) => {
	// 	setFiles(acceptedFiles.map(file => Object.assign(file, {
	// 		url: URL.createObjectURL(file)
	// 	})));
	// }, []);

	const {getRootProps, getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject
	} = useDropzone({onDrop, disabled, multiple: true, maxFiles: 10});
  

	return (
		<section className="container">
			<input type="hidden" name="documentos" value={JSON.stringify(files)} />
			<div {...getRootProps({className: 'dropzone disabled'})} className={`flex flex-col items-center p-5 border-dashed border-2 rounded-md ${isDragActive ? 'border-blue-500' : 'border-gray-300'} ${isDragAccept ? 'border-green-500' : ''} ${isDragReject ? 'border-red-500' : ''}  ${disabled ? 'bg-slate-200 text-gray-400 opacity-50': 'bg-white text-gray-500'} outline-none transition-all duration-200 ease-in-out`}>
				<input {...getInputProps()} />
				<p>Arraste, ou clique para selecionar arquivos</p>
			</div>
			{files.length > 0 &&
        <aside className="mt-2">
        	<h4 className="text-base text-slate-600" >Files</h4>
        	<ul className='ml-4 text-sm text-slate-500'>
        		{
        			files.map((file, idx) => 
        				<li className="text-start flex items-center" key={file.id}>
        					{
        						!disabled && 
										<XMarkIcon onClick={() => {setIsConfirmModalOpen(idx);}} className="text-red-700 hover:text-red-500 hover:cursor-pointer w-4 h-4 inline-block mr-1" />
        					}
        					{file.titulo}
        				</li>
        			)
        		}
        	</ul>
        </aside>
			}

			<ConfirmModal
				open={isConfirmModalOpen !== undefined}
				onCancel={() => {setIsConfirmModalOpen(undefined);}}
				onConfirm={() => {
					setFiles(files.filter((_, idx) => idx !== isConfirmModalOpen));
					setIsConfirmModalOpen(undefined);
				}}
				title="Remover Arquivo"
				message="Tem certeza que deseja remover este arquivo?"
			/>
		</section>
	);
}
