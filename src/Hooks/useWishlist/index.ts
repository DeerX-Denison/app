import { WISHLIST_PER_PAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { db } from '@firebase.config';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { WishlistDataCL } from 'types';
import useNewWishlist from './useNewWishlist';

export type UseWishlist = (query: string | null) => {
	wishlist: WishlistDataCL[] | null | undefined;
	fetchWishlist: () => Promise<void>;
	resetWishlist: () => Promise<void>;
	fetchedAll: boolean;
};

/**
 * query user's wishlist
 */
const useWishlist: UseWishlist = (query) => {
	const { userInfo } = useContext(UserContext);

	// final wishlist data to be return from this custom hook and render
	// sorted in order such that .addedAt closest to current time starts at 0
	// if fetched no wishlist, default to empty array []
	// last updated Feb 7, 2022

	const [wishlist, setWishlist] = useState<
		WishlistDataCL[] | null | undefined
	>();

	// current last document of query, used for extra query after initial query
	const [lastDoc, setLastDoc] = useState<
		FirebaseFirestoreTypes.DocumentData | undefined
	>();

	// boolean state whether user has fetched all wishlist
	const [fetchedAll, setFetchedAll] = useState<boolean>(false);

	// dummy state to trigger fetching intial wishlist
	const [trigger, setTrigger] = useState<boolean>(false);

	const { newWishlist } = useNewWishlist(query, trigger, lastDoc, setLastDoc);

	useEffect(
		() => {
			// append unique newLsts to listings with
			if (wishlist && wishlist.length > 0) {
				if (newWishlist && newWishlist.length > 0) {
					const unionLstDict: { [key: string]: WishlistDataCL } = {};
					wishlist.forEach((wl) => (unionLstDict[wl.id] = wl));
					newWishlist.forEach((wl) => (unionLstDict[wl.id] = wl));
					const unionWl: WishlistDataCL[] = [];
					for (const id in unionLstDict) {
						unionWl.push(unionLstDict[id]);
					}
					setWishlist(unionWl);
				}
			} else {
				setWishlist(newWishlist);
			}
		},
		// intentionally left out userInfo cuz its already a dependency of newWishlist
		[newWishlist]
	);

	/**
	 * query more wishlist and append to wishlist
	 */
	const fetchWishlist = async () => {
		if (!userInfo) return;
		const querySnapshot = await db
			.collection('users')
			.doc(userInfo.uid)
			.collection('wishlist')
			.orderBy('addedAt', 'asc')
			.startAfter(lastDoc ? lastDoc : [])
			.limit(WISHLIST_PER_PAGE)
			.get();
		setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
		const oldWl = wishlist ? wishlist : [];
		const oldWlIds = oldWl.map((wl) => wl.id);
		const extraWl = querySnapshot.docs.map(
			(docSnap) => docSnap.data() as WishlistDataCL
		);
		const uniqueExtraWl = extraWl.filter((lst) => !oldWlIds.includes(lst.id));
		setFetchedAll(uniqueExtraWl.length === 0);
		setWishlist([...oldWl, ...uniqueExtraWl]);
	};

	/**
	 * clear listings and fetch first page by retrigger new listings listener
	 */
	const resetWishlist = async () => {
		if (userInfo) {
			setFetchedAll(false);
			setWishlist(undefined);
			setLastDoc(undefined);
			setTrigger(!trigger);
		}
	};

	/**
	 * everytime user changes query, reset displayed wishlist
	 * Also alter "trigger" to trigger useNewListings to fetch new listings
	 * This effect eliminates the need for "query"
	 * in useWishlist dependency array.
	 */
	useEffect(() => {
		resetWishlist();
	}, [query]);
	return { wishlist, fetchWishlist, resetWishlist, fetchedAll };
};

export default useWishlist;
