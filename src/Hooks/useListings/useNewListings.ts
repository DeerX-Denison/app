import {
	DEFAULT_GUEST_DISPLAY_NAME,
	DEFAULT_GUEST_EMAIL,
	LISTING_PER_PAGE,
} from '@Constants';
import { JustSignOut, UserContext } from '@Contexts';
import { db, localTime } from '@firebase.config';
import logger from '@logger';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ListingCategory, ListingData } from 'types';

export type UseNewListingsFn = (
	categoryFilter: ListingCategory[],
	trigger: boolean,
	lastDoc: FirebaseFirestoreTypes.DocumentData | undefined,
	setLastDoc: React.Dispatch<
		React.SetStateAction<FirebaseFirestoreTypes.DocumentData | undefined>
	>
) => {
	newListings: ListingData[] | null | undefined;
	setNewListings: React.Dispatch<
		React.SetStateAction<ListingData[] | null | undefined>
	>;
};

const useNewListings: UseNewListingsFn = (
	categoryFilter,
	trigger,
	lastDoc,
	setLastDoc
) => {
	const { userInfo } = useContext(UserContext);

	/**
	 * new fetched listings from firestore
	 * undefined if not fetched
	 * null if fetch fail
	 * ListingData[] if sucessfully fetched
	 */
	const [newListings, setNewListings] = useState<
		ListingData[] | null | undefined
	>();
	const { justSignOut } = useContext(JustSignOut);
	useEffect(
		() => {
			if (!userInfo) return;

			const collection =
				userInfo.displayName === DEFAULT_GUEST_DISPLAY_NAME &&
				userInfo.email === DEFAULT_GUEST_EMAIL
					? 'guest_listings'
					: 'listings';

			if (categoryFilter.length === 0) {
				const unsubscribe = db
					.collection(collection)
					.where('status', '==', 'posted')
					.orderBy('createdAt', 'desc')
					.limit(LISTING_PER_PAGE)
					.onSnapshot(
						(querySnapshot) => {
							if (!lastDoc) {
								setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
							}
							const newListings = querySnapshot.docs.map((docSnap) => {
								const lstDataSv = docSnap.data() as ListingData;

								if (lstDataSv) {
									if (
										!lstDataSv.createdAt &&
										docSnap.metadata.hasPendingWrites
									) {
										lstDataSv['createdAt'] = localTime();
									}
								}
								return lstDataSv as ListingData;
							});
							setNewListings(newListings);
						},
						(error) => {
							!justSignOut && logger.error(error);
						}
					);
				return () => unsubscribe();
			} else {
				const unsubscribe = db
					.collection(collection)
					.where('status', '==', 'posted')
					.where('category', 'array-contains-any', categoryFilter)
					.orderBy('createdAt', 'desc')
					.limit(LISTING_PER_PAGE)
					.onSnapshot(
						(querySnapshot) => {
							if (!lastDoc) {
								setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
							}
							const newListings = querySnapshot.docs.map((doc) => {
								const lstDataSv = doc.data() as ListingData;
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								const { status, ...listingData } = lstDataSv;
								return lstDataSv as ListingData;
							});
							setNewListings(newListings);
						},
						(error) => {
							!justSignOut && logger.error(error);
						}
					);
				return () => unsubscribe();
			}
		},
		/**
		 * intentionally left out "categoryFilter" because in useListings
		 * there is an effect that alter "trigger whenever categoryFilter is changed
		 * everytime user changes categoryFilter, this effect will run
		 * no need to redefine "categoryFilter" in dependency array
		 */
		[userInfo, trigger]
	);

	return { newListings, setNewListings };
};

export default useNewListings;
