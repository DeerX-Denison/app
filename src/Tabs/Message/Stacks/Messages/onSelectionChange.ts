import React from 'react';
import {
	NativeSyntheticEvent,
	TextInputSelectionChangeEventData,
} from 'react-native';
import { InputTextRef, TextSelection } from 'types';

export type OnSelectionChange = (
	e: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
	prevSelector: TextSelection,
	setPrevSelector: React.Dispatch<React.SetStateAction<TextSelection>>,
	textSelection: TextSelection,
	setTextSelection: React.Dispatch<React.SetStateAction<TextSelection>>,
	refs: InputTextRef[],
	setWithinWhichRef: React.Dispatch<React.SetStateAction<InputTextRef[]>>,
	setExtendingSelection: React.Dispatch<React.SetStateAction<boolean>>
) => void;

const onSelectionChange: OnSelectionChange = (
	e,
	prevSelector,
	setPrevSelector,
	textSelection,
	setTextSelection,
	refs,
	setWithinWhichRef,
	setExtendingSelection
) => {
	setPrevSelector(textSelection);
	setTextSelection(e.nativeEvent.selection);
	const arr: InputTextRef[] = [];
	for (let i = 0; i < refs.length; i++) {
		if (
			(refs[i].begin <= textSelection.start - 1 &&
				refs[i].end >= textSelection.start) ||
			(refs[i].begin <= textSelection.end - 1 &&
				refs[i].end >= textSelection.end)
		) {
			arr.push(refs[i]);
		}
	}
	setWithinWhichRef(arr);
	if (prevSelector.start !== prevSelector?.end) {
		setExtendingSelection(true);
	} else {
		setExtendingSelection(false);
	}
};

export default onSelectionChange;
