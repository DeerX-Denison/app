import React from 'react';
import { ListingCategory } from 'types';

export type AddCategoryFn = (
	suggestion: ListingCategory,
	category: ListingCategory[],
	setCategory: React.Dispatch<React.SetStateAction<ListingCategory[]>>,
	setCategorizing: React.Dispatch<React.SetStateAction<boolean>>,
	setQuery: React.Dispatch<React.SetStateAction<string>>
) => void;

/**
 * handles when user add a category tag
 */
const addCategory: AddCategoryFn = (
	suggestion,
	category,
	setCategory,
	setCategorizing,
	setQuery
) => {
	setCategory([...new Set([...category, suggestion])]);
	setCategorizing(false);
	setQuery('');
};
export default addCategory;
