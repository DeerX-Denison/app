import tw from '@tw';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { CircleSnail } from 'react-native-progress';
import { Ref, TextSelection } from 'src/Hooks/useMessage/useInputText';
import { WishlistDataCL } from 'types';
interface Props {
	query: string | null;
	wishlist: WishlistDataCL[] | null | undefined;
	inputText: string | undefined;
	textSelection: TextSelection | undefined;
	setTextSelection: React.Dispatch<
		React.SetStateAction<TextSelection | undefined>
	>;
	refs: Ref[];
	setRefs: React.Dispatch<React.SetStateAction<Ref[]>>;
	setInputText: React.Dispatch<React.SetStateAction<string>>;
}

const ItemSuggestion: FC<Props> = ({
	query,
	wishlist,
	inputText,
	textSelection,
	setTextSelection,
	refs,
	setRefs,
	setInputText,
}) => {
	// useEffect(() => {
	// 	console.log('query', query);
	// 	console.log('inputText', inputText);
	// }, [query, inputText]);
	return (
		<View style={tw('flex flex-col border-t border-b')}>
			{wishlist && wishlist.length > 0 && (
				<>
					<ScrollView>
						{wishlist.map((wishlistData, index) => (
							<TouchableOpacity
								key={wishlistData.id}
								style={tw(
									`flex flex-row px-4 py-1 items-center ${
										index === wishlist.length - 1 ? '' : 'border-b'
									}`
								)}
								onPress={() => {
									let closestRef = 0;
									for (let i: number = textSelection?.start; i >= 0; i--) {
										if (inputText?.charAt(i) === '@') {
											closestRef = i;
											break;
										}
									}
									const start: number = closestRef;
									const end: number = start + wishlistData.name.length;
									const newRef: Ref = {
										end: end,
										begin: start,
										data: wishlistData,
									};
									setInputText(
										inputText?.slice(0, closestRef + 1) +
											wishlistData.name +
											' ' +
											inputText?.slice(textSelection?.start, inputText.length)
									);
									for (let i = 0; i < refs.length; i++) {
										if (closestRef <= refs[i].begin) {
											refs[i].begin += wishlistData.name.length + 1;
											refs[i].end += wishlistData.name.length + 1;
										}
									}
									refs.push(newRef);
									refs.sort((a, b) => a.begin - b.begin);
									console.log(refs);
									setRefs(refs);
								}}
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
							{query && query.length === 0
								? 'No item in wishlist'
								: 'No item found'}
						</Text>
						<Text style={tw('text-s-md font-normal pt-1')}>
							Add item to wishlist to mention them here
						</Text>
					</View>
				</>
			)}
			{!wishlist && (
				<View style={tw('h-16 justify-center items-center')} testID="loading">
					<CircleSnail
						size={40}
						indeterminate={true}
						color={['red', 'green', 'blue']}
					/>
				</View>
			)}
		</View>
	);
};

export default ItemSuggestion;
