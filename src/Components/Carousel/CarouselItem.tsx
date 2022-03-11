import * as Buttons from '@Components/Buttons';
import tw from '@tw';
import {
	launchImageLibraryAsync,
	MediaTypeOptions,
	requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import React, { FC, useEffect, useState } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
import { ListingErrors } from 'src/Hooks/useListingError';
import { CarouselData, ListingData } from 'types';

interface Props {
	item: CarouselData;
	index: number;
	setIndex: React.Dispatch<React.SetStateAction<number>>;
	editMode: boolean;
	listingData: ListingData | null | undefined;
	setListingData: React.Dispatch<
		React.SetStateAction<ListingData | null | undefined>
	>;
	listingErrors?: ListingErrors;
}

const CarouselItem: FC<Props> = ({
	item,
	index,
	setIndex,
	editMode,
	listingData,
	setListingData,
	listingErrors,
}) => {
	const [isViewing, setIsViewing] = useState<boolean>(false);
	const { width } = useWindowDimensions();
	const removeHandler = () => {
		const images = listingData ? listingData.images.map((x) => x) : [];
		images.splice(index, 1);
		setIndex(index - 1 < 0 ? 0 : index - 1);
		setListingData({ ...listingData, images } as ListingData);
		listingErrors?.setHasEditImage(true);
	};
	const addHandler = async () => {
		const result = await launchImageLibraryAsync({
			mediaTypes: MediaTypeOptions.All,
			// allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});
		if (!result.cancelled && listingData) {
			setListingData({
				...listingData,
				images: [...listingData.images, result.uri],
			});
		}
	};
	// TODO: change this effect to only prompt permission if user is uploading picture from their device. Currently, when you press to Item, it automatically asks for permission without user wanting to upload anything from their device
	useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } = await requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('Sorry, we need camera roll permissions to make this work!');
				}
			}
		})();
	}, []);
	return (
		<>
			<View key={index} style={{ width, height: width }}>
				<View
					style={tw(
						'absolute flex flex-row justify-end items-end z-10 top-0 w-full'
					)}
				>
					{editMode && (
						<Buttons.Primary title="Remove" onPress={removeHandler} size="md" />
					)}
					{editMode && (
						<Buttons.Primary title="Add" onPress={addHandler} size="md" />
					)}
					<Buttons.Primary
						title="View"
						onPress={() => setIsViewing(true)}
						size="md"
					/>
				</View>

				<FastImage source={{ uri: item }} style={tw('w-full h-full')} />
			</View>
			<ImageView
				images={[{ uri: item }]}
				imageIndex={0}
				visible={isViewing}
				onRequestClose={() => setIsViewing(false)}
				swipeToCloseEnabled={true}
			/>
		</>
	);
};

export default CarouselItem;
