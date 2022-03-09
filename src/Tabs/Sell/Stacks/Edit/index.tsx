import Carousel from '@Components/Carousel';
import * as Inputs from '@Components/Inputs';
import { CREATE_EDIT_SCROLLVIEW_EXTRA_HEIGHT_IP12 } from '@Constants';
import { UserContext } from '@Contexts';
import { db, fn } from '@firebase.config';
import { useListingData, useListingError } from '@Hooks';
import logger from '@logger';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect, useState } from 'react';
import {
	Button,
	ScrollView,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Item } from 'react-native-picker-select';
import { Bar, CircleSnail } from 'react-native-progress';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListingCondition, ListingData, SellStackParamList } from 'types';
import addImage from '../addImage';
import Category from '../Category';
import removeCategory from '../removeCategory';
import uploadImagesAsync from '../uploadImageAsync';
import validListingData from '../validListingData';

interface Props {
	route: RouteProp<SellStackParamList, 'Edit'>;
	navigation: NativeStackNavigationProp<SellStackParamList>;
}

const categories: Item[] = [
	{ label: 'Furniture', value: 'FURNITURE' },
	{ label: 'Fashion', value: 'FASHION' },
	{ label: 'Books', value: 'BOOKS' },
	{ label: 'Furniture', value: 'SEASONAL' },
	{ label: 'Dorm Goods', value: 'DORM GOODS' },
	{ label: 'Jewelries', value: 'JEWELRIES' },
	{ label: 'Electronic', value: 'ELECTRONIC' },
	{ label: 'Instrument', value: 'INSTRUMENT' },
];

const conditions: Item[] = [
	{ label: 'Brand New', value: 'BRAND NEW' },
	{ label: 'Like New', value: 'LIKE NEW' },
	{ label: 'Fairly Used', value: 'FAIRLY USED' },
	{ label: 'Useable', value: 'USEABLE' },
	{ label: 'Barely Functional', value: 'BARELY FUNCTIONAL' },
];
/**
 * renders button at header that goes back
 */
const renderBackButton = (navigation: Props['navigation']) => {
	useEffect(() => {
		const parentNavigation = navigation.getParent();
		if (parentNavigation) {
			parentNavigation.setOptions({
				headerLeft: () => (
					<Button title="back" onPress={() => navigation.goBack()} />
				),
			});
		}
	});
};
/**
 * Edit components, when user want to edit an item that has already been put on sale
 */
const Edit: FC<Props> = ({ route, navigation }) => {
	renderBackButton(navigation);
	const { userInfo } = useContext(UserContext);
	const [categorizing, setCategorizing] = useState(false);
	const listingId = route.params.listingId;
	const { listingData, setListingData } = useListingData(listingId);
	const listingErrors = useListingError(listingData);
	const [progress, setProgress] = useState<number>(0);
	const {
		imageError,
		nameError,
		priceError,
		categoryError,
		conditionError,
		descError,
		setHasEditImage,
		setHasEditName,
		setHasEditPrice,
		setHasEditCategory,
		setHasEditCondition,
		setHasEditDesc,
		setJustPosted,
	} = useListingError(listingData);

	const cancelHandler = () => {
		navigation.goBack();
	};
	const deleteHandler = async () => {
		try {
			await db.collection('listings').doc(listingId).delete();
		} catch (error: unknown) {
			if (error instanceof Error) {
				Toast.show({ type: 'error', text1: error.message });
			} else {
				logger.log(error);
				Toast.show({
					type: 'error',
					text1: 'An unexpected error occured. Please try again later',
				});
			}
		} finally {
			navigation.goBack();
		}
	};

	/**
	 * handle user when click save
	 *
	 * if listingData === undefined or user not logged in:
	 * 		Show user error, indicating invalid input (listingData)
	 * if data is invalid:
	 * 		set has edit everything
	 * 		Show user error, indicating invalid input (listingData)
	 * save current listingData
	 */
	const saveHandler = async () => {
		if (!listingData || !userInfo) {
			return Toast.show({
				type: 'error',
				text1: 'Invalid inputs, please check your input again',
			});
		}
		if (!validListingData(listingData)) {
			setHasEditImage(true);
			setHasEditName(true);
			setHasEditPrice(true);
			setHasEditCategory(true);
			setHasEditCondition(true);
			setHasEditDesc(true);
			setJustPosted(true);
			return Toast.show({
				type: 'error',
				text1: 'Invalid inputs, please check your input again',
			});
		}

		let images: string[];

		try {
			setProgress(0);
			images = await uploadImagesAsync(
				listingData.images,
				listingData.id,
				listingData.seller.uid,
				progress,
				setProgress
			);
		} catch (error) {
			logger.error(error);
			return navigation.goBack();
		}

		try {
			const updatedListing = {
				...listingData,
				price: parseFloat(listingData.price).toString(),
				images,
			};
			await fn.httpsCallable('updateListing')(updatedListing);
		} catch (error) {
			logger.log(error);
		} finally {
			navigation.goBack();
		}
	};

	return (
		<>
			{categorizing ? (
				<Category
					listingData={listingData}
					setListingData={setListingData}
					setCategorizing={setCategorizing}
				/>
			) : (
				<>
					{listingData ? (
						// Listing data is fetched, render form with the data as placeholder
						<>
							<KeyboardAwareScrollView
								viewIsInsideTabBar={true}
								keyboardShouldPersistTaps={'handled'}
								extraScrollHeight={CREATE_EDIT_SCROLLVIEW_EXTRA_HEIGHT_IP12}
							>
								{progress === 0 ? (
									// user not uploading, render form with prefilled inputs
									<>
										{listingData.images.length > 0 ? (
											// if images.length > 0, render carousel
											<>
												<Carousel
													listingData={listingData}
													setListingData={setListingData}
													editMode={true}
												/>
											</>
										) : (
											// else render add button and error if there is error
											<>
												<View
													style={tw(
														'h-20 mx-4 my-2 border rounded-lg flex flex-col flex-1 justify-center items-center'
													)}
												>
													<TouchableOpacity
														onPress={() =>
															addImage(
																listingErrors,
																listingData,
																setListingData
															)
														}
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
														<View
															key={category}
															style={tw(
																'flex-row border mx-2 my-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100'
															)}
														>
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
															<Text style={tw('capitalize')}>{category}</Text>
														</View>
													))}
													<TouchableOpacity
														onPress={() => setCategorizing(true)}
													>
														<View
															style={tw(
																'flex-row border mr-2 my-1 items-center py-0.5 px-1 rounded-full text-xs font-medium bg-yellow-100 flex justify-center items-center'
															)}
														>
															<Icon name="plus" size={16} style={tw('m-1')} />
															<Text style={tw('capitalize text-s-md pr-2')}>
																Category
															</Text>
														</View>
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
											<Text style={tw('text-s-md p-2')}>Private</Text>
											<Switch
												onValueChange={() =>
													setListingData({
														...listingData,
														status:
															listingData.status === 'posted'
																? 'saved'
																: 'posted',
													})
												}
												value={listingData?.status === 'posted'}
											/>
											<Text style={tw('text-s-md p-2')}>Public</Text>
										</View>
									</>
								) : (
									// else, user is uploading, render progress bar
									<>
										<View
											testID="posting"
											style={tw(
												'absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center z-10'
											)}
										>
											<Bar width={200} indeterminate={true} />
										</View>
									</>
								)}
							</KeyboardAwareScrollView>
						</>
					) : (
						// Listing data is not fetched, render loading
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
				</>
			)}
		</>
	);
};

export default Edit;
