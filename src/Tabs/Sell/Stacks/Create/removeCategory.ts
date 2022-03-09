import React from 'react';
import { ListingErrors } from 'src/Hooks/useListingError';
import { ListingCategory, ListingData } from 'types';
export type RemoveCategoryFn = (
	category: ListingCategory,
	listingErrors: ListingErrors,
	listingData: ListingData | null | undefined,
	setListingData: React.Dispatch<
		React.SetStateAction<ListingData | null | undefined>
	>
) => void;

/**
 * handles when user removes a category tag
 */
const removeCategoryHandler: RemoveCategoryFn = (
	category,
	listingErrors,
	listingData,
	setListingData
) => {
	const { setHasEditCategory } = listingErrors;
	if (listingData) {
		setListingData({
			...listingData,
			category: listingData.category.filter((x) => x !== category),
		});
		setHasEditCategory(true);
	}
};
export default removeCategoryHandler;
