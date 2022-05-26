import { fn } from '@firebase.config';
import logger from '@logger';
import tw from '@tw';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ListingData, ListingId } from 'types';
interface Props {
	showing: boolean;
	listingData: ListingData;
	editHandler: (listingId: ListingId) => void;
	toggleMenu: (listingId: ListingId) => void;
	showingSearch: boolean;
	setShowingSearch: React.Dispatch<React.SetStateAction<boolean>>;
	setSelectedListingData: React.Dispatch<
		React.SetStateAction<ListingData | null | undefined>
	>;
}

const MyListingMenu: FC<Props> = ({
	showing,
	listingData,
	editHandler,
	toggleMenu,
	setShowingSearch,
	setSelectedListingData,
}) => {
	const menuItems = [
		{
			text: 'Edit Item',
			onPress: () => {
				toggleMenu(listingData.id);
				editHandler(listingData.id);
			},
			showing: true,
		},
		{
			text: 'Mark As Sold',
			onPress: () => {
				toggleMenu(listingData.id);
				setShowingSearch(true);
				setSelectedListingData(listingData);
			},
			showing: listingData.status === 'posted',
		},
		{
			text: 'Mark As For Sale',
			onPress: async () => {
				toggleMenu(listingData.id);
				const newListingData: ListingData = {
					...listingData,
					status: 'posted',
				};
				try {
					await fn.httpsCallable('updateListing')(newListingData);
				} catch (error) {
					logger.error(error);
				}
			},
			showing: listingData.status !== 'posted',
		},
		{
			text: 'Hide Item',
			onPress: async () => {
				toggleMenu(listingData.id);
				const newListingData: ListingData = {
					...listingData,
					status: 'saved',
				};
				try {
					await fn.httpsCallable('updateListing')(newListingData);
				} catch (error) {
					logger.error(error);
				}
			},
			showing: listingData.status === 'posted',
		},
	].filter((x) => x.showing);

	return (
		<>
			{showing && (
				<View style={tw('absolute top-1/2 mt-4 right-8 flex flex-col')}>
					{menuItems.map((menuItem, index) => (
						<TouchableOpacity
							key={index}
							style={tw(
								`flex flex-1 ${
									index === 0
										? `border ${
												menuItems.length === 1 ? 'rounded-xl' : 'rounded-t-xl'
										  }`
										: index === menuItems.length - 1
										? 'border-b border-r border-l rounded-b-xl'
										: 'border-b border-r border-l'
								} border-denison-red py-2 px-4 bg-pink`
							)}
							onPress={menuItem.onPress}
						>
							<Text
								style={tw('text-s-md font-semibold text-white text-center')}
							>
								{menuItem.text}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			)}
		</>
	);
};

export default MyListingMenu;
