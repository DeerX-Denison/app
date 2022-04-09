import { UserContext } from '@Contexts';
import { useContext, useEffect, useState } from 'react';
import { MessageSeenAt, ThreadData } from 'types';

export type UseSeenAtFn = (threadData: ThreadData | undefined) => {
	seenAt: MessageSeenAt;
};

/**
 * custom hook to parse seenAt from threadData
 */
const useSeenAt: UseSeenAtFn = (threadData) => {
	const { userInfo } = useContext(UserContext);
	const [seenAt, setSeenAt] = useState<MessageSeenAt>({});
	useEffect(() => {
		if (threadData && userInfo) {
			const seenAt: MessageSeenAt = {};
			threadData.membersUid.forEach((uid) => (seenAt[uid] = null));
			setSeenAt(seenAt);
		}
	}, [threadData]);
	return { seenAt };
};

export default useSeenAt;
