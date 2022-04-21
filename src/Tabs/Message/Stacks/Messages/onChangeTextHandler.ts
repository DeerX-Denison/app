import React from 'react';
import { InputTextRef, WithinRef } from 'types';

export type OnChangeTextHandler = (
	text: string,
	refs: InputTextRef[],
	setRefs: React.Dispatch<React.SetStateAction<InputTextRef[]>>,
	keyPressed: string,
	isWithinRef: WithinRef,
	insideRef: WithinRef,
	extendingSelection: boolean,
	inputText: string,
	setInputText: React.Dispatch<React.SetStateAction<string>>,
	prevSelector: {
		end: number;
		start: number;
	},
	textSelection: {
		end: number;
		start: number;
	},
	withinWhichRef: InputTextRef[],
) => void;

const onChangeTextHandler: OnChangeTextHandler = (
	text,
	refs,
	setRefs,
	keyPressed,
	isWithinRef,
	insideRef,
	extendingSelection,
	inputText,
	setInputText,
	prevSelector,
	textSelection,
	withinWhichRef
) => {
	const mutableRefs = refs.map((x) => x);
	// check if prevSelector is within ref. Prevent deleting extra space from a ref
	let prevWithinRef = false;
	for (let i = 0; i < refs.length; i++) {
		if (
			prevSelector.start >= refs[i].begin + 1 &&
			prevSelector.start <= refs[i].end + 1
		) {
			prevWithinRef = true;
			break;
		}
	}

	// check if deleteing a refs, stick begin of ref to end of ref
	if (
		keyPressed === 'Backspace' &&
		isWithinRef &&
		isWithinRef.isWithinRef &&
		isWithinRef.whichRef &&
		!extendingSelection &&
		prevWithinRef
	) {
		const start = isWithinRef.whichRef.begin;
		const end = isWithinRef.whichRef.end + 1;
		const _ = refs.indexOf(isWithinRef.whichRef);
		if (_ > -1) {
			const first = inputText.slice(0, start);
			const second = inputText.slice(end, inputText.length);
			setInputText(first + second);
			mutableRefs.splice(_, 1);
			const deletedRef =
				isWithinRef.whichRef?.end - isWithinRef.whichRef?.begin + 1;
			for (let i = 0; i < mutableRefs.length; i++) {
				if (mutableRefs[i].begin > isWithinRef.whichRef?.end) {
					mutableRefs[i].begin -= deletedRef;
					mutableRefs[i].end -= deletedRef;
				}
			}
			setRefs(mutableRefs);
		}
	} else {
		setInputText(text);
		if (text.length < inputText.length) {
			if (!extendingSelection && keyPressed === 'Backspace') {
				for (let i = 0; i < mutableRefs.length; i++) {
					if (mutableRefs[i].begin >= prevSelector.start - 1) {
						mutableRefs[i].begin -= 1;
						mutableRefs[i].end -= 1;
					}
				}
			} else {
				for (let i = 0; i < mutableRefs.length; i++) {
					if (mutableRefs[i].begin >= prevSelector.end - 1) {
						mutableRefs[i].begin -= inputText.length - text.length;
						mutableRefs[i].end -= inputText.length - text.length;
					}
				}
				for (let i = 0; i < withinWhichRef.length; i++) {
					const _ = mutableRefs.indexOf(withinWhichRef[i]);
					if (_ > -1) {
						mutableRefs.splice(_, 1);
					}
				}
			}
		} else if (text.length > inputText.length) {
			if (!extendingSelection) {
				if (insideRef.isWithinRef && insideRef.whichRef) {
					const toBeDeleted = refs.indexOf(insideRef.whichRef);
					if (toBeDeleted > -1) {
						mutableRefs.splice(toBeDeleted, 1);
					}
				}
				for (let i = 0; i < mutableRefs.length; i++) {
					if (mutableRefs[i].begin >= textSelection.start - (text.length - inputText.length)) {
						mutableRefs[i].begin += text.length - inputText.length;
						mutableRefs[i].end += text.length - inputText.length;
					}
				}
			}
		}
		setRefs(mutableRefs);
	}
};
export default onChangeTextHandler;
