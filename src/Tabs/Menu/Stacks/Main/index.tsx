import * as Buttons from '@Components/Buttons';
import { UserContext } from '@Contexts';
import { auth } from '@firebase.config';
import logger from '@logger';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect } from 'react';
import { Linking, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { MenuStackParamList } from 'types';
interface Props {
	navigation: NativeStackNavigationProp<MenuStackParamList>;
}
/**
 * derenders button at header
 */
const derenderBackButton = (navigation: Props['navigation']) => {
	useEffect(() => {
		const parentNavigation = navigation.getParent();
		if (parentNavigation) {
			parentNavigation.setOptions({
				headerLeft: () => null,
			});
		} else {
			logger.error(`Parent navigation is undefined for Listings/Main`);
			Toast.show({
				type: 'error',
				text1: 'Unexpected error occured',
			});
		}
	});
};

const Main: FC<Props> = ({ navigation }) => {
	derenderBackButton(navigation);
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
