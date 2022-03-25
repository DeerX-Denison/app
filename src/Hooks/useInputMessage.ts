import { useEffect, useState } from 'react';

export type UseInputMessage = () => {
	inputMessage: string;
	setInputMessage: React.Dispatch<React.SetStateAction<string>>;
	showingItem: boolean;
};
const useInputMessage: UseInputMessage = () => {
	const [inputMessage, setInputMessage] = useState<string>('');
	const [showingItem, setShowingItem] = useState<boolean>(false);
	useEffect(() => {
		setShowingItem(inputMessage.startsWith('@'));
	}, [inputMessage]);

	return { inputMessage, setInputMessage, showingItem };
};

export default useInputMessage;
