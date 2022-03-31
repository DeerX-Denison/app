import tw from '@tw';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { WishlistDataCL } from 'types';

interface Props {
	wishlist: WishlistDataCL[] | null | undefined;
}

const ItemSuggestion: FC<Props> = ({ wishlist }) => {
	return (
		<View style={tw('flex flex-col border-t')}>
			{wishlist && wishlist.length > 0 && (
				<>
					<ScrollView>
						{wishlist.map((wishlistData) => (
							<TouchableOpacity
								key={wishlistData.id}
								style={tw('flex flex-row px-4 py-1 items-center')}
							>
								<FastImage
									source={{ uri: wishlistData.thumbnail }}
									style={tw('h-16 w-16')}
								/>
								<View style={tw('flex flex-col h-16 px-2 my-1 justify-evenly')}>
									<Text style={tw('text-s-lg font-semibold')}>
										{wishlistData.name}
									</Text>
									<Text style={tw('text-s-md font-normal')}>
										${wishlistData.price}
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
				</>
			)}
			{wishlist && wishlist.length === 0 && (
				<>
					<View style={tw('px-4 py-2')}>
						<Text style={tw('text-s-lg font-bold pb-1')}>
							No item in wishlist
						</Text>
						<Text style={tw('text-s-md font-normal pt-1')}>
							Add item to wishlist to mention them here
						</Text>
					</View>
				</>
			)}
			{!wishlist && <></>}
		</View>
	);
};

export default ItemSuggestion;
