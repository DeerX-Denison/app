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
		let isSubscribed = true;
		(async () => {
			try {
				const docSnap = await db.collection('listings').doc(listingId).get();
				if (docSnap.exists) {
					const listingData = docSnap.data() as ListingData;
					isSubscribed && setListingData(listingData);
				} else {
					isSubscribed && setListingData(null);
				}
			} catch (error) {
				logger.log(error);
				Toast.show({
					type: 'error',
					text1: 'Error fetching listing data, please try again later',
				});
			}
		})();
		return () => {
			isSubscribed = false;
		};
	}, []);
	return { listingData, setListingData };
};

export default useListingData;
