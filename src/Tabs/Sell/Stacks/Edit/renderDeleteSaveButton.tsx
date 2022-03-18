import { UserContext } from '@Contexts';
import tw from '@tw';
import React, { useContext, useEffect, useState } from 'react';
import { Button, View } from 'react-native';
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
	listingErrors: ListingErrors,
	subProgressArray: number[],
	setSubProgressArray: React.Dispatch<React.SetStateAction<number[]>>,
	setUpdating: React.Dispatch<React.SetStateAction<boolean>>,
	setDeleting: React.Dispatch<React.SetStateAction<boolean>>
) => void;

/**
 * render post button on screen header
 */
const renderDeleteSaveButton: RenderDeleteSaveButton = (
	navigation,
	saveListing,
	categorizing,
	listingData,
	listingErrors,
	subProgressArray,
	setSubProgressArray,
	setUpdating,
	setDeleting
) => {
	const { userInfo } = useContext(UserContext);
	const [disabledSaved, setDisabledSave] = useState<boolean>(false);
	const [disabledDelete, setDisabledDelete] = useState<boolean>(false);
	useEffect(() => {
		let isSubscribed = true;
		if (userInfo && listingData) {
			navigation.setOptions({
				headerRight: () =>
					categorizing ? (
						<></>
					) : (
						<>
							<View style={tw('flex flex-row')}>
								<Button
									disabled={disabledDelete}
									title="delete"
									onPress={async () => {
										isSubscribed && setDisabledDelete(true);
										isSubscribed && setDisabledSave(true);
										isSubscribed && setDeleting(true);
										await deleteListing(listingData.id, navigation);
										isSubscribed && setDeleting(false);
										isSubscribed && setDisabledDelete(false);
										isSubscribed && setDisabledSave(false);
									}}
								/>
								<Button
									disabled={disabledSaved}
									title="save"
									onPress={async () => {
										isSubscribed && setDisabledDelete(true);
										isSubscribed && setDisabledSave(true);
										isSubscribed && setUpdating(true);
										await saveListing(
											listingData,
											userInfo,
											listingErrors,
											subProgressArray,
											setSubProgressArray,
											navigation
										);
										isSubscribed && setUpdating(false);
										isSubscribed && setDisabledDelete(false);
										isSubscribed && setDisabledSave(false);
									}}
								/>
							</View>
						</>
					),
			});
		}
		return () => {
			isSubscribed = false;
		};
	}, [userInfo, listingData, listingErrors]);
};
export default renderDeleteSaveButton;
