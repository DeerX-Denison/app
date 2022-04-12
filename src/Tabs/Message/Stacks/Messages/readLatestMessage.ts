import { fn } from '@firebase.config';
import logger from '@logger';
import { ThreadData, UserInfo } from 'types';

export type ReadLatestMessage = (
	threadData: ThreadData | undefined,
	userInfo: UserInfo | null | undefined
) => Promise<void>;

const readLatestMessage: ReadLatestMessage = async (threadData, userInfo) => {
	if (threadData && userInfo) {
		const tobeSeenMessage = threadData.messages.filter((x) => {
			if ('seenAt' in x) {
				return x.seenAt[userInfo.uid] === null;
			} else {
				return true;
			}
		});
		const tobeSeenMessageIds = tobeSeenMessage.map((msg) => msg.id);
		try {
			await fn.httpsCallable('readMessages')({
				messageIds: tobeSeenMessageIds,
				threadId: threadData.id,
			});
		} catch (error) {
			logger.error(error);
			// Toast.show({ type: 'error', text1: 'Error while reading messages' });
		}
	}
};
export default readLatestMessage;
