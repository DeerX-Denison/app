import { DEFAULT_GUEST_DISPLAY_NAME, DEFAULT_GUEST_EMAIL } from '@Constants';
import { UserContext } from '@Contexts';
import { db } from '@firebase.config';
import logger from '@logger';
import { useContext, useEffect, useState } from 'react';
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
	const { userInfo } = useContext(UserContext);
	const [listingData, setListingData] = useState<
		ListingData | null | undefined
	>(undefined);
	useEffect(() => {
		if (userInfo) {
			const collection =
				userInfo.displayName === DEFAULT_GUEST_DISPLAY_NAME &&
				userInfo.email === DEFAULT_GUEST_EMAIL
					? 'guest_listings'
					: 'listings';
			const unsubscribed = db
				.collection(collection)
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
						logger.error(error);
					}
				);
			return () => unsubscribed();
		}
	}, []);

	return { listingData, setListingData };
};

export default useListingData;
