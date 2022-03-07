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
		const unsubscribe = db
			.collection('listings')
			.where('seller.uid', '==', user?.uid)
			.onSnapshot(
				(docSnaps) => {
					const myListings = docSnaps.docs.map(
						(doc) => doc.data() as ListingData
					);
					setMyListings(myListings);
				},
				(error) => {
					logger.log(error);
					Toast.show({ type: 'error', text1: error.message });
				}
			);
		return () => unsubscribe();
	}, []);
	return { myListings };
};
export default useMyListings;
