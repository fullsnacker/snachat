import { Chat } from './components/Chat';
import { answers, examples } from './data';

function App() {
	const CHAT_ANSWERS = answers;
	const CHAT_EXAMPLES = examples;
	const INITIAL_MESSAGE =
		'Hola! Soy Snachat. Hazme consultas acerca de Fullsnacker';

	return (
		<main className="p-4">
			<Chat
				answers={CHAT_ANSWERS}
				examples={CHAT_EXAMPLES}
				initialMessage={INITIAL_MESSAGE}
			/>
		</main>
	);
}

export default App;
