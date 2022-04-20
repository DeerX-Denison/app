import * as Buttons from '@Components/Buttons';
import { DENISON_RED_RGBA } from '@Constants';
import { JustSignOut, UserContext } from '@Contexts';
import { auth } from '@firebase.config';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Linking, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
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
					<View
						style={{
							shadowColor: DENISON_RED_RGBA,
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.25,
							shadowRadius: 4,
						}}
					>
						<FastImage
							source={{
								uri: displayUserProfile?.photoURL
									? displayUserProfile.photoURL
									: undefined,
							}}
							style={tw('h-20 w-20 rounded-full my-4 mr-4')}
						/>
					</View>
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

			<ScrollView contentContainerStyle={tw('flex flex-col flex-1 p-4')}>
				<Buttons.Primary
					title="Edit Profile"
					onPress={() =>
						navigation.navigate('EditProfile', {
							selectedPronouns: null,
							displayUserProfile: displayUserProfile,
						})
					}
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
				<Buttons.White
					title="Sign Out"
					onPress={async () => {
						await auth.signOut();
						setJustSignOut && setJustSignOut(true);
					}}
					size="md"
				/>
			</ScrollView>
		</View>
	);
};
export default Main;
