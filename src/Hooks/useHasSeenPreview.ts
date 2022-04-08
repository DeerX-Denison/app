import { UserContext } from '@Contexts';
import React, { useContext, useLayoutEffect, useState } from 'react';
import { ThreadPreviewData } from 'types';

export type UseHasSeenPreview = (threadPreviewData: ThreadPreviewData) => {
	hasSeen: boolean | null;
	setHasSeen: React.Dispatch<React.SetStateAction<boolean | null>>;
};
/**
 * custom hook to return if the user has seen the latest message of the thread
 */
const useHasSeenPreview: UseHasSeenPreview = (threadPreviewData) => {
	const { userInfo } = useContext(UserContext);
	// null if latestSeenData is not in threadPreviewData (backward compatible)
	const [hasSeen, setHasSeen] = useState<boolean | null>(false);
	useLayoutEffect(() => {
		if (userInfo) {
			if ('latestSeenAt' in threadPreviewData) {
				if (userInfo.uid in threadPreviewData.latestSeenAt) {
					setHasSeen(threadPreviewData.latestSeenAt[userInfo.uid] !== null);
				} else setHasSeen(null);
			} else setHasSeen(null);
		} else setHasSeen(null);
	}, [threadPreviewData]);
	return { hasSeen, setHasSeen };
};

export default useHasSeenPreview;
