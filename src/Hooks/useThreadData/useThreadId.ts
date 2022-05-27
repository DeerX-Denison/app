import { useEffect, useState } from 'react';
import { UserInfo } from 'types';
import genThreadId from './genThreadId';

/**
 * custom hook to set threadId for useThreadData
 */
const useThreadId = (members: UserInfo[]) => {
	const [threadId, setThreadId] = useState<string | undefined>();
	useEffect(() => {
		const threadId = genThreadId(members);
		setThreadId(threadId);
	}, [members]);
	return { threadId };
};

export default useThreadId;
