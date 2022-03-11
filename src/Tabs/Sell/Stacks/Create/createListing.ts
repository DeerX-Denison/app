import { fn } from '@firebase.config';
import logger from '@logger';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import Toast from 'react-native-toast-message';
import { ListingErrors } from 'src/Hooks/useListingError';
import { ListingData, SellStackParamList, UserInfo } from 'types';
import uploadImagesAsync from '../uploadImageAsync';
import validListingData from '../validListingData';

export type CreateListingFn = (
	listingData: ListingData,
	userInfo: UserInfo | null | undefined,
	listingErrors: ListingErrors,
	progress: number[],
	setProgress: React.Dispatch<React.SetStateAction<number[]>>,
	navigation: NativeStackNavigationProp<SellStackParamList, 'Create'>
) => Promise<void>;

/**
 * handle user when click create
 *
 * if listingData === undefined or user not logged in:
 * 		Show user error, indicating invalid input (listingData)
 * if data is invalid:
 * 		set has edit everything
 * 		Show user error, indicating invalid input (listingData)
 * upload user image to cloud storage
 * upload listingData to database
 */
const createListing: CreateListingFn = async (
	listingData,
	userInfo,
	listingErrors,
	progressArray,
	setProgressArray,
	navigation
) => {
	const {
		setHasEditImage,
		setHasEditName,
		setHasEditPrice,
		setHasEditCategory,
		setHasEditCondition,
		setHasEditDesc,
		setJustPosted,
	} = listingErrors;

	if (!listingData || !userInfo) {
		return Toast.show({
			type: 'error',
			text1: 'Invalid inputs, please check your input again',
		});
	}
	if (!validListingData(listingData)) {
		setHasEditImage(true);
		setHasEditName(true);
		setHasEditPrice(true);
		setHasEditCategory(true);
		setHasEditCondition(true);
		setHasEditDesc(true);
		setJustPosted(true);
		return Toast.show({
			type: 'error',
			text1: 'Invalid inputs, please check your input again',
		});
	}
	// update images
	let images: string[];
	try {
		images = await uploadImagesAsync(
			listingData.images,
			listingData.id,
			listingData.seller.uid,
			progressArray,
			setProgressArray
		);
	} catch (error) {
		logger.error(error);
		return navigation.goBack();
	}

	try {
		const newListingData: ListingData = {
			...listingData,
			price: parseFloat(listingData.price).toString(),
			images,
		};
		await fn.httpsCallable('createListing')(newListingData);
	} catch (error) {
		logger.log(error);
	} finally {
		navigation.goBack();
	}
};

export default createListing;
