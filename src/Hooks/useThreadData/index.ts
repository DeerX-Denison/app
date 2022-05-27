import { localTime } from '@firebase.config';
import { useEffect, useState } from 'react';
import { ThreadData, UserInfo } from 'types';
import useIsNewThread from '../useIsNewThread';
import useMembers from '../useMembers';
import useMembersUid from '../useMembersUid';
import useThreadMessagesData from '../useThreadMessageData';
import useThreadPreviewData from '../useThreadPreviewData';
import useName from './useName';
import useThreadId from './useThreadId';
import useThumbnail from './useThumbnail';
/**
 * query threadData from input initMembers
 */
const useThreadData = (initMembers: UserInfo[]) => {
	const [threadData, setThreadData] = useState<ThreadData | undefined>();
	const { members } = useMembers(initMembers);
	const { membersUid } = useMembersUid(members);
	const { thumbnail } = useThumbnail(members);
	const { name } = useName(members);
	const { threadId } = useThreadId(members);
	const { isNewThread, setIsNewThread } = useIsNewThread(threadId);
	const { threadPreviewData } = useThreadPreviewData(isNewThread, threadId);

	const {
		threadMessagesData,
		setNewMsgs,
		fetchMessages,
		resetMessages,
		fetchedAll,
	} = useThreadMessagesData(isNewThread, threadId, membersUid);

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
				latestSeenAt: {},
				latestSenderUid: undefined,
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
		setNewMsgs,
		isNewThread,
		setIsNewThread,
		fetchMessages,
		resetMessages,
		fetchedAll,
	};
};

export default useThreadData;
