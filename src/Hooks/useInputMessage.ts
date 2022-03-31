import { useEffect, useState } from 'react';
import useSuggestionQuery from './useSuggestionQuery';

export type UseInputMessage = () => {
	inputMessage: string;
	setInputMessage: React.Dispatch<React.SetStateAction<string>>;
	showingItem: boolean;
	query: string | null;
	setQuery: React.Dispatch<React.SetStateAction<string | null>>;
};

/**
 * parse input messages to trigger features
 */
const useInputMessage: UseInputMessage = () => {
	const [inputMessage, setInputMessage] = useState<string>('');
	const [showingItem, setShowingItem] = useState<boolean>(false);
	const { query, setQuery } = useSuggestionQuery(inputMessage);

	useEffect(() => {
		setShowingItem(inputMessage.startsWith('@'));
	}, [inputMessage]);

	return { inputMessage, setInputMessage, showingItem, query, setQuery };
};

export default useInputMessage;
