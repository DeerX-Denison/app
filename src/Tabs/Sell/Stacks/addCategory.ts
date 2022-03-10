import React from 'react';
import { ListingErrors } from 'src/Hooks/useListingError';
import { ListingCategory, ListingData } from 'types';

export type AddCategoryFn = (
	category: ListingCategory,
	listingData: ListingData | null | undefined,
	setListingData: React.Dispatch<
		React.SetStateAction<ListingData | null | undefined>
	>,
	setCategorizing: React.Dispatch<React.SetStateAction<boolean>>,
	setQuery: React.Dispatch<React.SetStateAction<string>>,
	listingErrors: ListingErrors
) => void;

/**
 * handles when user add a category tag
 */
const addCategory: AddCategoryFn = (
	category,
	listingData,
	setListingData,
	setCategorizing,
	setQuery,
	listingErrors
) => {
	if (listingData) {
		setListingData({
			...listingData,
			category: [...new Set([...listingData.category, category])],
		});
		setCategorizing(false);
		setQuery('');
		listingErrors.setHasEditCategory(true);
	}
};
export default addCategory;
