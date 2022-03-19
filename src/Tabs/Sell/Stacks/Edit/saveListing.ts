import { fn } from '@firebase.config';
import logger from '@logger';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { ListingErrors } from 'src/Hooks/useListingError';
import { ListingData, SellStackParamList, UserInfo } from 'types';
import uploadImagesAsync from '../uploadImageAsync';
import validListingData from '../validListingData';

export type SaveListingFn = (
	listingData: ListingData,
	userInfo: UserInfo | null | undefined,
	listingErrors: ListingErrors,
	subProgressArray: number[],
	setSubProgressArray: React.Dispatch<React.SetStateAction<number[]>>,
	navigation: NativeStackNavigationProp<SellStackParamList, 'Edit'>
) => Promise<void>;

/**
 * handle user when click save
 *
 * if listingData === undefined or user not logged in:
 * 		Show user error, indicating invalid input (listingData)
 * if data is invalid:
 * 		set has edit everything
 * 		Show user error, indicating invalid input (listingData)
 * save current listingData
 */
const saveListing: SaveListingFn = async (
	listingData,
	userInfo,
	listingErrors,
	subProgressArray,
	setSubProgressArray,
	navigation
) => {
	const {
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

	if (
		!hasEditImage &&
		!hasEditName &&
		!hasEditPrice &&
		!hasEditCategory &&
		!hasEditCondition &&
		!hasEditDesc
	) {
		return navigation.goBack();
	}

	let images: string[];

	try {
		images = await uploadImagesAsync(
			listingData.images,
			listingData.id,
			listingData.seller.uid,
			subProgressArray,
			setSubProgressArray
		);
	} catch (error) {
		logger.error(error);
		return navigation.goBack();
	}

	try {
		const updatedListing = {
			...listingData,
			price: parseFloat(listingData.price).toString(),
			images,
		};
		await fn.httpsCallable('updateListing')(updatedListing);
	} catch (error) {
		logger.log(error);
		Toast.show({
			type: 'error',
			text1: 'Fail to update, please try again later',
		});
		return navigation.goBack();
	} finally {
		navigation.goBack();
	}
};
export default saveListing;
