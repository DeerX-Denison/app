import React, { useEffect, useState } from 'react';

export type UseInputText = () => {
	inputText: string;
	setInputText: React.Dispatch<React.SetStateAction<string>>;
	showingItem: boolean;
	setShowingItem: React.Dispatch<React.SetStateAction<boolean>>;
	refs: Ref[];
	setRefs: React.Dispatch<React.SetStateAction<Ref[]>>;
	textSelection: TextSelection | undefined;
	setTextSelection: React.Dispatch<
		React.SetStateAction<TextSelection | undefined>
	>;
};
export type Ref = {
	begin: number;
	end: number;
};
export type TextSelection = {
	start: number;
	end: number;
};
/**
 * custom hook to handle user input-ed text in TextInput
 */
const useInputText: UseInputText = () => {
	const [inputText, setInputText] = useState<string>('');
	const [showingItem, setShowingItem] = useState<boolean>(false);
	const [refs, setRefs] = useState<Ref[]>([]);
	const [textSelection, setTextSelection] = useState<
		TextSelection | undefined
	>();
	useEffect(() => {
		setShowingItem(inputText.startsWith('@'));
		// TODO: implement check for change in refs in a new inputText
	}, [inputText]);

	useEffect(() => {
		console.log(textSelection);
	}, [textSelection]);
	return {
		inputText,
		setInputText,
		showingItem,
		setShowingItem,
		refs,
		setRefs,
		textSelection,
		setTextSelection,
	};
};

export default useInputText;
