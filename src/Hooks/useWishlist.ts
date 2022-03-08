import { WISHLIST_PER_PAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { db } from '@firebase.config';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { WishlistDataCL } from 'types';

/**
 * query user's wishlist
 */
const useWishlist = () => {
	const { userInfo } = useContext(UserContext);

	// final wishlist data to be return from this custom hook and render
	// sorted in order such that .addedAt closest to current time starts at 0
	// last updated Feb 7, 2022

	const [wishlist, setWishlist] = useState<WishlistDataCL[] | undefined>();

	// current last document of query, used for extra query after initial query
	const [lastDoc, setLastDoc] = useState<
		FirebaseFirestoreTypes.DocumentData | undefined
	>();

	// boolean state whether user has fetched all wishlist
	const [fetchedAll, setFetchedAll] = useState<boolean>(false);

	// dummy state to trigger fetching intial wishlist
	const [trigger, setTrigger] = useState<boolean>(false);

	/**
	 * listen for new wishlist
	 */
	useEffect(() => {
		if (!userInfo) return;
		const unsubscribe = db
			.collection('users')
			.doc(userInfo.uid)
			.collection('wishlist')
			.orderBy('addedAt', 'asc')
			// .startAfter(lastDoc ? lastDoc : [])
			// .limit(WISHLIST_PER_PAGE)
			.onSnapshot((querySnapshot) => {
				setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
				const oldWl = wishlist ? wishlist : [];
				const oldWlIds = oldWl.map((wl) => wl.id);
				const extraWl = querySnapshot.docs.map(
					(docSnap) => docSnap.data() as WishlistDataCL
				);
				const uniqueExtraWl = extraWl.filter(
					(lst) => !oldWlIds.includes(lst.id)
				);
				setFetchedAll(uniqueExtraWl.length === 0);
				setWishlist([...oldWl, ...uniqueExtraWl]);
			});
		return () => unsubscribe();
	}, [userInfo, trigger]);

	/**
	 * query more listings and append to listings
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
			setWishlist([]);
			setLastDoc(undefined);
			setTrigger(!trigger);
		}
	};

	return { wishlist, fetchWishlist, resetWishlist, fetchedAll };
};

export default useWishlist;
