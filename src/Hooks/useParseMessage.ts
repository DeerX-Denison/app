import { MILLIES_TO_SPLIT_MESSAGES } from '@Constants';
import { useEffect, useState } from 'react';
import 'react-native-get-random-values';
import { MessageBlockData, MessageData } from 'types';
import { v4 as uuidv4 } from 'uuid';

const validConditionToSplitMessages: (
	curMsg: MessageData,
	nxtMsg: MessageData
) => boolean = (curMsg, nxtMsg) => {
	const timeDiff = nxtMsg.time.toMillis() - curMsg.time.toMillis();

	if (
		curMsg.sender.uid !== nxtMsg.sender.uid ||
		timeDiff > MILLIES_TO_SPLIT_MESSAGES
	) {
		return true;
	} else {
		return false;
	}
};

/**
 * parse sv data messages to data for client to render
 */
const useParseMessage = (messages: MessageData[] | undefined) => {
	const [parsedMessages, setParsedMessages] = useState<
		MessageBlockData[] | undefined
	>();

	useEffect(() => {
		if (messages && messages.length > 0) {
			const parsedMessages: MessageBlockData[] = [];

			// init parsedMessage as the first message
			let parsedMessage: MessageBlockData = {
				id: messages[0].id,
				sender: messages[0].sender,
				time: messages[0].time,
				contents: [
					{
						id: uuidv4(),
						content: messages[0].content,
						contentType: messages[0].contentType,
					},
				],
			};

			for (let i = 0; i < messages.length; i++) {
				// if i at last index, push whatever is in parsedMessage
				if (i === messages.length - 1) {
					parsedMessages.push(parsedMessage);
				} // else attempt to split messages
				else if (validConditionToSplitMessages(messages[i], messages[i + 1])) {
					parsedMessages.push(parsedMessage);
					// re-init parsedMessage as the next message
					parsedMessage = {
						id: messages[i + 1].id,
						sender: messages[i + 1].sender,
						time: messages[i + 1].time,
						contents: [
							{
								id: uuidv4(),
								content: messages[i + 1].content,
								contentType: messages[i + 1].contentType,
							},
						],
					};
				} // else attempt to merge messages
				else {
					// reassign parsedMessage with updated contents
					parsedMessage = {
						...parsedMessage,
						time: messages[i + 1].time,
						contents: [
							...parsedMessage.contents,
							{
								id: uuidv4(),
								content: messages[i + 1].content,
								contentType: messages[i + 1].contentType,
							},
						],
					};
				}
			}

			setParsedMessages(parsedMessages);
		} else if (messages && messages.length === 0) {
			setParsedMessages([]);
		}
	}, [messages]);
	return { parsedMessages };
};

export default useParseMessage;
