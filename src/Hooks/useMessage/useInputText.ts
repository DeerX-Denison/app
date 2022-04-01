import React, { useEffect, useState } from 'react';

export type UseInputText = () => {
	inputText: string;
	setInputText: React.Dispatch<React.SetStateAction<string>>;
	showingItem: boolean;
	setShowingItem: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * custom hook to handle user input-ed text in TextInput
 */
const useInputText: UseInputText = () => {
	const [inputText, setInputText] = useState<string>('');
	const [showingItem, setShowingItem] = useState<boolean>(false);
	useEffect(() => {
		setShowingItem(inputText.startsWith('@'));
	}, [inputText]);
	return { inputText, setInputText, showingItem, setShowingItem };
};

export default useInputText;
