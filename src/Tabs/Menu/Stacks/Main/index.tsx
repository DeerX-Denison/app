import * as Buttons from '@Components/Buttons';
import {
	DEFAULT_GUEST_DISPLAY_NAME,
	DEFAULT_GUEST_EMAIL,
	DENISON_RED_RGBA,
	GRAY_RGBA,
	PINK_RGBA,
} from '@Constants';
import { JustSignOut, UserContext } from '@Contexts';
import { auth, fn } from '@firebase.config';
import logger from '@logger';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Alert, Linking, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { MenuStackParamList, UserProfile } from 'types';
interface Props {
	route: RouteProp<MenuStackParamList, 'MainMenu'>;
	navigation: NativeStackNavigationProp<MenuStackParamList>;
}

const Main: FC<Props> = ({ route, navigation }) => {
	const { setJustSignOut } = useContext(JustSignOut);
	const { userProfile } = useContext(UserContext);
	const [displayUserProfile, setDisplayUserInfo] = useState<
		UserProfile | null | undefined
	>(userProfile);

	// when use upload image, set image on client side
	useEffect(() => {
		if (route.params.displayUserProfile) {
			setDisplayUserInfo(route.params.displayUserProfile);
		}
	}, [route.params]);

	// if user upload invalid image content, this effect will change it on the client side
	useEffect(() => {
		if (userProfile) {
			setDisplayUserInfo(userProfile);
		}
	}, [userProfile]);

	const editProfileHandler = () => {
		navigation.navigate('EditProfile', {
			selectedPronouns: null,
			displayUserProfile: displayUserProfile,
		});
	};

	const signOutHandler = async () => {
		if (userProfile) {
			const { displayName, email } = userProfile;
			if (
				displayName === DEFAULT_GUEST_DISPLAY_NAME &&
				email === DEFAULT_GUEST_EMAIL
			) {
				try {
					await fn.httpsCallable('deleteAnonymousUser')();
				} catch (error) {
					return logger.error(error);
				}
			}
		}
		try {
			await auth.signOut();
		} catch (error) {
			return logger.error(error);
		}
		setJustSignOut && setJustSignOut(true);
	};

	const confirmDeleteAccountHandler = async () => {
		try {
			await fn.httpsCallable('deleteUser')();
		} catch (error) {
			return logger.error(error);
		}
		try {
			await auth.signOut();
		} catch (error) {
			return logger.error(error);
		}
		setJustSignOut && setJustSignOut(true);
	};
	const deleteAccountHandler = async () => {
		if (userProfile) {
			Alert.alert(
				'Confirm Delete',
				'All account information will be lost\nThis action cannot be undone',
				[
					{ text: 'Cancel', style: 'cancel' },
					{
						text: 'Delete',
						style: 'destructive',
						onPress: confirmDeleteAccountHandler,
					},
				]
			);
		}
	};

	return (
		<View style={tw('flex flex-1')}>
			<View style={tw('flex flex-col')}>
				<View
					style={tw(
						`flex flex-row h-28 mx-4 ${
							displayUserProfile?.bio ? 'border-b' : ''
						}`
					)}
				>
					<View
						style={{
							shadowColor: DENISON_RED_RGBA,
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.25,
							shadowRadius: 4,
						}}
					>
						{displayUserProfile?.photoURL ? (
							<FastImage
								source={{
									uri: displayUserProfile.photoURL,
								}}
								style={tw('h-20 w-20 rounded-full my-4 mr-4')}
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
					</View>
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
				<View style={tw('h-0.5 bg-denison-red mx-4')} />
			</View>

			<ScrollView contentContainerStyle={tw('flex flex-col flex-1 p-4')}>
				<Buttons.Primary
					title="Edit Profile"
					onPress={editProfileHandler}
					size="md"
				/>
				<View style={tw('pt-4')} />
				<Buttons.White
					title="Feature Suggestion"
					onPress={() => Linking.openURL('https://forms.gle/Bv9Brp1bCZf1gC1N6')}
					size="md"
				/>
				<View style={tw('pt-4')} />
				<Buttons.Primary
					title="Bug Report"
					onPress={() => Linking.openURL('https://forms.gle/M6sYNPFrWAh5i58d9')}
					size="md"
				/>
				<View style={tw('pt-4')} />
				<Buttons.White title="Sign Out" onPress={signOutHandler} size="md" />
				<View style={tw('pt-4')} />
				<Buttons.Primary
					title="Delete Account"
					onPress={deleteAccountHandler}
					size="md"
				/>
			</ScrollView>
		</View>
	);
};
export default Main;
