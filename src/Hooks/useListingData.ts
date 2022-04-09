import { db } from '@firebase.config';
import logger from '@logger';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { ListingData, ListingId } from 'types';

export type UseListingData = (listingId: ListingId) => {
	listingData: ListingData | null | undefined;
	setListingData: React.Dispatch<
		React.SetStateAction<ListingData | null | undefined>
	>;
};

/**
 * custom hook to fetch listing data with provided listingId from database. if listingData is undefined, it is not fetched. If listingData is null, it does not exist. If listingData is fetchedm it is ListingData type
 */
const useListingData: UseListingData = (listingId) => {
	const [listingData, setListingData] = useState<
		ListingData | null | undefined
	>(undefined);

	useEffect(() => {
		const unsubscribed = db
			.collection('listings')
			.doc(listingId)
			.onSnapshot(
				(docSnap) => {
					if (docSnap.exists) {
						const listingData = docSnap.data() as ListingData;
						setListingData(listingData);
					} else {
						setListingData(null);
					}
				},
				(error) => {
					logger.log(error);
					Toast.show({
						type: 'error',
						text1: 'Error fetching listing data, please try again later',
					});
				}
			);
		return () => unsubscribed();
	}, []);

	return { listingData, setListingData };
};

export default useListingData;
