import * as Badges from '@Components/Badges';
import * as Buttons from '@Components/Buttons';
import { useListings, useScaleAnimation } from '@Hooks';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
	Animated,
	NativeScrollEvent,
	NativeSyntheticEvent,
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { CircleSnail } from 'react-native-progress';
import { ListingCategory, ListingId, ListingsStackParamList } from 'types';
import Magnify from '../../../../static/magnify.svg';
import Plus from '../../../../static/plus.svg';
import XIcon from '../../../../static/x.svg';
import Category from './Category';
import Listing from './Listing';
import removeCategory from './removeCategory';
interface Props {
	route: RouteProp<ListingsStackParamList, 'Listings'>;
	navigation: NativeStackNavigationProp<ListingsStackParamList, 'Listings'>;
}

/**
 * Main component, default screen for Listing tab. Contain all user posted listings and all necessary buttons (create, goto my listing, goto item)
 */
const Listings: FC<Props> = ({ route, navigation }) => {
	const [categorizing, setCategorizing] = useState(false);
	const [categoryFilter, setCategoryFilter] = useState<ListingCategory[]>([]);
	const { listings, fetchListings, resetListings } =
		useListings(categoryFilter);
	const scrollViewRef = useRef<ScrollView | undefined>();
	const itemHandler = (listingId: ListingId) => {
		navigation.navigate('Item', { listingId });
	};

	const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetY = e.nativeEvent.contentOffset.y;
		if (offsetY > 50) {
			fetchListings(categoryFilter);
		}
	};

	// state for refresh control thread preview scroll view
	const [refreshing, setRefreshing] = React.useState(false);
	const onRefresh = async () => {
		setRefreshing(true);
		await resetListings();
		setRefreshing(false);
	};

	const { scale } = useScaleAnimation(categorizing);

	useEffect(() => {
		if (route.params.reset === true) {
			resetListings();
		}
	}, [route]);
	return (
		<View style={tw('flex flex-1')}>
			<Category
				category={categoryFilter}
				setCategory={setCategoryFilter}
				categorizing={categorizing}
				setCategorizing={setCategorizing}
			/>
			<Animated.View style={{ ...tw('flex flex-1'), transform: [{ scale }] }}>
				<View
					style={tw('mx-1 my-2 flex flex-row flex-wrap border rounded-lg p-2')}
				>
					{categoryFilter.length === 0 ? (
						// user has not selected a filter, render search bar with magnifying glass
						<>
							<TouchableOpacity
								onPress={() => setCategorizing(true)}
								style={tw(
									'w-full h-full flex-row justify-start items-center py-1.5'
								)}
							>
								<Magnify height={24} width={24} style={tw('m-1')} />
								<Text style={tw('text-s-lg font-normal text-gray-600 ml-2')}>
									Search category
								</Text>
							</TouchableOpacity>
						</>
					) : (
						// user has selected a filter. Render badges with +category
						<>
							{categoryFilter.map((category) => (
								<View key={category}>
									<Badges.Light>
										<TouchableOpacity
											onPress={() =>
												removeCategory(
													category,
													categoryFilter,
													setCategoryFilter
												)
											}
										>
											<XIcon style={tw('m-1')} width={16} height={16} />
										</TouchableOpacity>
										<Text style={tw('capitalize text-s-md font-medium pr-2')}>
											{category}
										</Text>
									</Badges.Light>
								</View>
							))}
							<TouchableOpacity onPress={() => setCategorizing(true)}>
								<Badges.Light>
									<Plus height={16} width={16} style={tw('m-1')} />
									<Text style={tw('capitalize text-s-md font-medium pr-2')}>
										Category
									</Text>
								</Badges.Light>
							</TouchableOpacity>
						</>
					)}
				</View>
				<View ref={scrollViewRef as any} style={tw('flex flex-col flex-1')}>
					{listings ? (
						// listing is fetched
						<>
							{listings.length !== 0 ? (
								// fetched listings length is > 0, render all Listing
								<ScrollView
									showsVerticalScrollIndicator={false}
									showsHorizontalScrollIndicator={false}
									refreshControl={
										<RefreshControl
											refreshing={refreshing}
											onRefresh={onRefresh}
											size={24}
										/>
									}
									onScrollEndDrag={onScrollEndDrag}
									contentContainerStyle={tw(
										'flex flex-row flex-wrap items-start'
									)}
								>
									{listings.map((listing) => (
										<Listing
											key={listing.id}
											listingData={listing}
											navigation={navigation}
											onPress={() => itemHandler(listing.id)}
										/>
									))}
								</ScrollView>
							) : (
								// fetch listing length is 0, display message saying empty
								<>
									<View
										testID="empty"
										style={tw(
											'flex flex-col flex-1 justify-center items-center'
										)}
									>
										<Text style={tw('text-s-md font-semibold p-4')}>
											{categoryFilter.length === 0
												? 'No item in listing right now'
												: 'No item in selected category'}
										</Text>
										<Buttons.Primary
											size="md"
											title="Sell Something"
											onPress={() => {
												const parentNavigation = navigation.getParent();
												if (parentNavigation) {
													parentNavigation.navigate('Sell');
												}
											}}
										/>
									</View>
								</>
							)}
						</>
					) : (
						// listing not fetched yet, render loading
						<>
							<View
								testID="loading"
								style={tw(
									'absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center -z-10'
								)}
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
			</Animated.View>
		</View>
	);
};

export default Listings;
