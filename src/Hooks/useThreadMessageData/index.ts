import { MESSAGE_PER_PAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { db } from '@firebase.config';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { MessageData } from 'types';
import useNewMessageData from './useNewMessageData';

/**
 * custom hook to fetch thread message data in general for useThreadData
 */
const useThreadMessagesData = (
	isNewThread: boolean | undefined,
	threadId: string | undefined,
	membersUid: string[] | undefined
) => {
	const { userInfo } = useContext(UserContext);

	/**
	 * final messages to be displayed
	 * undefined if not fetched
	 * null if fetched all
	 * MessageData[] if successfully fetched
	 * sorted sucht hat .time further from current time starts at 0
	 * these messages are still the closest to current time,
	 * but stored in array order mentioned above
	 * last updated Mar 12, 2022
	 */
	const [threadMessagesData, setThreadMessagesData] = useState<
		MessageData[] | null | undefined
	>();

	// current last document of query, used for extra query after initial query
	const [lastDoc, setLastDoc] = useState<
		FirebaseFirestoreTypes.DocumentData | undefined
	>();

	// boolean state whether user has fetched all messages
	const [fetchedAll, setFetchedAll] = useState<boolean | undefined>();

	// dummy state to trigger listening for new messages again
	const [trigger, setTrigger] = useState<boolean>(false);

	const { newMsgs, setNewMsgs } = useNewMessageData(
		isNewThread,
		threadId,
		lastDoc,
		setLastDoc,
		trigger
	);

	useEffect(
		() => {
			if (threadMessagesData && threadMessagesData.length > 0) {
				if (
					newMsgs &&
					newMsgs.length > 0 &&
					membersUid &&
					membersUid.length > 0
				) {
					const unionMsgDict: { [key: string]: MessageData } = {};
					threadMessagesData.forEach((msg) => (unionMsgDict[msg.id] = msg));
					newMsgs.forEach((msg) => (unionMsgDict[msg.id] = msg));
					const unionMsgs: MessageData[] = [];
					for (const id in unionMsgDict) {
						unionMsgs.push(unionMsgDict[id]);
					}
					unionMsgs.sort((a, b) => {
						if (a.time && b.time) {
							return a.time.valueOf() > b.time.valueOf() ? 1 : -1;
						} else return 0;
					});
					const filteredNewMsg = unionMsgs.filter((msg) => {
						return (
							msg.membersUid.length === membersUid.length &&
							msg.membersUid.every(
								(value, index) => value === membersUid[index]
							)
						);
					});
					// console.log(filteredNewMsg[filteredNewMsg.length - 1]);
					setThreadMessagesData(filteredNewMsg);
				}
			} else {
				setThreadMessagesData(newMsgs?.reverse());
			}
		},
		// intentionally left out userInfo cuz it is a dependency of newMsgs already
		[newMsgs]
	);

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
			setFetchedAll(uniqueExtraMsgs.length === 0);
			setNewMsgs(uniqueExtraMsgs);
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

	return {
		threadMessagesData,
		setNewMsgs,
		fetchMessages,
		resetMessages,
		fetchedAll,
	};
};

export default useThreadMessagesData;
