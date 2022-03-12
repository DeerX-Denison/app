import * as Badges from '@Components/Badges';
import * as Buttons from '@Components/Buttons';
import Carousel from '@Components/Carousel';
import * as Inputs from '@Components/Inputs';
import {
	CONDITIONS,
	CREATE_EDIT_SCROLLVIEW_EXTRA_HEIGHT_IP12,
} from '@Constants';
import { UserContext } from '@Contexts';
import { useListingError, useNewListingData, useScaleAnimation } from '@Hooks';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useState } from 'react';
import {
	Animated,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Item } from 'react-native-picker-select';
import { Bar, CircleSnail } from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListingCondition, ListingData, SellStackParamList } from 'types';
import addImage from '../addImage';
import Category from '../Category';
import removeCategory from '../removeCategory';
import useUploadProgress from '../useUploadProgress';
import createListing from './createListing';
import renderBackButton from './renderBackButton';
import renderPostButton from './renderPostButton';

export interface Props {
	route: RouteProp<SellStackParamList, 'Create'>;
	navigation: NativeStackNavigationProp<SellStackParamList, 'Create'>;
}

const conditions: Item[] = CONDITIONS.map((x) => ({
	label: x.toLowerCase(),
	value: x.toUpperCase(),
}));

/**`
 * Create components, when user want to create an item
 */
const Create: FC<Props> = ({ navigation }) => {
	const { userInfo } = useContext(UserContext);
	const [categorizing, setCategorizing] = useState<boolean>(false);
	renderBackButton(navigation, categorizing, setCategorizing);
	const { listingData, setListingData } = useNewListingData();
	const { progress, setSubProgressArray, subProgressArray } =
		useUploadProgress();

	const listingErrors = useListingError(listingData);
	const { scale } = useScaleAnimation(categorizing);
	const {
		imageError,
		nameError,
		priceError,
		categoryError,
		conditionError,
		descError,
		setHasEditName,
		setHasEditPrice,
		setHasEditCondition,
		setHasEditDesc,
	} = listingErrors;

	renderPostButton(
		navigation,
		createListing,
		categorizing,
		listingData,
		setListingData,
		listingErrors,
		subProgressArray,
		setSubProgressArray
	);

	return (
		<View style={tw('flex flex-1')}>
			<Category
				listingData={listingData}
				listingErrors={listingErrors}
				setListingData={setListingData}
				categorizing={categorizing}
				setCategorizing={setCategorizing}
			/>
			<Animated.View style={{ ...tw('flex flex-1'), transform: [{ scale }] }}>
				{listingData ? (
					// if listing data defined, ask if user is uploading
					<>
						<KeyboardAwareScrollView
							contentContainerStyle={tw('flex flex-col flex-1')}
							viewIsInsideTabBar={true}
							keyboardShouldPersistTaps={'handled'}
							extraScrollHeight={CREATE_EDIT_SCROLLVIEW_EXTRA_HEIGHT_IP12}
						>
							{progress === 0 ? (
								// if user not uploading, render form
								<>
									{listingData.images.length > 0 ? (
										// if images.length > 0, render carousel
										<>
											<Carousel
												listingData={listingData}
												setListingData={setListingData}
												editMode={true}
												listingErrors={listingErrors}
											/>
										</>
									) : (
										// else render add button and error if there is error
										<>
											<View
												style={tw(
													'h-20 mx-4 my-2 border rounded-lg flex flex-col justify-center items-center'
												)}
											>
												<TouchableOpacity
													onPress={() =>
														addImage(listingErrors, listingData, setListingData)
													}
													style={tw(
														'flex flex-col flex-1 w-full justify-center items-center'
													)}
												>
													<Text style={tw('text-s-xl font-semibold')}>
														Add Photos
													</Text>
													{imageError !== '' && (
														<Text style={tw('text-red-400 text-s-md p-2')}>
															{imageError}
														</Text>
													)}
												</TouchableOpacity>
											</View>
										</>
									)}

									<View style={tw('mx-4 my-2')}>
										<Inputs.Text
											placeholder="Item Name"
											placeholderTextColor={'rgba(156, 163, 175, 1.0)'}
											style={tw('text-s-xl font-bold border rounded-lg p-2')}
											value={listingData.name ? listingData.name : undefined}
											onChangeText={(name) => {
												setListingData({
													...listingData,
													name,
												} as ListingData);
												setHasEditName(true);
											}}
										/>
										{nameError !== '' && (
											<Text style={tw('text-red-400 text-s-md p-2')}>
												{nameError}
											</Text>
										)}
									</View>

									<View style={tw('mx-4 my-2')}>
										<Inputs.Text
											placeholder="Item Price"
											placeholderTextColor={'rgba(156, 163, 175, 1.0)'}
											style={tw(
												'text-s-xl font-semibold border rounded-lg p-2'
											)}
											value={listingData.price ? listingData.price : ''}
											onChangeText={(price) => {
												setListingData({
													...listingData,
													price,
												} as ListingData);
												setHasEditPrice(true);
											}}
											keyboardType="decimal-pad"
										/>
										{priceError !== '' && (
											<Text style={tw('text-red-400 text-s-md p-2')}>
												{priceError}
											</Text>
										)}
									</View>

									<View style={tw('mx-4 my-2')}>
										<ScrollView>
											<View
												style={tw(
													'flex flex-row flex-wrap flex-1 border rounded-lg p-2'
												)}
											>
												{listingData.category.map((category) => (
													<View key={category}>
														<Badges.Light>
															<TouchableOpacity
																onPress={() =>
																	removeCategory(
																		category,
																		listingErrors,
																		listingData,
																		setListingData
																	)
																}
															>
																<Icon
																	name="times"
																	size={16}
																	style={tw('m-1')}
																/>
															</TouchableOpacity>
															<Text style={tw('capitalize text-s-md pr-2')}>
																{category}
															</Text>
														</Badges.Light>
													</View>
												))}
												<TouchableOpacity onPress={() => setCategorizing(true)}>
													<Badges.Light>
														<Icon name="plus" size={16} style={tw('m-1')} />
														<Text style={tw('capitalize text-s-md pr-2')}>
															Category
														</Text>
													</Badges.Light>
												</TouchableOpacity>
												{categoryError !== '' && (
													<Text style={tw('text-red-400 text-s-md p-2')}>
														{categoryError}
													</Text>
												)}
											</View>
										</ScrollView>
									</View>

									<View style={tw('mx-4 my-2')}>
										<View style={tw('flex flex-row justify-center h-14')}>
											<Inputs.Select
												style={{
													viewContainer: tw(
														'border flex flex-1 flex-row items-center px-2 rounded-lg'
													),
													iconContainer: tw('h-full flex justify-center'),
													inputIOSContainer: tw('flex flex-1 flex-row'),
													inputIOS: tw('text-s-xl font-semibold w-full'),
												}}
												items={conditions}
												value={
													listingData.condition
														? listingData.condition
														: undefined
												}
												onValueChange={(condition: ListingCondition) => {
													setListingData({
														...listingData,
														condition,
													} as ListingData);
													setHasEditCondition(true);
												}}
												Icon={() => <Icon name="chevron-down" size={16} />}
												placeholder={
													{
														label: 'Item Condition...',
														value: undefined,
													} as Item
												}
											/>
										</View>
										{conditionError !== '' && (
											<Text style={tw('text-red-400 text-s-md p-2')}>
												{conditionError}
											</Text>
										)}
									</View>

									<View style={tw('mx-4 my-2')}>
										<Inputs.Text
											placeholder="Item Description"
											placeholderTextColor={'rgba(156, 163, 175, 1.0)'}
											style={tw(
												'text-s-lg font-semibold border rounded-lg p-2'
											)}
											value={
												listingData.description ? listingData.description : ''
											}
											onChangeText={(description) => {
												setListingData({
													...listingData,
													description,
												} as ListingData);
												setHasEditDesc(true);
											}}
											multiline={true}
										/>
										{descError !== '' && (
											<Text style={tw('text-red-400 text-s-md p-2')}>
												{descError}
											</Text>
										)}
									</View>

									<View
										style={tw(
											'my-2 w-full flex flex-row justify-center items-center'
										)}
									>
										<Buttons.Primary
											size="md"
											title="Save as draft"
											onPress={() => {
												setListingData({ ...listingData, status: 'saved' });
												createListing(
													listingData,
													userInfo,
													listingErrors,
													subProgressArray,
													setSubProgressArray,
													navigation
												);
											}}
										/>
									</View>
								</>
							) : (
								// else, user is uploading, render progress bar
								<>
									<View
										testID="posting"
										style={{
											...tw('flex flex-col flex-1 justify-center items-center'),
										}}
									>
										<Bar width={200} progress={progress} />
										<Text style={tw('text-s-md font-semibold p-4')}>
											{progress < 1
												? 'Uploading your beautiful images...'
												: 'Putting your item on sale...'}
										</Text>
									</View>
								</>
							)}
						</KeyboardAwareScrollView>
					</>
				) : (
					// else, data is not defined, render progress bar
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
			</Animated.View>
		</View>
	);
};

export default Create;
