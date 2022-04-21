import { DENISON_RED_RGBA } from '@Constants';
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
	navigation: NativeStackNavigationProp<ListingsStackParamList, 'Listings'>;
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
						...tw('flex flex-col justify-center items-center'),
						width: Math.floor(width / 2),
						shadowColor: DENISON_RED_RGBA,
						shadowOffset: { width: 4, height: 4 },
						shadowOpacity: 0.25,
						shadowRadius: 4,
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

					<View
						style={tw('absolute bottom-3 left-3 rounded-xl bg-pink px-2 py-1')}
					>
						<Text style={tw('text-s-md font-semibold text-white')}>
							${listingData.price}
						</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</>
	);
};

export default Listing;
