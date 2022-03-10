import React from 'react';
import { ListingCategory } from 'types';
export type RemoveCategoryFn = (
	category: ListingCategory,
	categoryFilter: ListingCategory[],
	setCategoryFilter: React.Dispatch<React.SetStateAction<ListingCategory[]>>
) => void;

/**
 * handles when user removes a category tag
 */
const removeCategory: RemoveCategoryFn = (
	category,
	categoryFilter,
	setCategoryFilter
) => {
	setCategoryFilter(categoryFilter.filter((x) => x !== category));
};
export default removeCategory;
