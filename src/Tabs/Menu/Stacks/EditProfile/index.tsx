import { DEFAULT_USER_PHOTO_URL } from '@Constants';
import { UserContext } from '@Contexts';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CircleSnail } from 'react-native-progress';
import { MenuStackParamList, UserProfile } from 'types';
interface Props {
	route: RouteProp<MenuStackParamList, 'EditProfile'>;
	navigation: NativeStackNavigationProp<MenuStackParamList>;
}

/**
 * stack for user editting profiles
 */
const EditProfile: FC<Props> = ({ route, navigation }) => {
	const { userProfile } = useContext(UserContext);
	const [edittedUserProfile, setEdittedUserProfile] = useState<
		UserProfile | null | undefined
	>(userProfile);

	useEffect(() => {
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
					onPress={() => {
						// TODO
						console.log('implement me');

						navigation.navigate('MainMenu');
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
	}, [edittedUserProfile]);
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
								// TODO
								console.log('implement me!');
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
								<TextInput
									style={tw('text-s-lg')}
									value={
										edittedUserProfile.displayName
											? edittedUserProfile.displayName
											: ''
									}
									onChangeText={(displayName) =>
										setEdittedUserProfile({
											...edittedUserProfile,
											displayName,
										})
									}
								/>
							</View>
						</View>
						<View style={tw('flex flex-row py-2')}>
							<View style={tw('justify-center items-start w-28 pl-2')}>
								<Text style={tw('text-s-lg')}>Big Red ID</Text>
							</View>
							<View style={tw('border-b flex-1 pb-1 mr-4')}>
								<TextInput
									style={tw('text-s-lg')}
									value={edittedUserProfile.email?.substring(
										0,
										edittedUserProfile.email.indexOf('@')
									)}
									onChangeText={(displayName) =>
										setEdittedUserProfile({
											...edittedUserProfile,
											displayName,
										})
									}
								/>
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
				<View style={tw('flex-1')}>
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
