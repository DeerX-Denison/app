import { db } from '@firebase.config';
import logger from '@logger';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { ListingData, ListingId } from 'types';

/**
 * custom hook to fetch listing data with provided listingId from database. if listingData is undefined, it is not fetched. If listingData is null, it does not exist. If listingData is fetchedm it is ListingData type
 */
const useListingData = (listingId: ListingId) => {
	const [listingData, setListingData] = useState<
		ListingData | null | undefined
	>(undefined);

	useEffect(() => {
		const unsubscribe = db
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
		return () => unsubscribe();
	}, []);
	return { listingData, setListingData };
};

export default useListingData;
