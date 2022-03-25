import { UserContext } from '@Contexts';
import React, { useContext, useEffect, useState } from 'react';
import { MessageData, ThreadData } from 'types';

export type UseMsgWithStatusId = (
	threadData: ThreadData | undefined,
	msgsWithSeenIconsIds: string[]
) => {
	msgWithStatusId: string | undefined;
	setMsgWithStatusId: React.Dispatch<React.SetStateAction<string | undefined>>;
};
/**
 * custom hook to parse msgsWithSeenIconsIds and threadData into *
 * msgsWithStatusIds
 */
const useMsgWithStatusId: UseMsgWithStatusId = (
	threadData,
	msgsWithSeenIconsIds
) => {
	const { userInfo } = useContext(UserContext);
	const [msgWithStatusId, setMsgWithStatusId] = useState<string | undefined>();

	useEffect(
		() => {
			if (userInfo && threadData && threadData.messages.length > 0) {
				let latestSelfMsg: MessageData = threadData.messages[0];
				if ('seenAt' in latestSelfMsg) {
					threadData.messages.forEach((msg) => {
						if (msg.sender.uid === userInfo.uid) {
							if (latestSelfMsg.time.valueOf() <= msg.time.valueOf()) {
								latestSelfMsg = msg;
							}
						}
					});

					const msgsWithSeenIcon = msgsWithSeenIconsIds.map((msgId) =>
						threadData.messages.find((msg) => msg.id === msgId)
					);
					const nonSelfUids = threadData.membersUid.filter(
						(x) => x !== userInfo.uid
					);
					let latestSelfMsgIsNewerThanAllSeenMessages = true;

					msgsWithSeenIcon.forEach((msg) => {
						if (msg && 'seenAt' in msg) {
							nonSelfUids.forEach((nonSelfUid) => {
								if (nonSelfUid in msg.seenAt && userInfo.uid in msg.seenAt) {
									const msgSeenTime = msg.seenAt[nonSelfUid];
									const latestMsgSeenTime =
										latestSelfMsg.seenAt[userInfo.uid]?.valueOf();
									if (msgSeenTime && latestMsgSeenTime) {
										if (msgSeenTime.valueOf() >= latestMsgSeenTime.valueOf()) {
											latestSelfMsgIsNewerThanAllSeenMessages = false;
										}
									}
								}
							});
						}
					});

					if (latestSelfMsgIsNewerThanAllSeenMessages === true) {
						setMsgWithStatusId(latestSelfMsg.id);
					}
				}
			}
		},
		// intentionally left out seenIcons, threadData, userInfo, because
		// msgsWithSeenIconIds already has those dependency
		[msgsWithSeenIconsIds]
	);

	return { msgWithStatusId, setMsgWithStatusId };
};

export default useMsgWithStatusId;
