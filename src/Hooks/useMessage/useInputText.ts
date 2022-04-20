import React, { useEffect, useState } from 'react';
import { InputTextRef, TextSelection, WithinRef } from 'types';

export type UseInputText = (
	setDisableSend: React.Dispatch<React.SetStateAction<boolean>>
) => {
	inputText: string;
	setInputText: React.Dispatch<React.SetStateAction<string>>;
	showingItem: boolean;
	setShowingItem: React.Dispatch<React.SetStateAction<boolean>>;
	refs: InputTextRef[];
	setRefs: React.Dispatch<React.SetStateAction<InputTextRef[]>>;
	textSelection: TextSelection;
	setTextSelection: React.Dispatch<React.SetStateAction<TextSelection>>;
	isWithinRef: WithinRef;
};

/**
 * custom hook to handle user input-ed text in TextInput
 */
const useInputText: UseInputText = (setDisableSend) => {
	const [inputText, setInputText] = useState<string>('');
	const [showingItem, setShowingItem] = useState<boolean>(false);
	// current ref user has in input text. If no ref, empty array.
	const [refs, setRefs] = useState<InputTextRef[]>([]);
	const [textSelection, setTextSelection] = useState<TextSelection>({
		start: 0,
		end: 0,
	});

	// state to determine if current cursor is within a ref, if yes, which ref
	const [isWithinRef, setIsWithinRef] = useState<WithinRef>({
		isWithinRef: false,
		whichRef: undefined,
	});

	const [previousIndex, setPreviousIndex] = useState<number>(0);
	// check if input text is not an empty string
	useEffect(() => {
		if (inputText === '') {
			setDisableSend(true);
		} else {
			setDisableSend(false);
		}
	}, [inputText]);

	// check if the user is typing something or deleting something
	useEffect(() => {
		let nearPossibleRef = false;
		for (let i = textSelection?.start - 1; i >= 0; i--) {
			if (inputText.charAt(i) === ' ') {
				break;
			}
			if (inputText.charAt(i) === '@') {
				nearPossibleRef = true;
				break;
			}
		}

		let nearRef = false;
		for (let i = 0; i < refs.length; i++) {
			if (
				textSelection.start >= refs[i].begin &&
				textSelection.start <= refs[i].end + 1
			) {
				nearRef = true;
				break;
			}
		}

		// Handle showing item
		if (
			((inputText.charAt(textSelection?.start - 1) === '@' &&
				([' ', '\n'].includes(inputText.charAt(textSelection.start - 2)) ||
					textSelection?.start === 1)) ||
				nearPossibleRef) &&
			!nearRef
		) {
			setShowingItem(true);
		} else if (
			nearRef ||
			inputText.charAt(textSelection?.start - 1) === ' ' ||
			textSelection.start - previousIndex > 1 ||
			textSelection.start - previousIndex < 0
		) {
			setShowingItem(false);
		}
		setPreviousIndex(textSelection.start);
	}, [inputText, textSelection]);

	useEffect(() => {
		let exist = false;
		let ref = undefined;
		for (let i = 0; i < refs.length; i++) {
			if (
				textSelection.start >= refs[i].begin + 1 &&
				textSelection.start <= refs[i].end + 1
			) {
				exist = true;
				ref = refs[i] as InputTextRef;
				break;
			}
		}
		setIsWithinRef({ isWithinRef: exist, whichRef: ref });
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
		isWithinRef,
	};
};

export default useInputText;
