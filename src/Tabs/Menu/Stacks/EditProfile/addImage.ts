import {
	launchImageLibraryAsync,
	MediaTypeOptions,
	requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import React from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { UserProfile } from 'types';

export type AddImageFn = (
	edittedUserProfile: UserProfile | null | undefined,
	setEdittedUserProfile: React.Dispatch<
		React.SetStateAction<UserProfile | null | undefined>
	>,
	setHasEditImage: React.Dispatch<React.SetStateAction<boolean>>
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
	edittedUserProfile,
	setEdittedUserProfile,
	setHasEditImage
) => {
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
	if (!result.cancelled && edittedUserProfile) {
		setEdittedUserProfile({ ...edittedUserProfile, photoURL: result.uri });
		setHasEditImage(true);
	}
};

export default addImage;
