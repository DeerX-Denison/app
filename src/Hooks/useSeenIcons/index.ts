import { UserContext } from '@Contexts';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { SeenAts, SeenIcons, UseSeenIconsFn } from 'types';

/**
 * custom hook that takes threadData as input, parse messages that requires
 * seen icons. SeenIcon has data type:
 * {
 * 		userId: messageId
 * 		...
 * }
 */
const useSeenIcons: UseSeenIconsFn = (threadData) => {
	const { userInfo } = useContext(UserContext);
	const [seenIcons, setSeenIcons] = useState<SeenIcons | undefined>(undefined);

	useEffect(
		() => {
			if (userInfo && threadData) {
				const seenAts: SeenAts = {};
				threadData.messages.forEach((msg) => {
					seenAts[msg.id] = msg.seenAt;
				});

				const seenIcons: SeenIcons = {};

				threadData.membersUid
					.filter((memberUid) => memberUid !== userInfo.uid)
					.forEach((nonSelfUid) => {
						let latestMsgId: string | null = null;
						for (const messageId in seenAts) {
							const msgSeenAt = seenAts[messageId];
							if (msgSeenAt) {
								if (msgSeenAt[nonSelfUid] !== null) {
									// if user has seen the message
									if (latestMsgId === null) {
										latestMsgId = messageId;
									} else {
										if (
											nonSelfUid in msgSeenAt &&
											latestMsgId in seenAts &&
											nonSelfUid in seenAts[latestMsgId]
										) {
											if (
												(
													msgSeenAt[
														nonSelfUid
													] as FirebaseFirestoreTypes.Timestamp
												).valueOf() >=
												(
													seenAts[latestMsgId][
														nonSelfUid
													] as FirebaseFirestoreTypes.Timestamp
												).valueOf()
											) {
												latestMsgId = messageId;
											}
										}
									}
								}
							}
						}

						seenIcons[nonSelfUid] = latestMsgId;
					});

				setSeenIcons(seenIcons);
			}
		},
		// intentionally left out userInfo because threadData already has
		// userInfo as dependency
		[threadData]
	);

	return { seenIcons, setSeenIcons };
};
export default useSeenIcons;
