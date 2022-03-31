import { WISHLIST_PER_PAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { db } from '@firebase.config';
import logger from '@logger';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { WishlistDataCL } from 'types';

export type UseNewWishlist = (
	query: string | null,
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

	useEffect(
		() => {
			if (!userInfo) {
				let isSubscribed = true;
				isSubscribed && setNewWishlist(undefined);
				return () => {
					isSubscribed = false;
				};
			}
			if (query === null) {
				let isSubscribed = true;
				isSubscribed && setNewWishlist(undefined);
				return () => {
					isSubscribed = false;
				};
			}
			if (query.length === 0) {
				const unsubscribe = db
					.collection('users')
					.doc(userInfo.uid)
					.collection('wishlist')
					.orderBy('addedAt', 'asc')
					.limit(WISHLIST_PER_PAGE)
					.onSnapshot(
						(querySnapshot) => {
							if (!querySnapshot.empty) {
								if (!lastDoc) {
									setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
								}
								const newWishlist = querySnapshot.docs.map(
									(docSnap) => docSnap.data() as WishlistDataCL
								);
								setNewWishlist(newWishlist);
							} else {
								setNewWishlist([]);
							}
						},
						(error) => {
							logger.log(error);
							return Toast.show({ type: 'error', text1: error.message });
						}
					);
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
					.onSnapshot(
						(querySnapshot) => {
							if (!querySnapshot.empty) {
								if (!lastDoc) {
									setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
								}
								const newWishlist = querySnapshot.docs.map(
									(docSnap) => docSnap.data() as WishlistDataCL
								);
								setNewWishlist(newWishlist);
							} else {
								setNewWishlist([]);
							}
						},
						(error) => {
							logger.log(error);
							return Toast.show({ type: 'error', text1: error.message });
						}
					);
				return () => unsubscribe();
			}
		},
		// intentionally leave out "query" cuz it is a dependency of "trigger"
		[userInfo, trigger]
	);
	return { newWishlist, setNewWishlist };
};

export default useNewWishlist;
