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
	createListingHandler: CreateListingFn,
	categorizing: boolean,
	listingData: ListingData | null | undefined,
	setListingData: React.Dispatch<
		React.SetStateAction<ListingData | null | undefined>
	>,
	listingErrors: ListingErrors,
	progress: number,
	setProgress: React.Dispatch<React.SetStateAction<number>>
) => void;

/**
 * render post button on screen header
 */
const renderPostButton: RenderPostButton = (
	navigation,
	createListingHandler,
	categorizing,
	listingData,
	setListingData,
	listingErrors,
	progress,
	setProgress
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
											setListingData({ ...listingData, status: 'posted' });
											createListingHandler(
												listingData,
												userInfo,
												listingErrors,
												progress,
												setProgress,
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
