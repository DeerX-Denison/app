import { db } from '@firebase.config';
import logger from '@logger';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { SellStackParamList, TabsParamList } from 'types';

export type DeleteListingFn = (
	listingId: string,
	navigation: NativeStackNavigationProp<SellStackParamList, 'Edit'>
) => Promise<void>;

const deleteListing: DeleteListingFn = async (listingId, navigation) => {
	try {
		await db.collection('listings').doc(listingId).delete();
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
		const parentNavigation: NativeStackNavigationProp<TabsParamList> =
			navigation.getParent();
		if (parentNavigation) {
			parentNavigation.navigate('Home', {
				screen: 'Main',
				params: { reset: true },
			});
		}
	}
};

export default deleteListing;
