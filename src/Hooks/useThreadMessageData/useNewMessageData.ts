import { MESSAGE_PER_PAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { db, localTime } from '@firebase.config';
import logger from '@logger';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { MessageData } from 'types';

export type UseNewMessageData = (
	isNewThread: boolean | undefined,
	threadId: string | undefined,
	lastDoc: FirebaseFirestoreTypes.DocumentData | undefined,
	setLastDoc: React.Dispatch<
		React.SetStateAction<FirebaseFirestoreTypes.DocumentData | undefined>
	>,
	trigger: boolean
) => {
	newMsgs: MessageData[] | null | undefined;
	setNewMsgs: React.Dispatch<
		React.SetStateAction<MessageData[] | null | undefined>
	>;
};

/**
 * custom hook to listen for new messages in a given threadId
 */
const useNewMessageData: UseNewMessageData = (
	isNewThread,
	threadId,
	lastDoc,
	setLastDoc,
	trigger
) => {
	const { userInfo } = useContext(UserContext);

	/**
	 * new fetched messages from firestore
	 * undefined is not fetched
	 * null is fetch fail
	 * MessageData[] if successfully fetched
	 */
	const [newMsgs, setNewMsgs] = useState<MessageData[] | null | undefined>([]);
	/**
	 * listen for new messages and update threadMessageData
	 */
	useEffect(() => {
		if (userInfo && isNewThread === false) {
			const unsubscribe = db
				.collection('threads')
				.doc(threadId)
				.collection('messages')
				.where('membersUid', 'array-contains', userInfo.uid)
				.orderBy('time', 'desc')
				.limit(MESSAGE_PER_PAGE)
				.onSnapshot(
					(querySnapshot) => {
						if (!lastDoc) {
							setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
						}
						const newMsgs: MessageData[] = querySnapshot.docs.map((docSnap) => {
							const msg = docSnap.data() as MessageData;
							if (msg) {
								if (!msg.time && docSnap.metadata.hasPendingWrites) {
									// if message time is null because svTime() not set yet, use localTime() temporarily
									msg['time'] = localTime();
								}
							}
							return msg;
						});
						setNewMsgs(newMsgs);
					},
					(error) => {
						logger.error(error);
						return Toast.show({ type: 'error', text1: error.message });
					}
				);
			return () => unsubscribe();
		}
	}, [userInfo, isNewThread, threadId, trigger]);

	return { newMsgs, setNewMsgs };
};

export default useNewMessageData;
