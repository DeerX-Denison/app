import React, { useEffect, useState } from 'react';
import { ListingData } from 'types';

export type ListingErrors = {
	hasEditImage: boolean;
	setHasEditImage: React.Dispatch<React.SetStateAction<boolean>>;
	hasEditName: boolean;
	setHasEditName: React.Dispatch<React.SetStateAction<boolean>>;
	hasEditPrice: boolean;
	setHasEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
	hasEditCategory: boolean;
	setHasEditCategory: React.Dispatch<React.SetStateAction<boolean>>;
	hasEditCondition: boolean;
	setHasEditCondition: React.Dispatch<React.SetStateAction<boolean>>;
	hasEditDesc: boolean;
	setHasEditDesc: React.Dispatch<React.SetStateAction<boolean>>;
	hasEditStatus: boolean;
	setHasEditStatus: React.Dispatch<React.SetStateAction<boolean>>;
	imageError: string;
	setImageError: React.Dispatch<React.SetStateAction<string>>;
	nameError: string;
	setNameError: React.Dispatch<React.SetStateAction<string>>;
	priceError: string;
	setPriceError: React.Dispatch<React.SetStateAction<string>>;
	categoryError: string;
	setCategoryError: React.Dispatch<React.SetStateAction<string>>;
	conditionError: string;
	setConditionError: React.Dispatch<React.SetStateAction<string>>;
	descError: string;
	setDescError: React.Dispatch<React.SetStateAction<string>>;
	statusError: string;
	setStatusError: React.Dispatch<React.SetStateAction<string>>;
	setJustPosted: React.Dispatch<React.SetStateAction<boolean>>;
};

export type UseListingErrorFn = (
	listingData: ListingData | null | undefined
) => ListingErrors;
/**
 * custom hook to set user input errors. if undefined, no error, else, the string value is the error message
 */
const useListingError: UseListingErrorFn = (listingData) => {
	const [imageError, setImageError] = useState<string>('');
	const [nameError, setNameError] = useState<string>('');
	const [priceError, setPriceError] = useState<string>('');
	const [categoryError, setCategoryError] = useState<string>('');
	const [conditionError, setConditionError] = useState<string>('');
	const [descError, setDescError] = useState<string>('');
	const [statusError, setStatusError] = useState<string>('');
	const [hasEditImage, setHasEditImage] = useState<boolean>(false);
	const [hasEditName, setHasEditName] = useState<boolean>(false);
	const [hasEditPrice, setHasEditPrice] = useState<boolean>(false);
	const [hasEditCategory, setHasEditCategory] = useState<boolean>(false);
	const [hasEditCondition, setHasEditCondition] = useState<boolean>(false);
	const [hasEditDesc, setHasEditDesc] = useState<boolean>(false);
	const [hasEditStatus, setHasEditStatus] = useState<boolean>(false);
	const [justPosted, setJustPosted] = useState<boolean>(false);

	useEffect(() => {
		// TODO: implement listingData.user check
		if (listingData) {
			if (listingData.images.length <= 0 && hasEditImage) {
				setImageError('Please add an image');
			} else if (listingData.images.length > 5 && hasEditImage) {
				setImageError('You can add maximum 5 images');
			} else {
				setImageError('');
			}

			if (listingData.name === '' && hasEditName) {
				setNameError('Please enter valid name');
			} else if (listingData.name.length > 50 && hasEditName) {
				setNameError('Name exceed 50 characters');
			} else {
				setNameError('');
			}

			if (isNaN(parseFloat(listingData.price)) && hasEditPrice) {
				setPriceError('Please enter valid price');
			} else if (!isFinite(parseFloat(listingData.price)) && hasEditPrice) {
				setPriceError('Please enter valid price');
			} else if (listingData.price.length > 5 && hasEditPrice) {
				setPriceError('Price exceed 5 characters');
			} else {
				setPriceError('');
			}

			if (listingData.category.length <= 0 && hasEditCategory) {
				setCategoryError('Please select a category');
			} else {
				setCategoryError('');
			}

			if (!listingData.condition && hasEditCondition) {
				setConditionError('Please select a condition');
			} else {
				setConditionError('');
			}

			if (listingData.description === '' && hasEditDesc) {
				setDescError('Please enter valid description');
			} else if (listingData.description.length > 250 && hasEditDesc) {
				setDescError('Please enter valid description');
			} else {
				setDescError('');
			}

			if (!listingData.status && hasEditStatus) {
				setStatusError('Please select a status');
			} else if (listingData.status === 'sold' && !('soldTo' in listingData)) {
				setTimeout(() => {
					setStatusError('Please select the user sold to');
				}, 250);
			} else {
				setStatusError('');
			}
		}
	}, [listingData, justPosted]);

	const listingErrors: ListingErrors = {
		hasEditImage,
		setHasEditImage,
		hasEditName,
		setHasEditName,
		hasEditPrice,
		setHasEditPrice,
		hasEditCategory,
		setHasEditCategory,
		hasEditCondition,
		setHasEditCondition,
		hasEditDesc,
		setHasEditDesc,
		hasEditStatus,
		setHasEditStatus,
		imageError,
		setImageError,
		nameError,
		setNameError,
		priceError,
		setPriceError,
		categoryError,
		setCategoryError,
		conditionError,
		setConditionError,
		descError,
		setDescError,
		statusError,
		setStatusError,
		setJustPosted,
	};
	return listingErrors;
};

export default useListingError;
