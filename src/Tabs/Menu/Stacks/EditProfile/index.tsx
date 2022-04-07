import { DEFAULT_USER_PHOTO_URL } from '@Constants';
import { UserContext } from '@Contexts';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
	ScrollView,
	TextInput,
	TouchableOpacity,
} from 'react-native-gesture-handler';
import { Bar, CircleSnail } from 'react-native-progress';
import { MenuStackParamList, UserProfile } from 'types';
import addImage from './addImage';
import renderCheckButton from './renderCheckButton';

interface Props {
	route: RouteProp<MenuStackParamList, 'EditProfile'>;
	navigation: NativeStackNavigationProp<MenuStackParamList>;
}

/**
 * stack for user editting profiles
 */
const EditProfile: FC<Props> = ({ route, navigation }) => {
	// initial user profile from sv
	const { userProfile } = useContext(UserContext);

	// parse to final editted user profile to save to db
	const [edittedUserProfile, setEdittedUserProfile] = useState<
		UserProfile | null | undefined
	>(userProfile);

	const [progress, setProgress] = useState<number>(0);
	const [loadingMessage, setLoadingMessage] = useState<string>('Loading...');
	const [hasEditImage, setHasEditImage] = useState<boolean>(false);
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

	renderCheckButton(
		navigation,
		edittedUserProfile,
		hasEditImage,
		setLoadingMessage,
		progress,
		setProgress
	);
	return (
		<ScrollView
			scrollEnabled={false}
			contentContainerStyle={tw('flex flex-col flex-1')}
		>
			{progress === 0 && (
				<>
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
										addImage(
											edittedUserProfile,
											setEdittedUserProfile,
											setHasEditImage
										);
									}}
								>
									<Text style={tw('text-s-md font-semibold pt-3 text-red-500')}>
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
									<View
										style={tw(
											'justify-center items-start justify-start w-28 pl-2'
										)}
									>
										<Text style={tw('text-s-lg pt-1')}>Bio</Text>
									</View>
									<View style={tw('border-b flex-1 pb-1 mr-4')}>
										<TextInput
											style={tw('text-s-md')}
											value={
												edittedUserProfile.bio ? edittedUserProfile.bio : ''
											}
											onChangeText={(bio) =>
												setEdittedUserProfile({
													...edittedUserProfile,
													bio,
												})
											}
											maxLength={255}
											multiline={true}
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
				</>
			)}
			{progress !== 0 && (
				// else, user is saving/uploading images, render progress bar
				<>
					<View style={tw('flex flex-col flex-1 justify-center items-center')}>
						<Bar width={200} progress={progress} />
						<Text style={tw('text-s-md font-semibold p-4')}>
							{loadingMessage}
						</Text>
					</View>
				</>
			)}
		</ScrollView>
	);
};
export default EditProfile;
