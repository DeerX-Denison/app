import { db } from '@firebase.config';
import logger from '@logger';
import { useEffect, useState } from 'react';

/**
 * custom hook to set state isNewThread for useThreadData
 */
const useIsNewThread = (threadId: string | undefined) => {
	const [isNewThread, setIsNewThread] = useState<boolean | undefined>();
	useEffect(() => {
		if (threadId) {
			let isSubscribed = true;
			try {
				(async () => {
					const docSnap = await db.collection('threads').doc(threadId).get();
					if (docSnap.exists) {
						isSubscribed && setIsNewThread(false);
					} else {
						isSubscribed && setIsNewThread(true);
					}
				})();
			} catch (error) {
				logger.error(error);
			}
			return () => {
				isSubscribed = false;
			};
		}
	}, [threadId]);

	return { isNewThread, setIsNewThread };
};

export default useIsNewThread;
