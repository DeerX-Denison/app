import tw from '@tw';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ListingId } from 'types';

interface Props {
	showing: boolean;
	listingId: ListingId;
	editHandler: (listingId: ListingId) => void;
	toggleMenu: (listingId: ListingId) => void;
	showingSearch: boolean;
	setShowingSearch: React.Dispatch<React.SetStateAction<boolean>>;
	setSelectedListingId: React.Dispatch<
		React.SetStateAction<string | undefined>
	>;
}

const MyListingMenu: FC<Props> = ({
	showing,
	listingId,
	editHandler,
	toggleMenu,
	showingSearch,
	setShowingSearch,
	setSelectedListingId,
}) => {
	return (
		<>
			{showing && (
				<View style={tw('absolute top-1/2 mt-4 right-8 flex flex-col')}>
					<TouchableOpacity
						style={tw(
							'flex flex-1 border rounded-t-xl border-denison-red py-2 px-4 bg-pink'
						)}
						onPress={() => {
							toggleMenu(listingId);
							editHandler(listingId);
						}}
					>
						<Text style={tw('text-s-md font-semibold text-white text-center')}>
							Edit
						</Text>
					</TouchableOpacity>
					{/* reserve when more buttons nids to be added */}
					{/* <TouchableOpacity
						style={tw(
							'flex flex-1 border-r border-l border-denison-red py-2 px-4 bg-pink'
						)}
					>
						<Text style={tw('text-s-md font-semibold text-white')}>
							Mark As Sold
						</Text>
					</TouchableOpacity> */}
					<TouchableOpacity
						style={tw(
							'flex flex-1 border-b border-l border-r rounded-b-xl border-denison-red py-2 px-4 bg-pink'
						)}
						onPress={() => {
							toggleMenu(listingId);
							setShowingSearch(true);
							setSelectedListingId(listingId);
						}}
					>
						<Text style={tw('text-s-md font-semibold text-white text-center')}>
							Mark As Sold
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</>
	);
};

export default MyListingMenu;
