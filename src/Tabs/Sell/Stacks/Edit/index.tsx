import * as Badges from '@Components/Badges';
import Carousel from '@Components/Carousel';
import * as Inputs from '@Components/Inputs';
import {
	CONDITIONS,
	CREATE_EDIT_SCROLLVIEW_EXTRA_HEIGHT_IP12,
	DEFAULT_USER_DISPLAY_NAME,
	DEFAULT_USER_PHOTO_URL,
	PINK_RGBA,
	STATUSES,
} from '@Constants';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useListingData, useListingError, useScaleAnimation } from '@Hooks';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useEffect, useState } from 'react';
import {
	Animated,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Item } from 'react-native-picker-select';
import { Bar, CircleSnail } from 'react-native-progress';
import {
	ListingCondition,
	ListingData,
	ListingStatus,
	SellStackParamList,
} from 'types';
import EditIcon from '../../../../static/edit.svg';
import Magnify from '../../../../static/magnify.svg';
import Plus from '../../../../static/plus.svg';
import XIcon from '../../../../static/x.svg';
import addImage from '../addImage';
import Category from '../Category';
import useSoldToSearch from '../MyListings/useSoldToSearch';
import removeCategory from '../removeCategory';
import SoldToSearch from '../SoldToSearch';
import useUploadProgress from '../useUploadProgress';
import renderDeleteSaveButton from './renderDeleteSaveButton';
import saveListing from './saveListing';
import useShowingSoldToView from './useShowingSoldToView';

export interface Props {
	route: RouteProp<SellStackParamList, 'Edit'>;
	navigation: NativeStackNavigationProp<SellStackParamList, 'Edit'>;
}

const capitalize = (x: string) => {
	const xLower = x.toLowerCase();
	const arr = xLower.split(' ');

	for (let i = 0; i < arr.length; i++) {
		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
	}
	const xCapitalized = arr.join(' ');
	return xCapitalized;
};

const conditions: Item[] = CONDITIONS.map((x) => ({
	label: capitalize(x),
	value: x.toUpperCase(),
}));

const statuses: Item[] = STATUSES.map((x) => ({
	label: (() => {
		switch (x) {
			case 'posted':
				return 'Public';
			case 'saved':
				return 'Private';
			case 'sold':
				return 'Sold';
			default:
				return '';
		}
	})(),
	value: x.toLowerCase(),
}));

/**
 * Edit components, when user want to edit an item that has already been put on sale
 */
const Edit: FC<Props> = ({ route, navigation }) => {
	const [categorizing, setCategorizing] = useState(false);
	const listingId = route.params.listingId;
	const { listingData, setListingData } = useListingData(listingId);
	const listingErrors = useListingError(listingData);
	const { scale } = useScaleAnimation(categorizing);
	const { progress, setSubProgressArray, subProgressArray } =
		useUploadProgress();
	const [updating, setUpdating] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const { showingSearch, setShowingSearch, setSelectedSoldTo, selectedSoldTo } =
		useSoldToSearch();

	/**
	 * effect to run set state listing data when user has selected
	 * a user to sell the item to
	 **/
	useEffect(() => {
		if (listingData && selectedSoldTo) {
			setListingData({ ...listingData, soldTo: selectedSoldTo });
		}
	}, [selectedSoldTo]);

	const { showingSoldTo } = useShowingSoldToView(listingData);
	// temporary status to save when user scroll status selection but does not press done
	const [tmpListingStatus, setTmpListingStatus] = useState<
		ListingStatus | null | undefined
	>();
	useEffect(() => {
		if (listingData) {
			setTmpListingStatus(listingData.status);
		}
	}, [listingData]);

	const {
		hasEditImage,
		hasEditStatus,
		imageError,
		nameError,
		priceError,
		categoryError,
		conditionError,
		descError,
		statusError,
		setHasEditName,
		setHasEditPrice,
		setHasEditCondition,
		setHasEditDesc,
		setHasEditStatus,
	} = listingErrors;

	/**
	 * effect to run set selectedSoldTo state when user chooses
	 * another status other than "sold"
	 */
	useEffect(() => {
		if (listingData) {
			if (listingData.status === 'sold' && hasEditStatus) {
				setShowingSearch(true);
			} else {
				setSelectedSoldTo(undefined);
			}
		}
	}, [listingData?.status]);

	renderDeleteSaveButton(
		navigation,
		saveListing,
		categorizing,
		listingData,
		listingErrors,
		subProgressArray,
		setSubProgressArray,
		setUpdating,
		setDeleting
	);

	const selectedStatusHandler = () => {
		setListingData({
			...listingData,
			status: tmpListingStatus,
		} as ListingData);
		setHasEditStatus(true);
	};

	return (
		<View style={tw('flex flex-1')}>
			<Category
				listingData={listingData}
				listingErrors={listingErrors}
				setListingData={setListingData}
				categorizing={categorizing}
				setCategorizing={setCategorizing}
			/>
			<SoldToSearch
				showingSearch={showingSearch}
				setShowingSearch={setShowingSearch}
				setSelectedSoldTo={setSelectedSoldTo}
				setHasEditStatus={setHasEditStatus}
			/>
			<Animated.View style={{ ...tw('flex flex-1'), transform: [{ scale }] }}>
				{listingData ? (
					// Listing data is fetched, render form with the data as placeholder
					<>
						{updating && !deleting && !hasEditImage && progress === 0 && (
							// user just clicked save button, updating listingData in db
							<View
								testID="updating"
								style={tw('flex flex-col flex-1 justify-center items-center')}
							>
								<Bar width={200} indeterminate={true} color={PINK_RGBA} />
								<Text style={tw('text-s-md font-semibold p-4')}>
									Updating your items...
								</Text>
							</View>
						)}
						{!updating && deleting && progress === 0 && (
							// user clicked delete button, deleting listingData in db
							<View
								testID="deleting"
								style={tw('flex flex-col flex-1 justify-center items-center')}
							>
								<Bar width={200} indeterminate={true} color={PINK_RGBA} />
								<Text style={tw('text-s-md font-semibold p-4')}>
									Deleting your items...
								</Text>
							</View>
						)}
						{updating && !deleting && progress !== 0 && (
							// user is uploading images
							<View
								testID="uploading"
								style={tw('flex flex-col flex-1 justify-center items-center')}
							>
								<Bar width={200} progress={progress} color={PINK_RGBA} />
								<Text style={tw('text-s-md font-semibold p-4')}>
									{progress < 1
										? 'Uploading your beautiful images...'
										: 'Saving your items...'}
								</Text>
							</View>
						)}
						{!updating && !deleting && progress === 0 && (
							// user is editting, render form with prefilled data
							<KeyboardAwareScrollView
								contentContainerStyle={tw('flex flex-col')}
								viewIsInsideTabBar={true}
								keyboardShouldPersistTaps={'handled'}
								extraScrollHeight={CREATE_EDIT_SCROLLVIEW_EXTRA_HEIGHT_IP12}
								enableResetScrollToCoords={false}
								keyboardOpeningTime={0}
								showsVerticalScrollIndicator={false}
							>
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
										multiline={true}
										scrollEnabled={false}
										maxLength={50}
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
										maxLength={7}
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
															<XIcon style={tw('m-1')} height={16} width={16} />
														</TouchableOpacity>
														<Text
															style={tw(
																'capitalize text-s-md font-semibold pr-2 text-white'
															)}
														>
															{category}
														</Text>
													</Badges.Light>
												</View>
											))}
											<TouchableOpacity onPress={() => setCategorizing(true)}>
												{listingData.category.length > 0 && (
													<Badges.Light>
														<Plus height={16} width={16} style={tw('m-1')} />
														<Text
															style={tw(
																'capitalize text-s-md font-semibold pr-2 text-white'
															)}
														>
															Category
														</Text>
													</Badges.Light>
												)}
											</TouchableOpacity>
											<TouchableOpacity
												style={tw('flex-1')}
												onPress={() => setCategorizing(true)}
											>
												{listingData.category.length === 0 && (
													<View style={tw('flex-row items-center')}>
														<Magnify
															height={16}
															width={16}
															style={tw('mx-1')}
														/>
														<Text
															style={{
																...tw('text-s-xl font-semibold'),
																color: 'rgba(156, 163, 175, 1.0)',
															}}
														>
															Search category
														</Text>
													</View>
												)}
												{categoryError !== '' && (
													<Text style={tw('text-red-400 text-s-md pt-2')}>
														{categoryError}
													</Text>
												)}
											</TouchableOpacity>
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
											Icon={() => (
												<FontAwesomeIcon
													icon={faChevronDown}
													size={20}
													style={tw('text-denison-red')}
												/>
											)}
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
										style={tw('text-s-lg font-semibold border rounded-lg p-2')}
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
										scrollEnabled={false}
										maxLength={250}
									/>
									{descError !== '' && (
										<Text style={tw('text-red-400 text-s-md p-2')}>
											{descError}
										</Text>
									)}
								</View>
								<View style={tw('mx-4 my-2')}>
									<View style={tw('flex flex-row justify-center h-14')}>
										<Inputs.Select
											style={{
												viewContainer: tw(
													`border flex ${
														showingSoldTo ? '' : 'flex-1'
													} flex-row items-center px-2 rounded-lg ${
														showingSoldTo ? 'mr-2' : ''
													}`
												),
												iconContainer: tw('h-full flex justify-center'),
												inputIOSContainer: tw('flex flex-1 flex-row'),
												inputIOS: tw(
													`text-s-xl font-semibold ${
														showingSoldTo ? 'pr-7' : 'w-full'
													}`
												),
											}}
											items={statuses}
											value={tmpListingStatus}
											onValueChange={(status: ListingStatus) => {
												setTmpListingStatus(status);
											}}
											onDonePress={selectedStatusHandler}
											Icon={() => (
												<FontAwesomeIcon
													icon={faChevronDown}
													size={20}
													style={tw('text-denison-red')}
												/>
											)}
											placeholder={
												{
													label: 'Item Status...',
													value: undefined,
												} as Item
											}
										/>
										{showingSoldTo && (
											<View style={tw('flex justify-center px-2')}>
												<Text style={tw('text-s-lg font-semibold')}>to</Text>
											</View>
										)}
										{showingSoldTo && (
											<View
												style={tw('flex flex-1 ml-2 border rounded-lg px-2')}
											>
												{'soldTo' in listingData && listingData.soldTo ? (
													<View style={tw('flex flex-1 flex-row')}>
														<View
															style={tw(
																'flex justify-center items-center pr-2'
															)}
														>
															<FastImage
																source={{
																	uri: listingData.soldTo.photoURL
																		? listingData.soldTo.photoURL
																		: DEFAULT_USER_PHOTO_URL,
																}}
																style={tw(
																	'h-10 w-10 rounded-full border border-denison-red'
																)}
															/>
														</View>
														<View
															style={tw('flex flex-1 flex-row justify-between')}
														>
															<View
																style={tw(
																	'flex flex-1 justify-center items-start'
																)}
															>
																<Text
																	style={tw('text-s-md font-semibold')}
																	numberOfLines={1}
																	ellipsizeMode="tail"
																>
																	{listingData.soldTo.displayName
																		? listingData.soldTo.displayName
																		: DEFAULT_USER_DISPLAY_NAME}
																</Text>
															</View>
															<TouchableOpacity
																onPress={() => setShowingSearch(true)}
																style={tw('p-2')}
															>
																<EditIcon height={32} width={32} />
															</TouchableOpacity>
														</View>
													</View>
												) : (
													<View></View>
												)}
											</View>
										)}
									</View>
									{statusError !== '' && (
										<Text style={tw('text-red-400 text-s-md p-2')}>
											{statusError}
										</Text>
									)}
								</View>
							</KeyboardAwareScrollView>
						)}
					</>
				) : (
					// Listing data is not fetched, render loading
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
				)}
			</Animated.View>
		</View>
	);
};

export default Edit;
