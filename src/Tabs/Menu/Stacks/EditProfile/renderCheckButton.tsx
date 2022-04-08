import { UserContext } from '@Contexts';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import logger from '@logger';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { useContext, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { MenuStackParamList, UserProfile, UserPronoun } from 'types';
import hasEditBio from './hasEditBio';
import hasEditDisplayName from './hasEditDisplayName';
import hasEditEmail from './hasEditEmail';
import hasEditPronouns from './hasEditPronouns';
import hasEditUid from './hasEditUid';
import saveProfile from './saveProfile';
import uploadImageAsync from './uploadImageAsync';

export type RenderCheckButtonFn = (
	navigation: NativeStackNavigationProp<MenuStackParamList>,
	edittedUserProfile: UserProfile | null | undefined,
	hasEditImage: boolean,
	setLoadingMessage: React.Dispatch<React.SetStateAction<string>>,
	progress: number,
	setProgress: React.Dispatch<React.SetStateAction<number>>
) => void;

const renderCheckButton: RenderCheckButtonFn = (
	navigation,
	edittedUserProfile,
	hasEditImage,
	setLoadingMessage,
	progress,
	setProgress
) => {
	const { userProfile } = useContext(UserContext);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={async () => {
						if (!userProfile) throw 'userProfile was falsy';
						if (!edittedUserProfile) throw 'edittedUserProfile was falsy';
						if (hasEditUid(edittedUserProfile, userProfile))
							throw 'user editted uid';
						if (hasEditDisplayName(edittedUserProfile, userProfile))
							throw 'user editted displayName';
						if (hasEditEmail(edittedUserProfile, userProfile))
							throw 'user editted email';

						let imageUrl: string | undefined = undefined;
						if (hasEditImage) {
							if (edittedUserProfile.photoURL) {
								setLoadingMessage(
									'Uploading your wonderful profile picture...'
								);
								imageUrl = await uploadImageAsync(
									edittedUserProfile.photoURL,
									edittedUserProfile.uid,
									progress,
									setProgress
								);
							} else {
								logger.error('updated photoURL was falsy');
							}
						}

						let bio: string | undefined = undefined;
						if (hasEditBio(edittedUserProfile, userProfile)) {
							if (edittedUserProfile.bio) {
								bio = edittedUserProfile.bio;
							} else {
								logger.error('updated bio was falsy');
							}
						}

						let pronouns: UserPronoun[] | undefined = undefined;
						if (hasEditPronouns(edittedUserProfile, userProfile)) {
							if (edittedUserProfile.pronouns) {
								pronouns = edittedUserProfile.pronouns;
							} else {
								logger.error('updated pronouns was falsy');
							}
						}
						if (imageUrl || bio || pronouns) {
							setLoadingMessage('Saving Your Profile...');
							setProgress(0.1);
							const timeout = setTimeout(() => {
								setProgress(Math.random() * 0.2 + 0.5);
							}, 50);
							await saveProfile(imageUrl, bio, pronouns);
							clearTimeout(timeout);
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
	}, [edittedUserProfile, userProfile, hasEditImage]);
};

export default renderCheckButton;
