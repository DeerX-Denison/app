import { LISTING_PER_PAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { db } from '@firebase.config';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ListingCategory, ListingData } from 'types';
import useNewListings from './useNewListings';

export type UseListingsFn = (categoryFilter: ListingCategory[]) => {
	listings: ListingData[] | null | undefined;
	fetchListings: FetchListingsFn;
	resetListings: ResetListingsFn;
	fetchedAll: boolean;
};

export type FetchListingsFn = (
	categoryFilter: ListingCategory[]
) => Promise<void>;

export type ResetListingsFn = () => Promise<void>;

/**
 * custom hook to fetches listing from db in general
 */
const useListings: UseListingsFn = (categoryFilter) => {
	const { userInfo } = useContext(UserContext);

	// current last document of query, used for extra query after initial query
	const [lastDoc, setLastDoc] = useState<
		FirebaseFirestoreTypes.DocumentData | undefined
	>();

	/**
	 * final listings to be displayed
	 * undefined if not fetched
	 * null if fetch fail
	 * ListingData[] if successfully fetched
	 * sorted such that .createdAt closest to current time starts at index 0
	 * last updated Mar 10, 2022
	 */
	const [listings, setListings] = useState<ListingData[] | null | undefined>();

	// dummy state to trigger listening for new messages again
	const [trigger, setTrigger] = useState<boolean>(false);

	// newly fetched listings
	const { newListings } = useNewListings(
		categoryFilter,
		trigger,
		lastDoc,
		setLastDoc
	);

	useEffect(() => {
		// append unique newLsts to listings with
		if (listings && listings.length > 0) {
			if (newListings && newListings.length > 0) {
				const updLstDict: { [key: string]: ListingData } = {};
				listings.forEach((lst) => (updLstDict[lst.id] = lst));
				newListings.forEach((lst) => (updLstDict[lst.id] = lst));
				const updLsts: ListingData[] = [];
				for (const id in updLstDict) {
					updLsts.push(updLstDict[id]);
				}
				setListings(updLsts);
			}
		} else {
			setListings(newListings);
		}
	}, [userInfo, newListings]);

	// boolean state whether user has fetched all listings
	const [fetchedAll, setFetchedAll] = useState<boolean>(false);

	/**
	 * query more listings and append to listings
	 */
	const fetchListings: FetchListingsFn = async (categoryFilter) => {
		if (userInfo && !fetchedAll) {
			let querySnapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;
			if (categoryFilter.length > 0) {
				querySnapshot = await db
					.collection('listings')
					.where('status', '==', 'posted')
					.where('category', 'array-contains-any', categoryFilter)
					.orderBy('createdAt', 'desc')
					.startAfter(lastDoc ? lastDoc : [])
					.limit(LISTING_PER_PAGE)
					.get();
			} else {
				querySnapshot = await db
					.collection('listings')
					.where('status', '==', 'posted')
					.orderBy('createdAt', 'desc')
					.startAfter(lastDoc ? lastDoc : [])
					.limit(LISTING_PER_PAGE)
					.get();
			}
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
	const resetListings: ResetListingsFn = async () => {
		if (userInfo) {
			setFetchedAll(false);
			setListings([]);
			setLastDoc(undefined);
			setTrigger(!trigger);
		}
	};

	/**
	 * everytime user changes search category, reset displayed listings
	 * Also alter "trigger" to trigger useNewListings to fetch new listings
	 * This effect eliminates the need for "categoryFilter"
	 * in useNewListings dependency array.
	 */
	useEffect(() => {
		resetListings();
	}, [categoryFilter]);

	return {
		listings,
		fetchListings,
		resetListings,
		fetchedAll,
	};
};

export default useListings;
