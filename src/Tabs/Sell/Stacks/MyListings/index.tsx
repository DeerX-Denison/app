import { DENISON_RED_RGBA } from '@Constants';
import { useMyListings } from '@Hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC } from 'react';
import {
	NativeScrollEvent,
	NativeSyntheticEvent,
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { CircleSnail } from 'react-native-progress';
import { ListingId, SellStackParamList } from 'types';
import EditIcon from '../../../../static/edit.svg';
interface Props {
	navigation: NativeStackNavigationProp<SellStackParamList, 'MyListing'>;
}

/**
 * MyListing components, a list of all items that is created and put on sale by the user
 */
const MyListings: FC<Props> = ({ navigation }) => {
	const { myListings, resetMyListings, fetchMyListings } = useMyListings();

	const editHandler = (listingId: ListingId) => {
		navigation.navigate('Edit', { listingId });
	};

	// state for refresh control thread preview scroll view
	const [refreshing, setRefreshing] = React.useState(false);
	const onRefresh = async () => {
		setRefreshing(true);
		await resetMyListings();
		setRefreshing(false);
	};

	// when user scroll down to bottom
	const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetY = e.nativeEvent.contentOffset.y;
		if (offsetY > 50) {
			fetchMyListings();
		}
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
								refreshControl={
									<RefreshControl
										refreshing={refreshing}
										onRefresh={onRefresh}
										size={24}
									/>
								}
								onScrollEndDrag={onScrollEndDrag}
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={tw(
									'flex-col my-2 mx-2 justify-center items-center'
								)}
							>
								{myListings.map((listing, index) => (
									<TouchableWithoutFeedback
										key={listing.id}
										style={tw('w-full mx-1')}
										onPress={() => editHandler(listing.id)}
									>
										<View
											style={tw(
												`flex-row justify-between items-center px-2 py-2 bg-white ${
													index !== 0 ? 'border-t border-red-700' : ''
												}`
											)}
										>
											<View
												style={{
													shadowColor: DENISON_RED_RGBA,
													shadowOffset: { width: 2, height: 4 },
													shadowOpacity: 0.25,
													shadowRadius: 4,
												}}
											>
												<FastImage
													source={{ uri: listing.images[0] }}
													style={tw('w-16 h-16 rounded-lg')}
												/>
											</View>
											<View style={tw('flex flex-1 break-words pl-4')}>
												<Text style={tw('text-lg font-bold')}>
													{listing.name}
												</Text>
											</View>
											<TouchableOpacity
												onPress={() => editHandler(listing.id)}
												style={tw('pr-2')}
											>
												<EditIcon height={32} width={32} />
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
