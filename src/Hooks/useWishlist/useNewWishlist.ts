import { WISHLIST_PER_PAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { db } from '@firebase.config';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { WishlistDataCL } from 'types';

export type UseNewWishlist = (
	query: string,
	trigger: boolean,
	lastDoc: FirebaseFirestoreTypes.DocumentData | undefined,
	setLastDoc: React.Dispatch<
		React.SetStateAction<FirebaseFirestoreTypes.DocumentData | undefined>
	>
) => {
	newWishlist: WishlistDataCL[] | null | undefined;
	setNewWishlist: React.Dispatch<
		React.SetStateAction<WishlistDataCL[] | null | undefined>
	>;
};

const useNewWishlist: UseNewWishlist = (
	query,
	trigger,
	lastDoc,
	setLastDoc
) => {
	const { userInfo } = useContext(UserContext);
	const [newWishlist, setNewWishlist] = useState<
		WishlistDataCL[] | null | undefined
	>(undefined);

	useEffect(() => {
		if (!userInfo) return;
		if (query.length === 0) {
			const unsubscribe = db
				.collection('users')
				.doc(userInfo.uid)
				.collection('wishlist')
				.orderBy('addedAt', 'asc')
				.limit(WISHLIST_PER_PAGE)
				.onSnapshot((querySnapshot) => {
					if (!lastDoc) {
						setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
					}
					const newWishlist = querySnapshot.docs.map(
						(docSnap) => docSnap.data() as WishlistDataCL
					);
					setNewWishlist(newWishlist);
				});
			return () => unsubscribe();
		} else {
			const unsubscribe = db
				.collection('users')
				.doc(userInfo.uid)
				.collection('wishlist')
				.where(
					'searchableKeyword',
					'array-contains',
					query.trim().toLowerCase()
				)
				.orderBy('addedAt', 'asc')
				.limit(WISHLIST_PER_PAGE)
				.onSnapshot((querySnapshot) => {
					if (!lastDoc) {
						setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
					}
					const newWishlist = querySnapshot.docs.map(
						(docSnap) => docSnap.data() as WishlistDataCL
					);
					setNewWishlist(newWishlist);
				});
			return () => unsubscribe();
		}
	}, [userInfo, trigger]);
	return { newWishlist, setNewWishlist };
};

export default useNewWishlist;
