import * as Buttons from '@Components/Buttons';
import { GRAY_RGBA, PINK_RGBA } from '@Constants';
import { UserContext } from '@Contexts';
import { useProfile } from '@Hooks';
import logger from '@logger';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
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
					{displayUserProfile?.photoURL ? (
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
					) : (
						<SkeletonPlaceholder
							speed={1000}
							backgroundColor={PINK_RGBA}
							highlightColor={GRAY_RGBA}
						>
							<SkeletonPlaceholder.Item
								width={80}
								height={80}
								marginVertical={16}
								marginRight={16}
								borderRadius={100}
							/>
						</SkeletonPlaceholder>
					)}
					<View style={tw('flex flex-col flex-1 justify-evenly')}>
						<View style={tw('flex flex-row items-end')}>
							{displayUserProfile?.displayName ? (
								<Text style={tw('text-s-lg font-bold')}>
									{displayUserProfile.displayName}
								</Text>
							) : (
								<SkeletonPlaceholder
									speed={1000}
									backgroundColor={PINK_RGBA}
									highlightColor={GRAY_RGBA}
								>
									<SkeletonPlaceholder.Item
										width={120}
										height={24}
										borderRadius={12}
									/>
								</SkeletonPlaceholder>
							)}
							{displayUserProfile ? (
								<Text style={tw('text-s-md font-light pl-2')}>
									{displayUserProfile.pronouns?.join('/').toLowerCase()}
								</Text>
							) : (
								<SkeletonPlaceholder
									backgroundColor={PINK_RGBA}
									highlightColor={GRAY_RGBA}
									speed={1000}
								>
									<SkeletonPlaceholder.Item
										width={60}
										height={24}
										marginLeft={8}
										borderRadius={12}
									/>
								</SkeletonPlaceholder>
							)}
						</View>
						{displayUserProfile?.email ? (
							<Text style={tw('text-s-md font-semibold')}>
								{displayUserProfile?.email}
							</Text>
						) : (
							<SkeletonPlaceholder
								backgroundColor={PINK_RGBA}
								highlightColor={GRAY_RGBA}
								speed={1000}
							>
								<SkeletonPlaceholder.Item
									width={240}
									height={24}
									borderRadius={12}
								/>
							</SkeletonPlaceholder>
						)}
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
