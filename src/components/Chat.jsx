import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const API_KEY = import.meta.env.VITE_APP_COHERE_API_KEY;

export const Chat = ({ examples, answers, initialMessage }) => {
	const [messages, setMessages] = useState([
		{
			id: '1',
			type: 'bot',
			text: initialMessage
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
					examples: examples
				})
			}
		).then((res) => res.json());

		setMessages((messages) =>
			messages.concat({
				id: String(Date.now()),
				type: 'bot',
				text: answers[classifications[0].prediction.trim()] || answers['info']
			})
		);

		toggleLoading(false);
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
};
