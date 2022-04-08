import { MY_LISTINGS_PER_PAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { db } from '@firebase.config';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ListingData, MyListingData } from 'types';
import useNewMyListings from './useNewMyListings';

export type UseMyListings = () => {
	myListings: MyListingData[] | null | undefined;
	fetchMyListings: () => Promise<void>;
	resetMyListings: () => Promise<void>;
	fetchedAll: boolean;
};

/**
 * Fetches myListings from database
 */
const useMyListings: UseMyListings = () => {
	const { userInfo } = useContext(UserContext);
	const [myListings, setMyListings] = useState<
		ListingData[] | null | undefined
	>();

	// current last document of query, used for extra query after initial query
	const [lastDoc, setLastDoc] = useState<
		FirebaseFirestoreTypes.DocumentData | undefined
	>();

	// boolean state whether user has fetched all myListings
	const [fetchedAll, setFetchedAll] = useState<boolean>(false);

	// dummy state to trigger fetching intial myListings
	const [trigger, setTrigger] = useState<boolean>(false);

	const { newMyListings } = useNewMyListings(trigger, lastDoc, setLastDoc);

	useEffect(
		() => {
			// append unique newLsts to listings with
			if (myListings && myListings.length > 0) {
				if (newMyListings && newMyListings.length > 0) {
					const unionLstDict: { [key: string]: MyListingData } = {};
					myListings.forEach((wl) => (unionLstDict[wl.id] = wl));
					newMyListings.forEach((lst) => (unionLstDict[lst.id] = lst));
					const unionLst: MyListingData[] = [];
					for (const id in unionLstDict) {
						unionLst.push(unionLstDict[id]);
					}
					setMyListings(unionLst);
				}
			} else {
				setMyListings(newMyListings);
			}
		},
		// intentionally left out userInfo cuz its already a dependency of newMyListings
		[newMyListings]
	);

	/**
	 * query more myListings and append to myListings
	 */
	const fetchMyListings = async () => {
		if (!userInfo) return;
		const querySnapshot = await db
			.collection('listings')
			.where('seller.uid', '==', userInfo?.uid)
			.limit(MY_LISTINGS_PER_PAGE)
			.get();
		setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
		const odlLst = myListings ? myListings : [];
		const oldLstIds = odlLst.map((lst) => lst.id);
		const extraLst = querySnapshot.docs.map(
			(docSnap) => docSnap.data() as MyListingData
		);
		const uniqueExtraLst = extraLst.filter(
			(lst) => !oldLstIds.includes(lst.id)
		);
		setFetchedAll(uniqueExtraLst.length === 0);
		setMyListings([...odlLst, ...uniqueExtraLst]);
	};

	/**
	 * clear listings and fetch first page by retrigger new listings listener
	 */
	const resetMyListings = async () => {
		if (userInfo) {
			setFetchedAll(false);
			setMyListings(undefined);
			setLastDoc(undefined);
			setTrigger(!trigger);
		}
	};

	return {
		myListings,
		fetchMyListings,
		resetMyListings,
		fetchedAll,
	};
};
export default useMyListings;
