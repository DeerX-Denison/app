import * as Buttons from '@Components/Buttons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ListingsStackParamList, MyListingData } from 'types';

interface Props {
	onPress: () => void;
	myListingData: MyListingData;
	navigation: NativeStackNavigationProp<ListingsStackParamList>;
}

/**
 * MyListing component, storing each users' posted listing one at a time.
 */
const MyListing: FC<Props> = ({ onPress, myListingData, navigation }) => {
	const editHandler = () => {
		navigation.navigate('Edit', { listingId: myListingData.id });
	};

	return (
		<>
			<TouchableWithoutFeedback style={tw('w-full')} onPress={onPress}>
				<View
					style={tw(
						'w-full p-2 flex-row justify-between items-center border-t'
					)}
				>
					<FastImage
						source={{ uri: myListingData.images[0] }}
						style={tw('w-16 h-16')}
					/>
					<Text style={tw('text-lg font-bold')}>{myListingData.name}</Text>
					<Buttons.Primary title="Edit" onPress={editHandler} size="sm" />
				</View>
			</TouchableWithoutFeedback>
		</>
	);
};

export default MyListing;
