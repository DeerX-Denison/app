import React, { createContext } from 'react';
import { ThreadPreviewData } from 'types';
type T = {
	threadsContext: ThreadPreviewData[];
	setThreadsContext:
		| React.Dispatch<React.SetStateAction<ThreadPreviewData[]>>
		| undefined;
};

const ThreadsContext = createContext<T>({
	threadsContext: [],
	setThreadsContext: undefined,
});

export default ThreadsContext;
