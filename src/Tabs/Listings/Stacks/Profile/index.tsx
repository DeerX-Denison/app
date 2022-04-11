import * as Buttons from '@Components/Buttons';
import { UserContext } from '@Contexts';
import { useProfile } from '@Hooks';
import logger from '@logger';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import { ListingsStackParamList } from 'types';
interface Props {
	route: RouteProp<ListingsStackParamList, 'Profile'>;
	navigation: NativeStackNavigationProp<ListingsStackParamList, 'Profile'>;
}

const Profile: FC<Props> = ({ route, navigation }) => {
	const { userInfo } = useContext(UserContext);
	const { profile: displayUserProfile } = useProfile(route.params.uid);

	return (
		<View style={tw('flex flex-1')}>
			<View style={tw('flex flex-col border-b')}>
				<View
					style={tw(
						`flex flex-row h-28 mx-4 ${
							displayUserProfile?.bio ? 'border-b' : ''
						}`
					)}
				>
					<FastImage
						source={{
							uri: displayUserProfile?.photoURL
								? displayUserProfile.photoURL
								: undefined,
						}}
						style={tw(
							'h-20 w-20 rounded-full my-4 mr-4 border border-gray-500'
						)}
					/>
					<View style={tw('flex flex-col flex-1 justify-evenly')}>
						<View style={tw('flex flex-row items-end')}>
							<Text style={tw('text-s-lg font-bold')}>
								{displayUserProfile?.displayName}
							</Text>
							<Text style={tw('text-s-md font-light pl-2')}>
								{displayUserProfile?.pronouns?.join('/').toLowerCase()}
							</Text>
						</View>
						<Text style={tw('text-s-md font-semibold')}>
							{displayUserProfile?.email}
						</Text>
					</View>
				</View>
				{displayUserProfile?.bio && (
					<Text style={tw('px-4 py-3')}>{displayUserProfile?.bio}</Text>
				)}
			</View>
			<View style={tw('m-4')}>
				<Buttons.Primary
					title="Message"
					onPress={() => {
						if (displayUserProfile && userInfo) {
							navigation.navigate('Messages', {
								members: [
									{
										displayName: displayUserProfile.displayName,
										email: displayUserProfile.email,
										photoURL: displayUserProfile.photoURL,
										uid: displayUserProfile.uid,
									},
									userInfo,
								],
							});
						} else {
							logger.error(
								`userInfo or otherUserInfo is null: ${displayUserProfile?.uid} | ${userInfo?.uid}`
							);
							Toast.show({
								type: 'error',
								text1: 'Unexpected Error Occured',
								text2: 'Please Try Again Other Times',
							});
						}
					}}
					size={'lg'}
				/>
			</View>
		</View>
	);
};

export default Profile;
