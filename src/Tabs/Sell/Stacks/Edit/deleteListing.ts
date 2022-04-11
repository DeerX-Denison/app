import { fn } from '@firebase.config';
import logger from '@logger';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { ListingData, SellStackParamList } from 'types';

export type DeleteListingFn = (
	listingData: ListingData,
	navigation: NativeStackNavigationProp<SellStackParamList, 'Edit'>
) => Promise<void>;

const deleteListing: DeleteListingFn = async (listingData, navigation) => {
	try {
		await fn.httpsCallable('deleteListing')(listingData);
		// await db.collection('listings').doc(listingId).delete();
	} catch (error: unknown) {
		if (error instanceof Error) {
			Toast.show({ type: 'error', text1: error.message });
		} else {
			logger.log(error);
			Toast.show({
				type: 'error',
				text1: 'An unexpected error occured. Please try again later',
			});
		}
	} finally {
		navigation.goBack();
	}
};

export default deleteListing;
