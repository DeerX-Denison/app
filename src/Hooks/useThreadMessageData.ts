import { MESSAGE_PER_PAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { db, localTime } from '@firebase.config';
import logger from '@logger';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { MessageData } from 'types';

/**
 * custom hook to fetch thread message data in general for useThreadData
 */
const useThreadMessagesData = (
	isNewThread: boolean | undefined,
	threadId: string | undefined
) => {
	const { userInfo } = useContext(UserContext);

	// final message data to return from this custom hook
	// sorted in order such that .time furthest from current time starts at 0
	// these messages are still the closest to current time, but stored in array order like above
	// last updated Jan 8, 2022
	const [threadMessagesData, setThreadMessagesData] = useState<
		MessageData[] | undefined
	>();

	// current last document of query, used for extra query after initial query
	const [lastDoc, setLastDoc] = useState<
		FirebaseFirestoreTypes.DocumentData | undefined
	>();

	// boolean state whether user has fetched all messages
	const [fetchedAll, setFetchedAll] = useState<boolean | undefined>();

	// dummy state to trigger listening for new messages again
	const [trigger, setTrigger] = useState<boolean>(false);

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

						// append unique newMsg to threadMessageData
						if (threadMessagesData && threadMessagesData.length > 0) {
							const updMsgsDict: { [key: string]: MessageData } = {};
							threadMessagesData.forEach((msg) => (updMsgsDict[msg.id] = msg));
							newMsgs.forEach((msg) => (updMsgsDict[msg.id] = msg));

							const updMsgs: MessageData[] = [];
							for (const id in updMsgsDict) {
								updMsgs.push(updMsgsDict[id]);
							}

							setThreadMessagesData(updMsgs);
						} else {
							setThreadMessagesData(newMsgs.reverse());
						}
					},
					(error) => {
						logger.error(error);
						return Toast.show({ type: 'error', text1: error.message });
					}
				);
			return () => unsubscribe();
		}
	}, [userInfo, isNewThread, trigger]);

	/**
	 * query more messages and prepend to threadMessagesData
	 */
	const fetchMessages = async () => {
		if (userInfo && !fetchedAll) {
			const querySnapshot = await db
				.collection('threads')
				.doc(threadId)
				.collection('messages')
				.where('membersUid', 'array-contains', userInfo.uid)
				.orderBy('time', 'desc')
				.startAfter(lastDoc ? lastDoc : [])
				.limit(MESSAGE_PER_PAGE)
				.get();
			setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
			const oldMsgs = threadMessagesData ? threadMessagesData : [];
			const oldMsgIds = oldMsgs.map((msg) => msg.id);
			const extraMsgs = querySnapshot.docs.map(
				(docSnap) => docSnap.data() as MessageData
			);
			const uniqueExtraMsgs = extraMsgs.filter(
				(msg) => !oldMsgIds.includes(msg.id)
			);
			const uniqueExtraMsgsRev = uniqueExtraMsgs.reverse();
			setFetchedAll(uniqueExtraMsgs.length === 0);
			setThreadMessagesData([...uniqueExtraMsgsRev, ...oldMsgs]);
		}
	};

	/**
	 * clear threadMessagesData and fetch first page by retrigger new messages listener
	 */
	const resetMessages = () => {
		if (userInfo) {
			setFetchedAll(false);
			setThreadMessagesData([]);
			setLastDoc(undefined);
			setTrigger(!trigger);
		}
	};

	return { threadMessagesData, fetchMessages, resetMessages, fetchedAll };
};

export default useThreadMessagesData;
