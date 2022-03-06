import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useState } from 'react';
import {
	Text,
	TouchableWithoutFeedback,
	useWindowDimensions,
	View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Circle } from 'react-native-progress';
import { ListingData, ListingsStackParamList } from 'types';

interface Props {
	listingData: ListingData;
	navigation: NativeStackNavigationProp<ListingsStackParamList>;
	onPress: () => void;
}

/**
 * Listing component, storing all users' posted listing one at a time.
 */
const Listing: FC<Props> = ({ listingData, onPress }) => {
	const { width } = useWindowDimensions();
	const [imageLoaded, setImageLoaded] = useState<boolean>(false);
	return (
		<>
			<TouchableWithoutFeedback onPress={onPress}>
				<View
					style={{
						...tw('bg-gray-50 flex flex-col justify-center items-center'),
						width: Math.floor(width / 2),
					}}
				>
					<FastImage
						source={{ uri: listingData.images[0] }}
						style={{
							...tw('rounded-lg'),
							width: Math.floor(width / 2) - 10,
							height: Math.floor(width / 2) - 10,
							margin: 5,
						}}
						onLoad={() => setImageLoaded(true)}
					/>

					{!imageLoaded && (
						<View style={tw('absolute top-0')}>
							<View
								style={{
									...tw('flex justify-center items-center border rounded-lg'),
									width: Math.floor(width / 2) - 10,
									height: Math.floor(width / 2) - 10,
									margin: 5,
								}}
							>
								<Circle size={40} indeterminate={true} />
							</View>
						</View>
					)}

					<View style={tw('flex-row w-full items-center pb-2 pt-1 pl-4')}>
						<Text style={tw('text-s-md font-normal')}>
							${listingData.price}
						</Text>
						<Text> - </Text>
						<Text style={tw('text-s-md font-normal')}>{listingData.name}</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</>
	);
};

export default Listing;
