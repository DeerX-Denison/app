import React, { useEffect, useState } from 'react';
import { WishlistDataCL } from 'types';

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
	isPressingKey: boolean;
	setIsPressingKey: React.Dispatch<React.SetStateAction<boolean>>;
	keyPressed: string;
	setKeyPressed: React.Dispatch<React.SetStateAction<string>>
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
	whichRef: Ref|undefined;
}

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
	const [isPressingKey, setIsPressingKey] = useState<boolean>(true);
	const [keyPressed, setKeyPressed] = useState<string>('');
	const [isWithinRef, setIsWithinRef] = useState<WithinRef>({isWithinRef: false, whichRef: undefined})

	useEffect(() => {
		if (inputText.length !== currentLength){
			setIsChangingLength(true);
			setCurrentLength(inputText.length)
		} else {
			setIsChangingLength(false);
		}
	}, [inputText, textSelection])

	useEffect(() => {
		if (textSelection?.start == inputText.length) {
			setIsEditing(false)
		}
		else{
			setIsEditing(true)
		}
		if(inputText.charAt(textSelection?.start-1) === '@'
		&&(inputText.charAt(textSelection?.start-2) === ' '
		||textSelection?.start===1)){
			setShowingItem(inputText.charAt(textSelection?.start-1) !== ' ');
		}
		else if (inputText.charAt(textSelection?.start-1) === ' '){
			setShowingItem(false)
		}
	}, [textSelection, inputText]);

	useEffect(() => {
		let exist = false;
		let ref = undefined;
		for (let i = 0; i<refs.length; i++){
			if (textSelection?.start >= refs[i].begin+1 && textSelection?.start <= refs[i].end){
				exist = true;
				ref = refs[i] as Ref
			}
		}
		setIsWithinRef({isWithinRef: exist, whichRef: ref});
	}, [textSelection])

	useEffect(() => {
		if (keyPressed === 'Backspace'){
			const start = isWithinRef.whichRef?.begin-1
			const end = isWithinRef.whichRef?.end+1
			const _ = refs.indexOf(isWithinRef?.whichRef)
			if (_ > -1){
				setInputText(inputText.slice(0, start) + inputText.slice(end))
				console.log(_)
				refs.splice(_, 1)
				console.log(refs)
				setRefs(refs)
			}
		}
	}, [isWithinRef])

	useEffect(() => {
		// Updating the references when editing
		if (isEditing) {
			if(keyPressed !== 'Backspace' && isChangingLength){
				for (let i = 0; i < refs.length; i++){
					if ( refs[i].begin >= textSelection?.start ){
						refs[i].begin += 1;
						refs[i].end += 1;
					}
				}
				setRefs(refs);
			} else {
				if (isChangingLength) {
					for (let i = 0; i < refs.length; i++){
						if ( refs[i].begin >= textSelection?.start ){
							refs[i].begin -= 1;
							refs[i].end -= 1;
						}
					}
					setRefs(refs);
				}
			}
		}		
	}, [isChangingLength, isEditing])
	
	return {
		inputText,
		setInputText,
		showingItem,
		setShowingItem,
		refs,
		setRefs,
		textSelection,
		setTextSelection,
		isPressingKey,
		setIsPressingKey,
		keyPressed,
		setKeyPressed
	};
};

export default useInputText;
