import { UserContext } from '@Contexts';
import { localTime } from '@firebase.config';
import React, { useContext, useEffect, useState } from 'react';
import { MessageData, MessageReferenceData, ThreadData } from 'types';
import useSuggestionQuery from '../useSuggestionQuery';
import useContentType from './useContentType';
import useInputText, { Ref, TextSelection, WithinRef } from './useInputText';
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
	refs: Ref[];
	setRefs: React.Dispatch<React.SetStateAction<Ref[]>>;
	isWithinRef: WithinRef;
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
	} = useInputText(setDisableSend);
	const { query, setQuery } = useSuggestionQuery(inputText, textSelection);
	const { contentType } = useContentType(inputText);
	const { seenAt } = useSeenAt(threadData);
	/**
	 * effect to parse current message
	 */
	useEffect(() => {
		if (userInfo && threadData) {
			const messageRefs: MessageReferenceData = {};
			refs.forEach((ref) => {
				messageRefs[ref.data.id] = { begin: ref.begin, end: ref.end };
			});
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
	}, [inputText, userInfo, threadData]);

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
	};
};

export default useMessage;
