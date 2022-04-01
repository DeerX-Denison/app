import { UserContext } from '@Contexts';
import { localTime } from '@firebase.config';
import React, { useContext, useEffect, useState } from 'react';
import { MessageData, MessageSeenAt, ThreadData } from 'types';
import useSuggestionQuery from '../useSuggestionQuery';
import useInputText from './useInputText';

export type UseMessageFn = (threadData: ThreadData | undefined) => {
	message: MessageData | undefined;
	inputText: string;
	setInputText: React.Dispatch<React.SetStateAction<string>>;
	showingItem: boolean;
	setShowingItem: React.Dispatch<React.SetStateAction<boolean>>;
	query: string | null;
	setQuery: React.Dispatch<React.SetStateAction<string | null>>;
};

/**
 * parse input messages to trigger features
 */
const useMessage: UseMessageFn = (threadData) => {
	const { userInfo } = useContext(UserContext);
	const [message, setMessage] = useState<MessageData | undefined>(undefined);
	const { inputText, setInputText, showingItem, setShowingItem } =
		useInputText();
	const { query, setQuery } = useSuggestionQuery(inputText);

	/**
	 * effect to parse current message
	 */
	useEffect(() => {
		if (userInfo && threadData) {
			const seenAt: MessageSeenAt = {};
			threadData.membersUid.forEach((uid) => (seenAt[uid] = null));
			seenAt[userInfo.uid] = localTime();

			if (!inputText.includes('@')) {
				setMessage({
					id: 'temp-id',
					sender: userInfo,
					time: localTime(),
					contentType: 'text',
					content: inputText,
					membersUid: threadData.membersUid,
					threadName: threadData.name,
					seenAt,
				});
			}
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
	};
};

export default useMessage;
