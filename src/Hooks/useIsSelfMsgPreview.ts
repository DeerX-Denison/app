import { UserContext } from '@Contexts';
import React, { useContext, useEffect, useState } from 'react';
import { ThreadPreviewData } from 'types';

export type UseIsSelfMsgPreview = (threadPreview: ThreadPreviewData) => {
	isSelfMsgPreview: boolean;
	setIsSelfMsgPreview: React.Dispatch<React.SetStateAction<boolean>>;
};
/**
 * custom hook to determine if a given threadPreview has latest message
 * is the current user
 */
const useIsSelfMsgPreview: UseIsSelfMsgPreview = (threadPreview) => {
	const { userInfo } = useContext(UserContext);
	const [isSelfMsgPreview, setIsSelfMsgPreview] = useState<boolean>(false);
	useEffect(() => {
		if (userInfo) {
			if ('latestSenderUid' in threadPreview) {
				setIsSelfMsgPreview(threadPreview.latestSenderUid === userInfo.uid);
			}
		}
	}, [threadPreview]);
	return { isSelfMsgPreview, setIsSelfMsgPreview };
};

export default useIsSelfMsgPreview;
