import { fn } from '@firebase.config';
import logger from '@logger';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
		logger.error(error);
	} finally {
		navigation.goBack();
	}
};

export default deleteListing;
