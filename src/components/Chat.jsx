import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ANSWERS = {
	default: <p>No entendi, podrias reformular tu mensaje?</p>,
	intro: (
		<p>
			Soy Juan Manuel Garcia (A.K.A Fullsnacker), soy desarrollador FullStack.
			Trabajo con el stack MERN hace 4 años y con js hace unos 7.
		</p>
	),
	info: (
		<p> Tengo 37 años, vivo en Ciudad Autonoma de Buenos Aires, Argentina.</p>
	),
	contact: (
		<p>
			Puedes contactarte conmigo por:
			<ul>
				<li>
					<a
						className="underline"
						href="https://www.linkedin.com/in/fullsnacker"
						target="_blank"
						rel="noreferrer"
					>
						Linkedin
					</a>
				</li>
				<li>
					<a
						className="underline"
						href="https://www.instagram.com/fullsnacker"
						target="_blank"
						rel="noreferrer"
					>
						Instagram
					</a>
				</li>
				<li>
					<a
						className="underline"
						href="https://twitter.com/fullsnacker"
						target="_blank"
						rel="noreferrer"
					>
						X (Antiguamente Twitter)
					</a>
				</li>
			</ul>
			<br />O ingresando a mi{' '}
			<a
				className="underline"
				href="https://fullsnacker.github.io/"
				target="_blank"
				rel="noreferrer"
			>
				Sitio
			</a>
		</p>
	)
};

const EXAMPLES = [
	{ text: 'Tengo un trabajo para vos', label: ' contact' },
	{ text: 'Por donde te puedo contactar?', label: ' contact' },
	{ text: 'Estas buscando trabajo?', label: ' contact' },
	{ text: 'Estas escuchando propuestas?', label: ' contact' },
	{ text: 'Podemos coordinar una reunion?', label: ' contact' },
	{ text: 'Cual es tu expectativa salarial?', label: ' contact' },
	{ text: 'Te interesa cambiar de trabajo?', label: ' contact' },
	{ text: 'Como es tu github?', label: ' contact' },
	{ text: 'Como es tu instagram?', label: ' contact' },
	{ text: 'Como es tu sitio web?', label: ' contact' },
	{ text: 'Cuales son tus redes?', label: ' contact' },
	{ text: 'Cuales son tus pronombres?', label: ' info' },
	{ text: 'Tenes hobbys?', label: ' info' },
	{ text: 'contame un chiste', label: ' info' },
	{ text: 'Quien es segundo?', label: ' info' },
	{ text: 'Arreglas impresoras', label: ' info' },
	{ text: 'Tengo una duda', label: ' info' },
	{ text: 'Necesito solucionar algo', label: ' info' },
	{ text: 'Tenes tutoriales?', label: ' info' },
	{ text: 'Como hiciste este chat?', label: ' info' },
	{ text: 'Cual es tu personaje de ficcion favorito?', label: ' info' },
	{ text: 'dc o marvel?', label: ' info' },
	{ text: 'Hola', label: ' intro' },
	{ text: 'Como estas?', label: ' intro' },
	{ text: 'Quien sos?', label: ' intro' },
	{ text: 'Con que tecnologias trabajas?', label: ' intro' },
	{ text: 'En donde estudiaste?', label: ' intro' },
	{ text: 'Donde trabajas?', label: ' intro' },
	{ text: 'Con que tecnologias tenes experiencia?', label: ' intro' },
	{ text: 'Sabes ingles?', label: ' intro' },
	{ text: 'En que horario estas disponible?', label: ' intro' },
	{ text: 'Cuanto tiempo de experiencia tenes?', label: ' intro' }
];

const API_KEY = import.meta.env.VITE_APP_COHERE_API_KEY;

function Chat() {
	const [messages, setMessages] = useState([
		{
			id: '1',
			type: 'bot',
			text: 'Hola! Soy Snachat. Hazme consultas acerca de Fullsnacker'
		}
	]);
	const [question, setQuestion] = useState('');
	const [isLoading, toggleLoading] = useState(false);
	const [isCollapsed, toggleCollapsed] = useState(false);
	const container = useRef(null);

	async function handleSubmit(event) {
		event.preventDefault();

		if (isLoading) return;

		toggleLoading(true);
		setMessages((messages) =>
			messages.concat({ id: String(Date.now()), type: 'user', text: question })
		);
		setQuestion('');

		const { classifications } = await fetch(
			'https://api.cohere.ai/v1/classify',
			{
				method: 'POST',
				headers: {
					Authorization: `BEARER ${API_KEY}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: 'large',
					inputs: [question],
					examples: EXAMPLES
				})
			}
		).then((res) => res.json());

		setMessages((messages) =>
			messages.concat({
				id: String(Date.now()),
				type: 'bot',
				text: ANSWERS[classifications[0].prediction.trim()] || ANSWERS['info']
			})
		);

		toggleLoading(false);

		// console.log(
		// 	`predicted: ${classifications[0].prediction.trim()} with a ${
		// 		classifications[0].confidence * 100
		// 	}% confidence`,
		// );
	}

	useEffect(() => {
		container.current?.scrollTo(0, container.current.scrollHeight);
	}, [messages, isCollapsed]);

	return createPortal(
		<div className="fixed bottom-8 right-8">
			{isCollapsed ? (
				<button
					className="text-xl rounded-full bg-blue-800 w-8 h-8 absolute -left-4 -top-5"
					onClick={() => toggleCollapsed(false)}
				>
					?
				</button>
			) : (
				<div className="relative">
					<button
						className="text-xl rounded-full bg-blue-800 w-8 h-8 absolute -left-4 -top-5"
						onClick={() => toggleCollapsed(true)}
					>
						×
					</button>
					<div className="flex flex-col gap-4 m-auto max-w-lg border border-gray-400 p-4 rounded-md">
						<div
							ref={container}
							className="flex flex-col gap-4 h-[300px] overflow-y-auto"
						>
							{messages.map((message) => (
								<div
									key={message.id}
									className={`p-4 max-w-[80%] rounded-lg text-white 
							${
								message.type === 'bot'
									? 'bg-slate-500 text-left self-start rounded-bl-none'
									: 'bg-blue-500 text-right self-end rounded-br-none'
								}`}
								>
									{message.text}
								</div>
							))}
						</div>
						<form className="flex items-center" onSubmit={handleSubmit}>
							<input
								value={question}
								onChange={(event) => {
									setQuestion(event.target.value);
								}}
								placeholder="Quien sos?"
								className="flex-1 border border-gray-400 py-2 px-4 rounded-r-none"
								type="text"
								name="question"
							/>
							<button
								disabled={isLoading}
								className={`px-4 py-2 rounded-lg rounded-l-none ${
									isLoading ? 'bg-blue-300' : 'bg-blue-500'
								}`}
								type="submit"
							>
								Enviar
							</button>
						</form>
					</div>
				</div>
			)}
		</div>,
		document.getElementById('chat')
	);
}

export default Chat;
