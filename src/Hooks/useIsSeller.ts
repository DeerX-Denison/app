import { UserContext } from '@Contexts';
import { useContext, useEffect, useState } from 'react';
import { ListingData } from 'types';

/**
 * custom hook to determine if current logged in user is the seller of the input listingData
 */
const useIsSeller = (listingData: ListingData | null | undefined) => {
	const [isSeller, setIsSeller] = useState<boolean | undefined>(undefined);
	const { userInfo } = useContext(UserContext);
	useEffect(() => {
		if (listingData?.seller.uid === userInfo?.uid) {
			setIsSeller(true);
		} else {
			setIsSeller(false);
		}
	}, [listingData]);
	return { isSeller };
};

export default useIsSeller;
