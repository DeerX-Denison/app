import { UserContext } from '@Contexts';
import React, { useContext, useEffect } from 'react';
import { Button } from 'react-native';
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
		if (userInfo && listingData) {
			navigation.setOptions({
				headerRight: () =>
					categorizing ? (
						<></>
					) : (
						<>
							<Button
								title="post"
								onPress={() => {
									createListing(
										{ ...listingData, status: 'posted' } as ListingData,
										userInfo,
										listingErrors,
										subProgressArray,
										setSubProgressArray,
										navigation
									);
								}}
							/>
						</>
					),
			});
		}
	}, [listingData, userInfo, navigation, categorizing]);
};
export default renderPostButton;
