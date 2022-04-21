import * as Badges from '@Components/Badges';
import { CATEGORIES } from '@Constants';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useSlideAnimation } from '@Hooks';
import tw from '@tw';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
	Animated,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { ListingCategory } from 'types';
import Plus from '../../../../static/plus.svg';
import addCategory from './addCategory';
interface Props {
	category: ListingCategory[];
	setCategory: React.Dispatch<React.SetStateAction<ListingCategory[]>>;
	categorizing: boolean;
	setCategorizing: React.Dispatch<React.SetStateAction<boolean>>;
}

const categories = CATEGORIES;
/**
 * category component when user wants to search for category
 */
const Category: FC<Props> = ({
	category,
	setCategory,
	categorizing,
	setCategorizing,
}) => {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<
		ListingCategory[] | undefined | null
	>();
	const inputTextRef = useRef<TextInput | undefined>();

	const { translation } = useSlideAnimation(categorizing, inputTextRef);

	useEffect(() => {
		if (categories) {
			setSuggestions(categories.filter((x) => x.includes(query.toUpperCase())));
		} else {
			setSuggestions(null);
		}
	}, [query]);

	return (
		<Animated.View
			style={{
				...tw('bg-gray absolute z-10 w-full h-full'),
				transform: [{ translateY: translation }],
			}}
		>
			<View style={tw('w-full')}>
				<TextInput
					ref={inputTextRef as any}
					value={query}
					style={tw(
						'py-3 pl-12 pr-6 border border-denison-red rounded-full m-2 text-s-lg bg-white'
					)}
					placeholder="Search categories"
					onChangeText={setQuery}
				/>
				<TouchableOpacity
					style={tw('absolute left-0 h-full justify-center pl-6')}
					onPress={() => setCategorizing(false)}
				>
					<FontAwesomeIcon
						icon={faChevronLeft}
						size={18}
						style={tw('text-denison-red')}
					/>
				</TouchableOpacity>
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
													<Plus height={16} width={16} style={tw('m-1')} />
													<Text
														style={tw(
															'capitalize text-s-md pr-2 font-semibold text-white'
														)}
													>
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
		</Animated.View>
	);
};

export default Category;
