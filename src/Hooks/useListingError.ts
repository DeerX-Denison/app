import { useEffect, useState } from 'react';
import { ListingData } from 'types';

/**
 * custom hook to set user input errors. if undefined, no error, else, the string value is the error message
 */
const useListingError = (listingData: ListingData | undefined) => {
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
			!listingData.category && hasEditCategory
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
	return {
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
};

export default useListingError;
