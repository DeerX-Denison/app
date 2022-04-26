import { analytics, fn } from '@firebase.config';
import { ListingData } from 'types';

const removeWishlistFromDb = async (listingData: ListingData) => {
	analytics.logEvent('unlikedListing', { id: listingData.id });
	await fn.httpsCallable('deleteWishlist')(listingData.id);
};

export default removeWishlistFromDb;
