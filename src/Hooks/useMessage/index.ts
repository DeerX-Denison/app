import { UserContext } from '@Contexts';
import { localTime } from '@firebase.config';
import React, { useContext, useEffect, useState } from 'react';
import {
	InputTextRef,
	MessageData,
	MessageReferenceData,
	TextSelection,
	ThreadData,
	WithinRef,
} from 'types';
import useSuggestionQuery from '../useSuggestionQuery';
import useContentType from './useContentType';
import useInputText from './useInputText';
import useSeenAt from './useSeenAt';

export type UseMessageFn = (
	threadData: ThreadData | undefined,
	setDisableSend: React.Dispatch<React.SetStateAction<boolean>>
) => {
	message: MessageData | undefined;
	inputText: string;
	setInputText: React.Dispatch<React.SetStateAction<string>>;
	showingItem: boolean;
	setShowingItem: React.Dispatch<React.SetStateAction<boolean>>;
	query: string | null;
	setQuery: React.Dispatch<React.SetStateAction<string | null>>;
	setTextSelection: React.Dispatch<React.SetStateAction<TextSelection>>;
	textSelection: TextSelection;
	refs: InputTextRef[];
	setRefs: React.Dispatch<React.SetStateAction<InputTextRef[]>>;
	isWithinRef: WithinRef;
	insideRef: WithinRef;
};

/**
 * parse input messages to trigger features
 */
const useMessage: UseMessageFn = (threadData, setDisableSend) => {
	const { userInfo } = useContext(UserContext);
	const [message, setMessage] = useState<MessageData | undefined>(undefined);
	const {
		inputText,
		setInputText,
		showingItem,
		setShowingItem,
		setTextSelection,
		textSelection,
		refs,
		setRefs,
		isWithinRef,
		insideRef,
	} = useInputText(setDisableSend);
	const { query, setQuery } = useSuggestionQuery(inputText, textSelection);
	const { contentType } = useContentType(inputText);
	const { seenAt } = useSeenAt(threadData);

	/**
	 * effect to parse current message
	 */
	useEffect(() => {
		if (userInfo && threadData) {
			const messageRefs: MessageReferenceData[] = refs.map((ref) => ({
				begin: ref.begin,
				end: ref.end,
				data: { id: ref.data.id, thumbnail: ref.data.thumbnail },
			}));
			setMessage({
				id: 'temp-id',
				sender: userInfo,
				time: localTime(),
				contentType,
				content: inputText,
				membersUid: threadData.membersUid,
				threadName: threadData.name,
				refs: messageRefs,
				seenAt,
			});
		}
	}, [inputText, refs, contentType, userInfo, threadData]);

	return {
		message,
		inputText,
		setInputText,
		showingItem,
		setShowingItem,
		query,
		setQuery,
		setTextSelection,
		textSelection,
		refs,
		setRefs,
		isWithinRef,
		insideRef,
	};
};

export default useMessage;
