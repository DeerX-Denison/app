import { UserContext } from '@Contexts';
import { useContext, useEffect, useState } from 'react';
import 'react-native-get-random-values';
import { ListingData } from 'types';
import { v4 as uuidv4 } from 'uuid';

/**
 * custom hook to create a temporary, default new listing data
 */
const useNewListingData = () => {
	const { userInfo } = useContext(UserContext);
	const [listingData, setListingData] = useState<
		ListingData | null | undefined
	>();

	useEffect(() => {
		userInfo &&
			setListingData({
				id: uuidv4(),
				images: [],
				name: '',
				price: '',
				category: [],
				seller: {
					email: userInfo.email,
					displayName: userInfo.displayName,
					photoURL: userInfo.photoURL,
					uid: userInfo.uid,
				},
				condition: undefined,
				description: '',
				createdAt: undefined,
				updatedAt: undefined,
				likedBy: [],
				status: 'saved',
			});
	}, [userInfo]);
	return { listingData, setListingData };
};

export default useNewListingData;
