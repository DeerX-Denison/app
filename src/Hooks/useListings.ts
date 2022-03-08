import { LISTING_PER_PAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { db } from '@firebase.config';
import logger from '@logger';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { ListingData } from 'types';

/**
 * custom hook to fetches listing from db in general
 */
const useListings = () => {
	const { userInfo } = useContext(UserContext);

	// final listing data to be return from this custom hook and render
	// sorted in order such that .createdAt closest to current time starts at 0
	// last updated Jan 8, 2022
	const [listings, setListings] = useState<ListingData[] | undefined>();

	// current last document of query, used for extra query after initial query
	const [lastDoc, setLastDoc] = useState<
		FirebaseFirestoreTypes.DocumentData | undefined
	>();

	// boolean state whether user has fetched all listings
	const [fetchedAll, setFetchedAll] = useState<boolean>(false);

	// dummy state to trigger listening for new messages again
	const [trigger, setTrigger] = useState<boolean>(false);

	/**
	 * listen for new listings
	 */
	useEffect(() => {
		if (userInfo) {
			const unsubscribe = db
				.collection('listings')
				.where('status', '==', 'posted')
				.orderBy('createdAt', 'desc')
				.limit(LISTING_PER_PAGE)
				.onSnapshot(
					(querySnapshot) => {
						if (!lastDoc) {
							setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
						}
						const newLsts = querySnapshot.docs.map((doc) => {
							const lstDataSv = doc.data() as ListingData;
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const { status, ...listingData } = lstDataSv;
							return lstDataSv as ListingData;
						});

						// append unique newLsts to listings with
						if (listings && listings.length > 0) {
							const updLstDict: { [key: string]: ListingData } = {};
							listings.forEach((lst) => (updLstDict[lst.id] = lst));
							newLsts.forEach((lst) => (updLstDict[lst.id] = lst));

							const updLsts: ListingData[] = [];
							for (const id in updLstDict) {
								updLsts.push(updLstDict[id]);
							}
							setListings(updLsts);
						} else {
							setListings(newLsts);
						}
					},
					(error) => {
						logger.log(error);
						return Toast.show({ type: 'error', text1: error.message });
					}
				);
			return () => unsubscribe();
		}
	}, [userInfo, trigger]);

	/**
	 * query more listings and append to listings
	 */
	const fetchListings = async () => {
		if (userInfo && !fetchedAll) {
			const querySnapshot = await db
				.collection('listings')
				.where('status', '==', 'posted')
				.orderBy('createdAt', 'desc')
				.startAfter(lastDoc ? lastDoc : [])
				.limit(LISTING_PER_PAGE)
				.get();
			setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
			const oldLsts = listings ? listings : [];
			const oldLstIds = oldLsts.map((lst) => lst.id);
			const extraLsts = querySnapshot.docs.map(
				(docSnap) => docSnap.data() as ListingData
			);
			const uniqueExtraLsts = extraLsts.filter(
				(lst) => !oldLstIds.includes(lst.id)
			);
			setFetchedAll(uniqueExtraLsts.length === 0);
			setListings([...oldLsts, ...uniqueExtraLsts]);
		}
	};

	/**
	 * clear listings and fetch first page by retrigger new listings listener
	 */
	const resetListings = async () => {
		if (userInfo) {
			setFetchedAll(false);
			setListings([]);
			setLastDoc(undefined);
			setTrigger(!trigger);
		}
	};

	return {
		listings,
		fetchListings,
		resetListings,
		fetchedAll,
	};
};

export default useListings;
