import { useEffect, useState } from 'react';

/**
 * custom hook to set threadId for useThreadData
 */
const useThreadId = (membersUid: string[] | undefined) => {
	const [threadId, setThreadId] = useState<string | undefined>();
	useEffect(() => {
		if (membersUid && membersUid.length > 0) {
			setThreadId(membersUid.sort().reduce((a, b) => `${a}${b}`));
		}
	}, [membersUid]);
	return { threadId };
};

export default useThreadId;
