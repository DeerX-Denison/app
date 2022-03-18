import { useMyListings } from '@Hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC } from 'react';
import {
	Image,
	ScrollView,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { CircleSnail } from 'react-native-progress';
import { ListingId, SellStackParamList } from 'types';
interface Props {
	navigation: NativeStackNavigationProp<SellStackParamList, 'MyListing'>;
}

/**
 * MyListing components, a list of all items that is created and put on sale by the user
 */
const MyListings: FC<Props> = ({ navigation }) => {
	const { myListings } = useMyListings();

	const editHandler = (listingId: ListingId) => {
		navigation.navigate('Edit', { listingId });
	};
	return (
		<View style={tw('flex flex-1')}>
			{myListings ? (
				// myListings is fetched, render scroll view
				<>
					{myListings.length > 0 ? (
						// myListings fetched is not empty, render scroll view
						<>
							<ScrollView
								contentContainerStyle={tw(
									'flex-col my-2 justify-center items-center'
								)}
							>
								{myListings.map((listing) => (
									<TouchableWithoutFeedback
										key={listing.id}
										style={tw('w-full')}
										onPress={() => editHandler(listing.id)}
									>
										<View
											style={tw(
												'w-full p-2 flex-row justify-between items-center border-t'
											)}
										>
											<Image
												source={{ uri: listing.images[0] }}
												style={tw('w-16 h-16')}
											/>
											<Text style={tw('text-lg font-bold')}>
												{listing.name}
											</Text>
										</View>
									</TouchableWithoutFeedback>
								))}
							</ScrollView>
						</>
					) : (
						// myListings fetched is empty, display empty messages
						<>
							<View
								style={tw('flex flex-col flex-1 justify-center items-center')}
							>
								<Text style={tw('text-s-md font-semibold p-2')}>
									Nothing on sale
								</Text>
								<Text style={tw('text-s-md font-semibold p-2')}>
									Create one by tapping the top right button!
								</Text>
							</View>
						</>
					)}
				</>
			) : (
				// myListings not fetched, render loading
				<>
					<View
						style={tw('flex flex-1 justify-center items-center')}
						testID="loading"
					>
						<CircleSnail
							size={80}
							indeterminate={true}
							color={['red', 'green', 'blue']}
						/>
					</View>
				</>
			)}
		</View>
	);
};

export default MyListings;
