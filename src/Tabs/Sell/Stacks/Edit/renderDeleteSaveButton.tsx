import { UserContext } from '@Contexts';
import { faCloudArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import tw from '@tw';
import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
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
	setDeleting: React.Dispatch<React.SetStateAction<boolean>>,
	hasEditStatus: boolean
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
	setDeleting,
	hasEditStatus
) => {
	const { userInfo } = useContext(UserContext);
	const [disabledSaved, setDisabledSave] = useState<boolean>(false);
	const [disabledDelete, setDisabledDelete] = useState<boolean>(false);

	useEffect(() => {
		if (userInfo && listingData) {
			navigation.setOptions({
				headerRight: () =>
					categorizing ? (
						<></>
					) : (
						<>
							<View style={tw('flex flex-row')}>
								<TouchableOpacity
									disabled={disabledDelete}
									onPress={async () => {
										setDisabledDelete(true);
										setDisabledSave(true);
										setDeleting(true);
										await deleteListing(listingData, navigation);
										setDeleting(false);
										setDisabledDelete(false);
										setDisabledSave(false);
									}}
								>
									<FontAwesomeIcon
										icon={faTrash}
										size={24}
										style={tw('text-indigo-500 mr-8')}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									disabled={disabledSaved}
									onPress={async () => {
										setDisabledDelete(true);
										setDisabledSave(true);
										setUpdating(true);
										await saveListing(
											listingData,
											userInfo,
											listingErrors,
											subProgressArray,
											setSubProgressArray,
											hasEditStatus,
											navigation
										);
										setUpdating(false);
										setDisabledDelete(false);
										setDisabledSave(false);
									}}
								>
									<FontAwesomeIcon
										icon={faCloudArrowUp}
										size={24}
										style={tw('text-indigo-500')}
									/>
								</TouchableOpacity>
							</View>
						</>
					),
			});
		}
	}, [userInfo, listingData, listingErrors]);
};
export default renderDeleteSaveButton;
