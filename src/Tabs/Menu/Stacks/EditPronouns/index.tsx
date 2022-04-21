import * as Badges from '@Components/Badges';
import { PRONOUNS } from '@Constants';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { MenuStackParamList, UserPronoun } from 'types';
import Plus from '../../../../static/plus.svg';
import XIcon from '../../../../static/x.svg';

interface Props {
	route: RouteProp<MenuStackParamList, 'EditPronouns'>;
	navigation: NativeStackNavigationProp<MenuStackParamList>;
}

const pronouns = PRONOUNS;
/**
 * category component when user wants to search for category
 */
const EditPronouns: FC<Props> = ({ route, navigation }) => {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<
		UserPronoun[] | undefined | null
	>();
	const [selectedPronouns, setSelecedPronouns] = useState<
		UserPronoun[] | null | undefined
	>(route.params.pronouns);

	const inputTextRef = useRef<TextInput | undefined>();

	useEffect(() => {
		inputTextRef.current?.focus();
	}, []);

	useEffect(() => {
		if (query.length > 0) {
			if (pronouns) {
				setSuggestions(
					pronouns
						.filter((x) => x.includes(query.toUpperCase()))
						.filter((x) => !selectedPronouns?.includes(x))
				);
			} else {
				setSuggestions([]);
			}
		} else {
			setSuggestions(null);
		}
	}, [query, selectedPronouns]);

	// render check button
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('EditProfile', {
							selectedPronouns,
							displayUserProfile: undefined,
						});
					}}
				>
					<FontAwesomeIcon
						icon={faCheck}
						size={24}
						style={tw('text-denison-red')}
					/>
				</TouchableOpacity>
			),
		});
	}, [selectedPronouns]);

	return (
		<View style={tw('flex flex-1 flex-col')}>
			<View style={tw('flex flex-row px-2 py-2 m-2 border rounded-lg')}>
				{selectedPronouns?.map((pronoun) => (
					<Badges.Light key={pronoun}>
						<TouchableOpacity
							onPress={() => {
								setSelecedPronouns(
									selectedPronouns.filter((x) => x !== pronoun)
								);
							}}
						>
							<XIcon style={tw('m-1')} height={16} width={16} />
						</TouchableOpacity>
						<Text
							style={tw('capitalize text-s-md font-semibold pr-2 text-white')}
						>
							{pronoun}
						</Text>
					</Badges.Light>
				))}

				<TextInput
					ref={inputTextRef as any}
					value={query}
					style={tw('flex-1 text-s-lg py-2 px-2')}
					placeholder={
						!selectedPronouns || selectedPronouns.length === 0
							? 'Add Pronouns'
							: ''
					}
					onChangeText={setQuery}
				/>
			</View>
			<ScrollView
				keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps="always"
				contentContainerStyle={tw('flex flex-col max-h-48')}
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
												onPress={() => {
													if (selectedPronouns && selectedPronouns.length > 0) {
														const newSelectedPronouns = [
															...new Set([...selectedPronouns, suggestion]),
														];
														setSelecedPronouns(newSelectedPronouns);
													} else {
														setSelecedPronouns([suggestion]);
													}
													setQuery('');
												}}
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
									<View style={tw('flex flex-col justify-center items-center')}>
										<Text style={tw('text-s-md font-semibold p-4')}>
											No match found
										</Text>
									</View>
								</>
							)}
						</>
					) : (
						// suggestions is being queried, render nothing
						<>
							<View style={tw('px-4')}>
								<Text style={tw('text-s-sm')}>
									Add up to 4 pronouns to your profile so people know how to
									refer to you. You can edit or remove them at any time
								</Text>
							</View>
						</>
					)}
				</>
			</ScrollView>
		</View>
	);
};

export default EditPronouns;
