import { db } from '@firebase.config';
import logger from '@logger';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { ThreadPreviewData } from 'types';

/**
 * custom hook to fetch thread preview data for useThreadData
 * If threadPreviewData is undefined, it is not fetched
 * If threadPreviewData is null, it does not exist
 * If threadPreviewData is ThreadPreviewData, it is fetched
 */
const useThreadPreviewData = (
	isNewThread: boolean | undefined,
	threadId: string | undefined
) => {
	const [threadPreviewData, setThreadPreviewData] = useState<
		ThreadPreviewData | null | undefined
	>();
	useEffect(() => {
		if (isNewThread === false) {
			const unsubscribe = db
				.collection('threads')
				.doc(threadId)
				.onSnapshot(
					(querySnapshot) => {
						if (querySnapshot.exists) {
							setThreadPreviewData(querySnapshot.data() as ThreadPreviewData);
						} else {
							setThreadPreviewData(null);
						}
					},
					(error) => {
						logger.log(error);
						return Toast.show({ type: 'error', text1: error.message });
					}
				);
			return () => unsubscribe();
		}
	}, [isNewThread, threadId]);
	return { threadPreviewData };
};

export default useThreadPreviewData;
