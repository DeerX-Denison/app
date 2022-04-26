import { analytics, fn } from '@firebase.config';
import { WishlistDataCL } from 'types';

const addWishlistToDb = async (wishlistData: WishlistDataCL) => {
	analytics.logEvent('likedListing', { id: wishlistData.id });
	await fn.httpsCallable('createWishlist')(wishlistData);
};

export default addWishlistToDb;
