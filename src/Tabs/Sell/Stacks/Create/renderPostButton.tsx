import { UserContext } from '@Contexts';
import logger from '@logger';
import React, { useContext, useEffect } from 'react';
import { Button } from 'react-native';
import Toast from 'react-native-toast-message';
import { ListingErrors } from 'src/Hooks/useListingError';
import { ListingData } from 'types';
import { Props } from '.';
import { CreateListingFn } from './createListing';

export type RenderPostButton = (
	navigation: Props['navigation'],
	createListing: CreateListingFn,
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
const renderPostButton: RenderPostButton = (
	navigation,
	createListing,
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
								<Button
									title="post"
									onPress={() => {
										if (listingData) {
											createListing(
												{ ...listingData, status: 'posted' } as ListingData,
												userInfo,
												listingErrors,
												subProgressArray,
												setSubProgressArray,
												navigation
											);
										} else {
											logger.error(
												'listing data is null when user click post button'
											);
											Toast.show({
												type: 'error',
												text1: 'Unexpected error occured',
											});
											navigation.goBack();
										}
									}}
								/>
							</>
						),
				});
			}
		}
	});
};
export default renderPostButton;
