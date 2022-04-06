import { UserContext } from '@Contexts';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import tw from '@tw';
import React, { useContext, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
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
							<TouchableOpacity
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
							>
								<FontAwesomeIcon
									icon={faCloudArrowUp}
									size={24}
									style={tw('text-indigo-500')}
								/>
							</TouchableOpacity>
						</>
					),
			});
		}
	}, [listingData, userInfo, navigation, categorizing]);
};
export default renderPostButton;
