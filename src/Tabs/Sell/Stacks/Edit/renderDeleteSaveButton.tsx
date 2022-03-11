import { UserContext } from '@Contexts';
import logger from '@logger';
import tw from '@tw';
import React, { useContext, useEffect } from 'react';
import { Button, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { ListingErrors } from 'src/Hooks/useListingError';
import { ListingData } from 'types';
import { Props } from '.';
import deleteListing from './deleteListing';
import { SaveListingFn } from './saveListing';

export type RenderDeleteSaveButton = (
	navigation: Props['navigation'],
	saveListing: SaveListingFn,
	categorizing: boolean,
	listingData: ListingData | null | undefined,
	setListingData: React.Dispatch<
		React.SetStateAction<ListingData | null | undefined>
	>,
	listingErrors: ListingErrors,
	subProgressArray: number[],
	setSubProgressArray: React.Dispatch<React.SetStateAction<number[]>>
) => void;

/**
 * render post button on screen header
 */
const renderDeleteSaveButton: RenderDeleteSaveButton = (
	navigation,
	saveListing,
	categorizing,
	listingData,
	setListingData,
	listingErrors,
	subProgressArray,
	setSubProgressArray
) => {
	const { userInfo } = useContext(UserContext);
	useEffect(() => {
		if (userInfo) {
			const parentNavigation = navigation.getParent();
			if (parentNavigation) {
				parentNavigation.setOptions({
					headerRight: () =>
						categorizing ? (
							<></>
						) : (
							<>
								<View style={tw('flex flex-row')}>
									<Button
										title="delete"
										onPress={() => {
											if (listingData) {
												deleteListing(listingData.id, navigation);
											} else {
												logger.error(
													'listing data is null when user click delete button'
												);
												Toast.show({
													type: 'error',
													text1: 'Unexpected error occured',
												});
												navigation.goBack();
											}
										}}
									/>
									<Button
										title="save"
										onPress={() => {
											if (listingData) {
												saveListing(
													listingData,
													userInfo,
													listingErrors,
													subProgressArray,
													setSubProgressArray,
													navigation
												);
											} else {
												logger.error(
													'listing data is null when user click save button'
												);
												Toast.show({
													type: 'error',
													text1: 'Unexpected error occured',
												});
												navigation.goBack();
											}
										}}
									/>
								</View>
							</>
						),
				});
			}
		}
	});
};
export default renderDeleteSaveButton;
