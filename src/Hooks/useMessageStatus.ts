import { UserContext } from '@Contexts';
import React, { useContext, useEffect, useState } from 'react';
import { ThreadData } from 'types';

export type UseMessageStatusFn = (
	threadData: ThreadData | undefined,
	msgWithStatusId: string | undefined
) => {
	messageStatus: MessageStatus | undefined;
	setMessageStatus: React.Dispatch<
		React.SetStateAction<MessageStatus | undefined>
	>;
};
export type MessageStatus = 'sending' | 'sent' | 'seen';

/**
 * custom hook to parse message status from threadData and msgWithStatusId
 */
const useMessageStatus: UseMessageStatusFn = (threadData, msgWithStatusId) => {
	const { userInfo } = useContext(UserContext);
	const [messageStatus, setMessageStatus] = useState<
		MessageStatus | undefined
	>();

	useEffect(() => {
		if (threadData && msgWithStatusId && userInfo) {
			const msgWithStatus = threadData.messages.filter(
				(msg) => msg.id === msgWithStatusId
			)[0];
			if (!('seenAt' in msgWithStatus)) {
				setMessageStatus(undefined);
			} else if (msgWithStatus.seenAt[userInfo.uid] === null) {
				setMessageStatus('sending');
			} else setMessageStatus('sent');
		}
	}, [threadData, msgWithStatusId]);
	return { messageStatus, setMessageStatus };
};

export default useMessageStatus;
