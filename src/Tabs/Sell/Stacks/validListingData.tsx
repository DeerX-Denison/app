import { ListingData } from 'types';

const validListingData: (listingData: ListingData) => boolean = (
	listingData
) => {
	if (listingData.images.length === 0) return false;

	if (listingData.name === '') return false;

	if (isNaN(parseFloat(listingData.price))) return false;

	if (!isFinite(parseFloat(listingData.price))) return false;

	if (listingData.category.length === 0) return false;

	if (!listingData.condition) return false;

	if (!listingData.seller) return false;

	if (listingData.description === '') return false;

	return true;
};

export default validListingData;
