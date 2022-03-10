import React, { useEffect, useState } from 'react';
import { ListingData } from 'types';

export type ListingErrors = {
	setHasEditImage: React.Dispatch<React.SetStateAction<boolean>>;
	setHasEditName: React.Dispatch<React.SetStateAction<boolean>>;
	setHasEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
	setHasEditCategory: React.Dispatch<React.SetStateAction<boolean>>;
	setHasEditCondition: React.Dispatch<React.SetStateAction<boolean>>;
	setHasEditDesc: React.Dispatch<React.SetStateAction<boolean>>;
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
	setJustPosted: React.Dispatch<React.SetStateAction<boolean>>;
};
/**
 * custom hook to set user input errors. if undefined, no error, else, the string value is the error message
 */
const useListingError = (listingData: ListingData | null | undefined) => {
	const [imageError, setImageError] = useState<string>('');
	const [nameError, setNameError] = useState<string>('');
	const [priceError, setPriceError] = useState<string>('');
	const [categoryError, setCategoryError] = useState<string>('');
	const [conditionError, setConditionError] = useState<string>('');
	const [descError, setDescError] = useState<string>('');
	const [hasEditImage, setHasEditImage] = useState<boolean>(false);
	const [hasEditName, setHasEditName] = useState<boolean>(false);
	const [hasEditPrice, setHasEditPrice] = useState<boolean>(false);
	const [hasEditCategory, setHasEditCategory] = useState<boolean>(false);
	const [hasEditCondition, setHasEditCondition] = useState<boolean>(false);
	const [hasEditDesc, setHasEditDesc] = useState<boolean>(false);
	const [justPosted, setJustPosted] = useState<boolean>(false);

	useEffect(() => {
		// TODO: implement listingData.user check
		if (listingData) {
			listingData.images.length <= 0 && hasEditImage
				? setImageError('Please add an image')
				: setImageError('');
			listingData.name === '' && hasEditName
				? setNameError('Please enter valid name')
				: setNameError('');
			isNaN(parseFloat(listingData.price)) && hasEditPrice
				? setPriceError('Please enter valid price')
				: setPriceError('');
			!isFinite(parseFloat(listingData.price)) && hasEditPrice
				? setPriceError('Please enter valid price')
				: setPriceError('');
			listingData.category.length <= 0 && hasEditCategory
				? setCategoryError('Please select a category')
				: setCategoryError('');
			!listingData.condition && hasEditCondition
				? setConditionError('Please select a condition')
				: setConditionError('');
			listingData.description === '' && hasEditDesc
				? setDescError('Please enter valid description')
				: setDescError('');
		}
	}, [listingData, justPosted]);

	const listingErrors: ListingErrors = {
		setHasEditImage,
		setHasEditName,
		setHasEditPrice,
		setHasEditCategory,
		setHasEditCondition,
		setHasEditDesc,
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
		setJustPosted,
	};
	return listingErrors;
};

export default useListingError;
