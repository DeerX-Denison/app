import logger from '@logger';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useEffect, useRef } from 'react';
import {
	ActivityIndicator,
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	Text,
	View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { ListingId, ListingsStackParamList } from 'types';
import useListings from '../../../../Hooks/useListings';
import Listing from './Listing';
interface Props {
	navigation: NativeStackNavigationProp<ListingsStackParamList>;
}

/**
 * Main component, default screen for Listing tab. Contain all user posted listings and all necessary buttons (create, goto my listing, goto item)
 */
const Main: FC<Props> = ({ navigation }) => {
	// de-renders back button on navigation header
	useEffect(() => {
		const parentNavigation = navigation.getParent();
		if (parentNavigation) {
			parentNavigation.setOptions({
				headerLeft: () => null,
			});
		} else {
			logger.error(`Parent navigation is undefined for Listings/Main`);
			Toast.show({
				type: 'error',
				text1: 'Unexpected error occured',
			});
		}
	});

	// fetch listings
	const { listings, fetchListings, resetListings, fetchedAll } = useListings();
	const scrollViewRef = useRef<ScrollView | undefined>();

	const itemHandler = (listingId: ListingId) => {
		navigation.navigate('Item', { listingId });
	};

	const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetY = e.nativeEvent.contentOffset.y;
		if (offsetY > 50) {
			fetchListings();
		} else if (offsetY < -50) {
			resetListings();
		}
	};
	return (
		<View style={tw('flex flex-1 bg-gray-50')}>
			<ScrollView
				ref={scrollViewRef as any}
				onScrollEndDrag={onScrollEndDrag}
				contentContainerStyle={tw('flex flex-1')}
			>
				{listings ? (
					// listing is fetched
					<>
						{listings.length !== 0 ? (
							// fetched listings length is > 0, render all Listing
							<View style={tw('flex flex-1 flex-row flex-wrap items-start')}>
								{listings.map((listing) => (
									<Listing
										key={listing.id}
										listingData={listing}
										navigation={navigation}
										onPress={() => itemHandler(listing.id)}
									/>
								))}
							</View>
						) : (
							// fetch listing length is 0, display message saying empty
							<>
								<View
									testID="empty"
									style={tw('flex flex-col flex-1 justify-center items-center')}
								>
									<Text>No item in listing right now</Text>
								</View>
							</>
						)}
					</>
				) : (
					// listing not fetched yet, render loading
					<>
						{
							<View
								testID="loading"
								style={tw(
									'absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center'
								)}
							>
								<ActivityIndicator size={'large'} />
							</View>
						}
					</>
				)}
			</ScrollView>
			{fetchedAll && (
				<View style={tw('w-full')}>
					<Text>
						End of listings. Temporary implementation. Will disable scroll to
						fetch when end of listings.
					</Text>
				</View>
			)}
		</View>
	);
};

export default Main;
