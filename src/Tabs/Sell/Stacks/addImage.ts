import {
	launchImageLibraryAsync,
	MediaTypeOptions,
	requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import React from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { ListingErrors } from 'src/Hooks/useListingError';
import { ListingData } from 'types';

export type AddImageFn = (
	listingErrors: ListingErrors,
	listingData: ListingData | null | undefined,
	setListingData: React.Dispatch<
		React.SetStateAction<ListingData | null | undefined>
	>
) => Promise<void>;

/**
 * handle user add image from local device
 *
 * if platform is not web:
 * 		check media library permission status:
 * 			if not granted, alert user to allow permission
 * launch library image and get local photo uri
 * set that local photo uri to listingData state
 */
const addImage: AddImageFn = async (
	listingErrors,
	listingData,
	setListingData
) => {
	const { setHasEditImage } = listingErrors;
	setHasEditImage(true);
	if (Platform.OS !== 'web') {
		const { status } = await requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert(
				'Permission Required',
				'DeerX needs access to your photo to upload your selected images',
				[
					{
						text: 'Okay',
						style: 'cancel',
					},
					{
						text: 'Enable',
						onPress: () => Linking.openURL('app-settings://notification/DeerX'),
						style: 'default',
					},
				]
			);
			return;
		}
	}
	const result = await launchImageLibraryAsync({
		mediaTypes: MediaTypeOptions.All,
		// allowsEditing: true,
		aspect: [4, 3],
		quality: 1,
	});
	if (!result.cancelled && listingData) {
		setListingData({
			...listingData,
			images: [...listingData.images, result.uri],
		});
	}
};

export default addImage;
