import { useEffect, useState } from 'react';
import { MessageData } from 'types';

export type UseLatestNonSelfMsg = (messages: MessageData[] | undefined) => {
	latestNonSelfMsg: MessageData | undefined;
};

const useLatestNonSelfMsg: UseLatestNonSelfMsg = (messages) => {
	const [latestNonSelfMsg, setLatestNonSelfMsg] = useState<
		MessageData | undefined
	>();
	useEffect(() => {
		if (messages) {
			// message is already sorted in ascending order
			setLatestNonSelfMsg(messages[messages.length - 1]);
		}
	}, [messages]);
	return { latestNonSelfMsg };
};

export default useLatestNonSelfMsg;
