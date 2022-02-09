import { THREADS_PER_PAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { db, localTime } from '@firebase.config';
import logger from '@logger';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { ThreadPreviewData } from 'types';

/**
 * merge current threads with updated threads from onShapshot. Return new threads as a result of the merged threads. The new threads is sorted by latestTime, closest to current time starts at index 0.
 * shifting window behaviour: only the newest "THREADS_PER_PAGE" number of threads is set state
 */
const mergeThreads = (
	curThrs: ThreadPreviewData[],
	updThrs: ThreadPreviewData[]
) => {
	const newThrs: ThreadPreviewData[] = [];
	const curIds = curThrs.map((x) => x.id);
	const updIds = updThrs.map((x) => x.id);
	const removedIds = curIds.filter((x) => !updIds.includes(x));
	const mergedIds = [...new Set([...curIds, ...updIds])];
	const mergedIdsRemoved = mergedIds.filter((id) => !removedIds.includes(id));
	mergedIdsRemoved.forEach((id) => {
		const valueThatMatchId = updThrs.find((b) => b.id === id);
		if (valueThatMatchId) newThrs.push(valueThatMatchId);
	});
	newThrs.sort((a, b) => {
		if (a.latestTime && b.latestTime) {
			return a.latestTime.valueOf() > b.latestTime.valueOf() ? -1 : 1;
		} else {
			return 0;
		}
	});
	return newThrs;
};

/**
 * custom hook to fetches the user's threads from db in general
 */
const useThreads = () => {
	// final threads data to be return from this custom hook and render
	// sorted in order such that .latestTime closest to current time starts at 0
	// last updated Jan 13, 2022
	const [threads, setThreads] = useState<ThreadPreviewData[] | undefined>();

	// states for newly fetched listing data
	const [updThrs, setUpdThrs] = useState<ThreadPreviewData[] | undefined>();

	// current last document of query, used for extra query after initial query
	const [lastDoc, setLastDoc] = useState<
		FirebaseFirestoreTypes.DocumentData | undefined
	>();

	// boolean state whether user has fetched all listings
	const [fetchedAll, setFetchedAll] = useState<boolean>(false);

	// dummy state to trigger listening for new messages again
	const [trigger, setTrigger] = useState<boolean>(false);

	const user = useContext(UserContext);

	/**
	 * listen for new threads
	 */
	useEffect(() => {
		if (user) {
			const unsubscribe = db
				.collection('threads')
				.where('membersUid', 'array-contains', user.uid)
				.orderBy('latestTime', 'desc')
				.limit(THREADS_PER_PAGE)
				.onSnapshot(
					(querySnapshot) => {
						if (!lastDoc) {
							setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
						}
						const updThrs: ThreadPreviewData[] = querySnapshot.docs.map(
							(docSnap) => {
								const thr = docSnap.data() as ThreadPreviewData;
								if (thr) {
									if (!thr.latestTime && docSnap.metadata.hasPendingWrites) {
										thr['latestTime'] = localTime();
									}
								}
								return thr;
							}
						);
						setUpdThrs(updThrs);
					},
					(error) => {
						logger.log(error);
						return Toast.show({ type: 'error', text1: error.message });
					}
				);
			return () => unsubscribe();
		}
	}, [user, trigger]);

	/**
	 * parse updThrs to threads
	 */
	useEffect(() => {
		let isSubscribed = true;
		if (updThrs && updThrs.length > 0) {
			if (threads && threads.length > 0) {
				const curThrs = threads;
				const newThrs = mergeThreads(curThrs, updThrs);
				isSubscribed && setThreads(newThrs);
			} else {
				isSubscribed && setThreads(updThrs);
			}
		} else if (updThrs && updThrs.length === 0) {
			isSubscribed && setThreads(updThrs);
		}
		return () => {
			isSubscribed = false;
		};
	}, [updThrs]);

	/**
	 * query more threads and append to threads
	 */
	const fetchThreads = async () => {
		if (user && !fetchedAll) {
			const querySnapshot = await db
				.collection('threads')
				.where('membersUid', 'array-contains', user.uid)
				.orderBy('latestTime', 'desc')
				.startAfter(lastDoc ? lastDoc : [])
				.limit(THREADS_PER_PAGE)
				.get();
			setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
			const oldThrs = threads ? threads : [];
			const oldThrIds = oldThrs.map((thr) => thr.id);
			const extraThrs = querySnapshot.docs.map(
				(docSnap) => docSnap.data() as ThreadPreviewData
			);
			const uniqueExtraThrs = extraThrs.filter(
				(thr) => !oldThrIds.includes(thr.id)
			);
			setFetchedAll(uniqueExtraThrs.length === 0);
			setThreads([...oldThrs, ...uniqueExtraThrs]);
		}
	};

	/**
	 * clear threads and fetch first page by retrigger new threads listener
	 */
	const resetThreads = async () => {
		if (user) {
			setFetchedAll(false);
			setThreads([]);
			setLastDoc(undefined);
			setTrigger(!trigger);
		}
	};

	return { threads, fetchThreads, resetThreads, fetchedAll };
};
export default useThreads;
