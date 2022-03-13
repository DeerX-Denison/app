import { UserContext } from '@Contexts';
import { localTime } from '@firebase.config';
import { useContext, useEffect, useState } from 'react';
import { ThreadData, UserInfo } from 'types';
import useIsNewThread from './useIsNewThread';
import useMembers from './useMembers';
import useMembersUid from './useMembersUid';
import useName from './useName';
import useThreadId from './useThreadId';
import useThreadMessagesData from './useThreadMessageData';
import useThreadPreviewData from './useThreadPreviewData';
import useThumbnail from './useThumbnail';

/**
 * query threadData from input initMembers
 */
const useThreadData = (initMembers: UserInfo[]) => {
	const { userInfo } = useContext(UserContext);
	const [threadData, setThreadData] = useState<ThreadData | undefined>();
	const { members } = useMembers(initMembers);
	const { membersUid } = useMembersUid(members, userInfo);
	const { thumbnail } = useThumbnail(members, userInfo);
	const { name } = useName(members, userInfo);
	const { threadId } = useThreadId(membersUid);
	const { isNewThread, setIsNewThread } = useIsNewThread(threadId);
	const { threadPreviewData } = useThreadPreviewData(isNewThread, threadId);
	const {
		threadMessagesData,
		setThreadMessagesData,
		fetchMessages,
		resetMessages,
		fetchedAll,
	} = useThreadMessagesData(isNewThread, threadId);

	useEffect(() => {
		if (
			isNewThread === true &&
			threadId &&
			members &&
			members.length > 0 &&
			membersUid &&
			membersUid.length > 0 &&
			thumbnail
		) {
			const newThreadPreviewData: ThreadData = {
				id: threadId,
				members,
				membersUid,
				name,
				thumbnail,
				latestMessage: '',
				latestTime: localTime(),
				messages: [],
			};
			setThreadData(newThreadPreviewData);
		} else {
			if (isNewThread === false && threadPreviewData && threadMessagesData) {
				setThreadData({ ...threadPreviewData, messages: threadMessagesData });
			}
		}
	}, [
		isNewThread,
		members,
		threadId,
		membersUid,
		thumbnail,
		threadPreviewData,
		threadMessagesData,
	]);

	return {
		threadData,
		setThreadData,
		setThreadMessagesData,
		isNewThread,
		setIsNewThread,
		fetchMessages,
		resetMessages,
		fetchedAll,
	};
};
export default useThreadData;
