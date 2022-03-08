import { UserContext } from '@Contexts';
import { db } from '@firebase.config';
import { useContext, useEffect, useState } from 'react';

/**
 * custom hook to determind if input listingId is saved by current user
 */
const useIsInWishlist = (listingId: string | undefined) => {
	const { userInfo } = useContext(UserContext);
	const [isInWishlist, setIsInWishlist] = useState<boolean | undefined>();
	useEffect(() => {
		if (userInfo && listingId) {
			let isSubscribed = true;
			(async () => {
				const docSnap = await db
					.collection('users')
					.doc(userInfo.uid)
					.collection('wishlist')
					.doc(listingId)
					.get();
				if (docSnap.exists) {
					isSubscribed && setIsInWishlist(true);
				} else {
					isSubscribed && setIsInWishlist(false);
				}
			})();
			return () => {
				isSubscribed = false;
			};
		}
	}, [listingId]);
	return { isInWishlist, setIsInWishlist };
};

export default useIsInWishlist;
