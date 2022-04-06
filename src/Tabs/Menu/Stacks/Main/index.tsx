import * as Buttons from '@Components/Buttons';
import { UserContext } from '@Contexts';
import { auth } from '@firebase.config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext } from 'react';
import { Linking, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import { MenuStackParamList } from 'types';
interface Props {
	navigation: NativeStackNavigationProp<MenuStackParamList>;
}

const Main: FC<Props> = ({ navigation }) => {
	const { userInfo } = useContext(UserContext);
	return (
		<View style={tw('flex flex-1')}>
			<View style={tw('flex flex-row h-28 border-b px-4')}>
				<FastImage
					source={{ uri: userInfo?.photoURL ? userInfo.photoURL : undefined }}
					style={tw('h-20 w-20 rounded-full my-4 mr-4 border border-gray-500')}
				/>
				<View style={tw('flex flex-col flex-1 justify-evenly')}>
					<Text style={tw('text-s-lg font-bold')}>{userInfo?.displayName}</Text>
					<Text style={tw('text-s-md font-semibold')}>{userInfo?.email}</Text>
				</View>
			</View>

			<ScrollView contentContainerStyle={tw('flex flex-col flex-1 p-4')}>
				<Buttons.Primary
					title="Edit Profile"
					onPress={() =>
						navigation.navigate('EditProfile', { selectedPronouns: null })
					}
					size="md"
				/>
				<View style={tw('pt-4')} />
				<Buttons.Primary
					title="Bug report"
					onPress={() => Linking.openURL('https://forms.gle/M6sYNPFrWAh5i58d9')}
					size="md"
				/>
				<View style={tw('pt-4')} />
				<Buttons.White
					title="Sign Out"
					onPress={async () => {
						await auth.signOut();
					}}
					size="md"
				/>
			</ScrollView>
		</View>
	);
};
export default Main;
