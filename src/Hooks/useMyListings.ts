import { UserContext } from '@Contexts';
import { db } from '@firebase.config';
import logger from '@logger';
import { useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { ListingData } from 'types';

/**
 * Fetches myListings from database
 */
const useMyListings = () => {
	const user = useContext(UserContext);
	const [myListings, setMyListings] = useState<ListingData[] | undefined>();
	useEffect(() => {
		let isSubscribe = true;
		(async () => {
			try {
				const docSnap = await db
					.collection('listings')
					.where('seller.uid', '==', user?.uid)
					.get();
				const myListings = docSnap.docs.map((doc) => doc.data() as ListingData);
				if (isSubscribe) setMyListings(myListings);
			} catch (error) {
				if (error instanceof Error) {
					logger.log(error);
					Toast.show({ type: 'error', text1: error.message });
				} else {
					logger.log(error);
					Toast.show({
						type: 'error',
						text1: 'An unexpected error occured. Please try again later',
					});
				}
			}
		})();
		return () => {
			isSubscribe = false;
		};
	}, []);
	return { myListings };
};
export default useMyListings;
