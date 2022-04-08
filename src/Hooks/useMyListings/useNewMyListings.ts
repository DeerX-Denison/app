import { MY_LISTINGS_PER_PAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { db } from '@firebase.config';
import logger from '@logger';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { MyListingData } from 'types';

export type useNewMyListings = (
	trigger: boolean,
	lastDoc: FirebaseFirestoreTypes.DocumentData | undefined,
	setLastDoc: React.Dispatch<
		React.SetStateAction<FirebaseFirestoreTypes.DocumentData | undefined>
	>
) => {
	newMyListings: MyListingData[] | null | undefined;
	setNewMyListings: React.Dispatch<
		React.SetStateAction<MyListingData[] | null | undefined>
	>;
};

const useNewMyListings: useNewMyListings = (trigger, lastDoc, setLastDoc) => {
	const { userInfo } = useContext(UserContext);
	const [newMyListings, setNewMyListings] = useState<
		MyListingData[] | null | undefined
	>(undefined);

	useEffect(
		() => {
			if (!userInfo) {
				let isSubscribed = true;
				isSubscribed && setNewMyListings(undefined);
				return () => {
					isSubscribed = false;
				};
			}
			const unsubscribe = db
				.collection('listings')
				.where('seller.uid', '==', userInfo?.uid)
				.limit(MY_LISTINGS_PER_PAGE)
				.onSnapshot(
					(querySnapshot) => {
						if (!querySnapshot.empty) {
							if (!lastDoc) {
								setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
							}
							const newMyListings = querySnapshot.docs.map(
								(doc) => doc.data() as MyListingData
							);
							setNewMyListings(newMyListings);
						} else {
							setNewMyListings([]);
						}
					},
					(error) => {
						logger.log(error);
						Toast.show({ type: 'error', text1: error.message });
					}
				);
			return () => unsubscribe();
		}, // intentionally leave out "query" cuz it is a dependency of "trigger"
		[userInfo, trigger]
	);
	return { newMyListings, setNewMyListings };
};

export default useNewMyListings;
