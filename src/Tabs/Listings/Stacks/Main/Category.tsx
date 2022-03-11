import * as Badges from '@Components/Badges';
import { CATEGORIES } from '@Constants';
import tw from '@tw';
import React, { FC, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListingCategory } from 'types';
import addCategory from './addCategory';

interface Props {
	category: ListingCategory[];
	setCategory: React.Dispatch<React.SetStateAction<ListingCategory[]>>;
	setCategorizing: React.Dispatch<React.SetStateAction<boolean>>;
}

const categories = CATEGORIES;
/**
 * category component when user wants to search for category
 */
const Category: FC<Props> = ({ category, setCategory, setCategorizing }) => {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<
		ListingCategory[] | undefined | null
	>();
	const [translation, setTranslation] = useState(200);

	useEffect(() => {
		if (categories) {
			setSuggestions(categories.filter((x) => x.includes(query.toUpperCase())));
		} else {
			setSuggestions(null);
		}
	}, [query]);

	return (
		<View style={tw('flex flex-1')}>
			<View style={tw('w-full')}>
				<TextInput
					value={query}
					style={tw('py-3 px-6 border rounded-full m-2 text-s-lg')}
					placeholder="Search categories"
					onChangeText={setQuery}
				/>
			</View>
			<ScrollView
				keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps="always"
				contentContainerStyle={tw('flex flex-col flex-1')}
			>
				<>
					{suggestions ? (
						// suggestions has finished querying
						<>
							{suggestions.length > 0 ? (
								// suggestions is not empty
								<>
									<View style={tw('flex flex-row flex-wrap')}>
										{suggestions.map((suggestion) => (
											<TouchableOpacity
												key={suggestion}
												onPress={() =>
													addCategory(
														suggestion,
														category,
														setCategory,
														setCategorizing,
														setQuery
													)
												}
											>
												<Badges.Light>
													<Icon name="plus" size={16} style={tw('m-1')} />
													<Text style={tw('capitalize text-s-md pr-2')}>
														{suggestion}
													</Text>
												</Badges.Light>
											</TouchableOpacity>
										))}
									</View>
								</>
							) : (
								// suggestions is empty
								<>
									<View
										style={tw(
											'flex flex-col flex-1 justify-center items-center'
										)}
									>
										<Text style={tw('text-s-md font-semibold p-4')}>
											No category found
										</Text>
									</View>
								</>
							)}
						</>
					) : (
						// suggestions is being queried, render loading
						<>
							<View>
								<Text>Loading</Text>
							</View>
						</>
					)}
				</>
			</ScrollView>
		</View>
	);
};

export default Category;
