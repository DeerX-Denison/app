import { useEffect, useState } from 'react';
import { ThreadData } from 'types';

export type UseLatestSeenMsgId = (threadData: ThreadData | undefined) => {
	latestSeenMsgId: string | undefined;
};

const useLatestSeenMsgId: UseLatestSeenMsgId = (threadData) => {
	const [latestSeenMsgId, setSeenMsgId] = useState<string | undefined>();
	useEffect(() => {
		if (threadData) {
			const seenMsgs = threadData.messages.filter((x) => {
				let seen = true;
				if ('seenAt' in x) {
					threadData.membersUid.forEach((uid) => {
						if (x.seenAt[uid] === null) seen = false;
					});
				}
				return seen;
			});
			if (seenMsgs.length > 0) {
				const latestSeenMsg = seenMsgs[seenMsgs.length - 1];
				setSeenMsgId(latestSeenMsg.id);
			}
		}
	}, [threadData]);

	return { latestSeenMsgId };
};

export default useLatestSeenMsgId;
