import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useMyListings } from '@Hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC } from 'react';
import {
	ScrollView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
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
								{myListings.map((listing, index) => (
									<TouchableWithoutFeedback
										key={listing.id}
										style={tw('w-full')}
										onPress={() => editHandler(listing.id)}
									>
										<View
											style={tw(
												`flex-row justify-between items-center mx-2 py-2 ${
													index !== 0 ? 'border-t border-red-700' : ''
												}`
											)}
										>
											<FastImage
												source={{ uri: listing.images[0] }}
												style={tw('w-16 h-16 rounded-lg')}
											/>
											<View style={tw('flex flex-1 break-words pl-4')}>
												<Text style={tw('text-lg font-bold')}>
													{listing.name}
												</Text>
											</View>
											<TouchableOpacity
												onPress={() => editHandler(listing.id)}
												style={tw('pr-2')}
											>
												<FontAwesomeIcon
													icon={faEdit}
													size={24}
													style={tw('text-indigo-500')}
												/>
											</TouchableOpacity>
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
