import { DEFAULT_USER_PHOTO_URL } from '@Constants';
import { UserContext } from '@Contexts';
import { fn } from '@firebase.config';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import logger from '@logger';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CircleSnail } from 'react-native-progress';
import Toast from 'react-native-toast-message';
import { MenuStackParamList, UserProfile } from 'types';
import addImage from './addImage';
import uploadImageAsync from './uploadImageAsync';

interface Props {
	route: RouteProp<MenuStackParamList, 'EditProfile'>;
	navigation: NativeStackNavigationProp<MenuStackParamList>;
}

/**
 * stack for user editting profiles
 */
const EditProfile: FC<Props> = ({ route, navigation }) => {
	// initial user profile from sv
	const { userProfile, user } = useContext(UserContext);

	// parse to final editted user profile to save to db
	const [edittedUserProfile, setEdittedUserProfile] = useState<
		UserProfile | null | undefined
	>(userProfile);

	const [progress, setProgress] = useState<number>(0);

	useEffect(() => {
		if (route.params.displayUserProfile) {
			setEdittedUserProfile(route.params.displayUserProfile);
		}
		if (route.params.selectedPronouns) {
			setEdittedUserProfile({
				...edittedUserProfile,
				pronouns: route.params.selectedPronouns,
			} as UserProfile);
		}
	}, [route]);

	// render check button
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={async () => {
						if (user && userProfile && edittedUserProfile) {
							// validation
							if (userProfile.displayName !== edittedUserProfile.displayName) {
								logger.error('User attempt to update displayName');
								Toast.show({
									type: 'error',
									text1: 'Unexpected Error Occured',
								});
							}
							if (userProfile.email !== edittedUserProfile.email) {
								logger.error('User attempt to update email');
								Toast.show({
									type: 'error',
									text1: 'Unexpected Error Occured',
								});
							}
							if (userProfile.uid !== edittedUserProfile.uid) {
								logger.error('User attempt to update uid');
								Toast.show({
									type: 'error',
									text1: 'Unexpected Error Occured',
								});
							}

							if (userProfile.photoURL !== edittedUserProfile.photoURL) {
								if (edittedUserProfile.photoURL) {
									// upload image
									try {
										const imageUrl = await uploadImageAsync(
											edittedUserProfile.photoURL,
											edittedUserProfile.uid,
											progress,
											setProgress
										);
										try {
											await fn.httpsCallable('updateUserProfile')({
												...edittedUserProfile,
												photoURL: imageUrl,
											});
											await user.updateProfile({ photoURL: imageUrl });
										} catch (error) {
											logger.error(error);
											Toast.show({
												type: 'error',
												text1: 'Error Updating Profile',
												text2: 'Please Try Again Later',
											});
										}
									} catch (error) {
										logger.error(error);
										Toast.show({
											type: 'error',
											text1: 'Error Uploading Images',
											text2: 'Please Try Again Later',
										});
									}
								} else {
									logger.error(
										'edittedUserProfile photoURL was falsy when user press save'
									);
									Toast.show({
										type: 'error',
										text1: 'Unexpected Error Occured',
									});
								}
							}
						} else {
							logger.error(
								'user or userProfile or edittedUserProfile was falsy when user press save'
							);
							Toast.show({
								type: 'error',
								text1: 'Unexpected Error Occured',
							});
						}

						navigation.navigate('MainMenu', {
							displayUserProfile: edittedUserProfile,
						});
					}}
				>
					<FontAwesomeIcon
						icon={faCheck}
						size={24}
						style={tw('text-indigo-500')}
					/>
				</TouchableOpacity>
			),
		});
	}, [edittedUserProfile, userProfile]);

	return (
		<View style={tw('flex flex-col flex-1')}>
			{edittedUserProfile ? (
				<View style={tw('flex-1')}>
					<View style={tw('h-36 justify-center items-center border-b')}>
						<FastImage
							source={{
								uri: edittedUserProfile.photoURL
									? edittedUserProfile.photoURL
									: DEFAULT_USER_PHOTO_URL,
							}}
							style={tw('h-20 w-20 rounded-full')}
						/>
						<TouchableOpacity
							onPress={() => {
								addImage(edittedUserProfile, setEdittedUserProfile);
							}}
						>
							<Text style={tw('text-s-md font-semibold pt-2 text-red-300')}>
								Upload Profile Photo
							</Text>
						</TouchableOpacity>
					</View>
					<View style={tw('flex-1 flex-col px-2')}>
						<View style={tw('flex flex-row py-2')}>
							<View style={tw('justify-center items-start w-28 pl-2')}>
								<Text style={tw('text-s-lg')}>Name</Text>
							</View>
							<View style={tw('border-b flex-1 pb-1 mr-4')}>
								<Text style={tw('text-s-lg text-gray-500')}>
									{userProfile?.displayName}
								</Text>
							</View>
						</View>
						<View style={tw('flex flex-row py-2')}>
							<View style={tw('justify-center items-start w-28 pl-2')}>
								<Text style={tw('text-s-lg')}>Big Red ID</Text>
							</View>
							<View style={tw('border-b flex-1 pb-1 mr-4')}>
								<Text style={tw('text-s-lg text-gray-500')}>
									{edittedUserProfile.email?.substring(
										0,
										edittedUserProfile.email.indexOf('@')
									)}
								</Text>
							</View>
						</View>
						<View style={tw('flex flex-row py-2')}>
							<View style={tw('justify-center items-start w-28 pl-2')}>
								<Text style={tw('text-s-lg')}>Pronouns</Text>
							</View>
							<View style={tw('border-b flex-1 pb-1 mr-4')}>
								<TouchableOpacity
									onPress={() =>
										navigation.navigate('EditPronouns', {
											pronouns: edittedUserProfile?.pronouns,
										})
									}
								>
									<Text style={tw('text-s-lg')}>
										{edittedUserProfile?.pronouns?.join('/').toLowerCase()}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View style={tw('flex flex-row py-2')}>
							<View style={tw('justify-center items-start w-28 pl-2')}>
								<Text style={tw('text-s-lg')}>Bio</Text>
							</View>
							<View style={tw('border-b flex-1 pb-1 mr-4')}>
								<TextInput
									style={tw('text-s-lg')}
									value={edittedUserProfile.bio ? edittedUserProfile.bio : ''}
									onChangeText={(bio) =>
										setEdittedUserProfile({
											...edittedUserProfile,
											bio,
										})
									}
								/>
							</View>
						</View>
					</View>
				</View>
			) : (
				<View style={tw('flex-1 justify-center items-center')}>
					<CircleSnail
						size={80}
						indeterminate={true}
						color={['red', 'green', 'blue']}
					/>
				</View>
			)}
		</View>
	);
};
export default EditProfile;
