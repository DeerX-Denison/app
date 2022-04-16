import React, { useEffect, useState } from 'react';
import { WishlistDataCL } from 'types';
import { Text, View } from 'react-native'

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
	keyPressed: string;
	setKeyPressed: React.Dispatch<React.SetStateAction<string>>;
	isWithinRef: WithinRef;
};
export type Ref = {
	begin: number;
	end: number;
	data: WishlistDataCL;
};
export type TextSelection = {
	start: number;
	end: number;
};
export type WithinRef = {
	isWithinRef: boolean;
	whichRef: Ref | undefined;
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

	const [isChangingLength, setIsChangingLength] = useState<boolean>(false);
	const [currentLength, setCurrentLength] = useState<number>(0);

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [keyPressed, setKeyPressed] = useState<string>('');
	const [isWithinRef, setIsWithinRef] = useState<WithinRef>({
		isWithinRef: false,
		whichRef: undefined,
	});

	const [previousIndex, setPreviousIndex] = useState<number>(0);

	// check if the user is typing something or deleting something
	useEffect(() => {
		// Handle if selection is between text
		if (textSelection?.start == inputText.length) {
			setIsEditing(false);
		} else {
			setIsEditing(true);
		}

		// Handle if is typing something or if moving selection only
		if (inputText.length !== currentLength) {
			setIsChangingLength(true);
			setCurrentLength(inputText.length);
		} else {
			setIsChangingLength(false);
		}

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
				textSelection?.start >= refs[i].begin + 1 &&
				textSelection?.start <= refs[i].end + 1
			) {
				nearRef = true;
				break;
			}
		}

		// Handle showing item
		if (
			(inputText.charAt(textSelection?.start - 1) === '@' &&
				([' ', '\n'].includes(inputText.charAt(textSelection?.start - 2)) ||
					textSelection?.start === 1)) ||
			nearPossibleRef && !nearRef
		) {
			setShowingItem(true);
		} else if (
			inputText.charAt(textSelection?.start - 1) === ' ' ||
			textSelection?.start - previousIndex > 1 ||
			textSelection?.start - previousIndex < 0
		) {
			setShowingItem(false);
		}
		setPreviousIndex(textSelection?.start);
	}, [inputText, textSelection]);

	useEffect(() => {
		console.log(textSelection);
		let exist = false;
		let ref = undefined;
		for (let i = 0; i < refs.length; i++) {
			if (
				textSelection?.start >= refs[i].begin + 1 &&
				textSelection?.start <= refs[i].end + 1
			) {
				exist = true;
				ref = refs[i] as Ref;
				break;
			}
		}
		setIsWithinRef({ isWithinRef: exist, whichRef: ref });
	}, [textSelection]);

	// Handle updating the index of reference
	useEffect(() => {
		// Updating the references when editing
		if (isEditing) {
			if (keyPressed !== 'Backspace' && isChangingLength) {
				for (let i = 0; i < refs.length; i++) {
					if (refs[i].begin >= textSelection?.start) {
						refs[i].begin += 1;
						refs[i].end += 1;
					}
				}
				setRefs(refs);
			} else {
				if (isChangingLength) {
					for (let i = 0; i < refs.length; i++) {
						if (refs[i].begin >= textSelection?.start) {
							refs[i].begin -= 1;
							refs[i].end -= 1;
						}
					}
					setRefs(refs);
				}
			}
		}
	}, [isChangingLength, isEditing]);

	return {
		inputText,
		setInputText,
		showingItem,
		setShowingItem,
		refs,
		setRefs,
		textSelection,
		setTextSelection,
		keyPressed,
		setKeyPressed,
		isWithinRef,
	};
};

export default useInputText;
