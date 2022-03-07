import { UserContext } from '@Contexts';
import { useContext, useEffect, useState } from 'react';
import 'react-native-get-random-values';
import { ListingData } from 'types';
import { v4 as uuidv4 } from 'uuid';

/**
 * custom hook to create a temporary, default new listing data
 */
const useNewListingData = () => {
	const user = useContext(UserContext);
	const [listingData, setListingData] = useState<
		ListingData | null | undefined
	>();

	useEffect(() => {
		user &&
			setListingData({
				id: uuidv4(),
				images: [],
				name: '',
				price: '',
				category: undefined,
				seller: {
					email: user.email,
					displayName: user.displayName,
					photoURL: user.photoURL,
					uid: user.uid,
				},
				condition: undefined,
				description: '',
				savedBy: 0,
				createdAt: undefined,
				updatedAt: undefined,
				status: 'saved',
			});
	}, [user]);
	return { listingData, setListingData };
};

export default useNewListingData;
