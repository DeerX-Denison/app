import * as Buttons from '@Components/Buttons';
import Carousel from '@Components/Carousel';
import * as Inputs from '@Components/Inputs';
import { CREATE_EDIT_SCROLLVIEW_EXTRA_HEIGHT_IP12 } from '@Constants';
import { UserContext } from '@Contexts';
import { fn } from '@firebase.config';
import { useListingError, useNewListingData } from '@Hooks';
import logger from '@logger';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import {
	launchImageLibraryAsync,
	MediaTypeOptions,
	requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import React, { FC, useContext, useState } from 'react';
import { Alert, Linking, Platform, Switch, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Item } from 'react-native-picker-select';
import { Bar, CircleSnail } from 'react-native-progress';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
	ListingCategory,
	ListingCondition,
	ListingData,
	ListingsStackParamList,
} from 'types';
import uploadImagesAsync from '../uploadImageAsync';
import validListingData from '../validListingData';

interface Props {
	route: RouteProp<ListingsStackParamList, 'Create'>;
	navigation: NativeStackNavigationProp<ListingsStackParamList>;
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

/**`
 * Create components, when user want to create an item
 */
const Create: FC<Props> = ({ navigation }) => {
	const user = useContext(UserContext);
	const { listingData, setListingData } = useNewListingData();
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

	/**
	 * handle user when click create
	 *
	 * if listingData === undefined or user not logged in:
	 * 		Show user error, indicating invalid input (listingData)
	 * if data is invalid:
	 * 		set has edit everything
	 * 		Show user error, indicating invalid input (listingData)
	 * upload user image to cloud storage
	 * upload listingData to database
	 */
	const createListingHandler = async () => {
		if (!listingData || !user) {
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
		// update images
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
			const newListingData = {
				...listingData,
				price: parseFloat(listingData.price).toString(),
				images,
			};
			await fn.httpsCallable('createListing')(newListingData);
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
				// if listing data defined, ask if user is uploading
				<>
					<KeyboardAwareScrollView
						viewIsInsideTabBar={true}
						keyboardShouldPersistTaps={'handled'}
						extraScrollHeight={CREATE_EDIT_SCROLLVIEW_EXTRA_HEIGHT_IP12}
					>
						<View style={tw('flex flex-row justify-between items-center')}>
							<Buttons.White title="cancel" onPress={cancelHandler} size="md" />
							<Buttons.Primary
								title="create"
								onPress={createListingHandler}
								size="md"
							/>
						</View>
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

								<View style={tw('mx-4 my-2')}>
									<Inputs.Text
										placeholder="Item Name"
										placeholderTextColor={'rgba(156, 163, 175, 1.0)'}
										style={tw('text-s-xl font-bold border rounded-lg p-2')}
										value={listingData.name ? listingData.name : undefined}
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
										placeholderTextColor={'rgba(156, 163, 175, 1.0)'}
										style={tw('text-s-xl font-semibold border rounded-lg p-2')}
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
											value={
												listingData.category ? listingData.category : undefined
											}
											onValueChange={(category: ListingCategory) => {
												setListingData({
													...listingData,
													category,
												} as ListingData);
												setHasEditCategory(true);
											}}
											Icon={() => <Icon name="chevron-down" />}
											placeholder={
												{
													label: 'Select a category...',
													value: undefined,
												} as Item
											}
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
										<Text style={tw('text-base font-medium')}>Condition:</Text>
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
											Icon={() => <Icon name="chevron-down" />}
											placeholder={
												{
													label: 'Select a condition...',
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
										style={tw('text-s-md font-normal border rounded-lg p-2')}
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
													listingData.status === 'posted' ? 'saved' : 'posted',
											})
										}
										value={listingData.status === 'posted' ? true : false}
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
		</>
	);
};

export default Create;
