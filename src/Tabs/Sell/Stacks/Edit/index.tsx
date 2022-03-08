import * as Buttons from '@Components/Buttons';
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
import {
	launchImageLibraryAsync,
	MediaTypeOptions,
	requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import React, { FC, useContext, useEffect, useState } from 'react';
import {
	Alert,
	Button,
	Linking,
	Platform,
	Switch,
	Text,
	View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Item } from 'react-native-picker-select';
import { Bar, CircleSnail } from 'react-native-progress';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
	ListingCategory,
	ListingCondition,
	ListingData,
	SellStackParamList,
} from 'types';
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
	const listingId = route.params.listingId;
	const { listingData, setListingData } = useListingData(listingId);
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

	/**
	 * handle user add image from local device
	 *
	 * if platform is not web:
	 * 		check media library permission status:
	 * 			if not granted, alert user to allow permission
	 * launch library image and get local photo uri
	 * set that local photo uri to listingData state
	 */
	const addHandler = async () => {
		setHasEditImage(true);
		if (Platform.OS !== 'web') {
			const { status } = await requestMediaLibraryPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert(
					'Permission Required',
					'DeerX needs access to your photo to upload your selected images',
					[
						{
							text: 'Okay',
							style: 'cancel',
						},
						{
							text: 'Enable',
							onPress: () =>
								Linking.openURL('app-settings://notification/DeerX'),
							style: 'default',
						},
					]
				);
				return;
			}
		}
		const result = await launchImageLibraryAsync({
			mediaTypes: MediaTypeOptions.All,
			// allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.cancelled && listingData) {
			setListingData({
				...listingData,
				images: [...listingData.images, result.uri],
			});
		}
	};

	return (
		<>
			{listingData ? (
				// Listing data is fetched, render form with the data as placeholder
				<>
					<KeyboardAwareScrollView
						viewIsInsideTabBar={true}
						keyboardShouldPersistTaps={'handled'}
						extraScrollHeight={CREATE_EDIT_SCROLLVIEW_EXTRA_HEIGHT_IP12}
					>
						<View style={tw('flex flex-row justify-between items-center')}>
							<Buttons.White title="cancel" onPress={cancelHandler} size="md" />
							<Buttons.White title="delete" onPress={deleteHandler} size="md" />
							<Buttons.Primary title="save" onPress={saveHandler} size="md" />
						</View>
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
										<View style={tw('flex flex-col')}>
											{imageError !== '' && (
												<Text style={tw('text-red-400 text-s-md p-2')}>
													{imageError}
												</Text>
											)}
											<Buttons.Primary
												title="Add Image"
												onPress={addHandler}
												size="md"
											/>
										</View>
									</>
								)}

								<View style={tw('w-full')}>
									<View style={tw('mx-4 my-2')}>
										<Inputs.Text
											placeholder="Item Name"
											style={tw('text-s-2xl font-bold border rounded-lg p-2')}
											value={listingData?.name ? listingData.name : undefined}
											onChangeText={(name) => {
												setListingData({ ...listingData, name } as ListingData);
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
											style={tw(
												'text-s-xl font-semibold border rounded-lg p-2'
											)}
											value={listingData ? listingData.price : ''}
											onChangeText={(price) => {
												setListingData({
													...listingData,
													price,
												} as ListingData);
												setHasEditPrice(true);
											}}
										/>
										{priceError !== '' && (
											<Text style={tw('text-red-400 text-s-md p-2')}>
												{priceError}
											</Text>
										)}
									</View>

									<View style={tw('mx-4 my-2')}>
										<View style={tw('flex flex-row')}>
											<Text style={tw('text-base font-medium')}>Category:</Text>
											<Inputs.Select
												style={{
													viewContainer: tw(
														'border flex justify-center items-center px-2 mx-1 rounded-lg'
													),
													iconContainer: tw(
														'h-full flex justify-center items-center'
													),
													inputIOS: tw('text-s-md font-medium pr-4'),
												}}
												items={categories}
												value={listingData?.category}
												onValueChange={(category: ListingCategory) => {
													setListingData({
														...listingData,
														category,
													} as ListingData);
													setHasEditCategory(true);
												}}
												Icon={() => <Icon name="chevron-down" />}
											/>
										</View>
										{categoryError !== '' && (
											<Text style={tw('text-red-400 text-s-md p-2')}>
												{categoryError}
											</Text>
										)}
									</View>

									<View style={tw('mx-4 my-2')}>
										<View style={tw('flex flex-row')}>
											<Text style={tw('text-base font-medium')}>
												Condition:
											</Text>
											<Inputs.Select
												style={{
													viewContainer: tw(
														'border flex justify-center items-center px-2 mx-1 rounded-lg'
													),
													iconContainer: tw(
														'h-full flex justify-center items-center'
													),
													inputIOS: tw('text-s-md font-medium pr-4'),
												}}
												items={conditions}
												value={listingData?.condition}
												onValueChange={(condition: ListingCondition) => {
													setListingData({
														...listingData,
														condition,
													} as ListingData);
													setHasEditCondition(true);
												}}
												Icon={() => <Icon name="chevron-down" />}
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
											style={tw('text-base font-normal border rounded-lg p-2')}
											value={listingData ? listingData.description : ''}
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
						style={tw('flex flex-1 justify-center items-center')}
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
	);
};

export default Edit;
