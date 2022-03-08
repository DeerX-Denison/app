import * as Buttons from '@Components/Buttons';
import { UserContext } from '@Contexts';
import { auth } from '@firebase.config';
import logger from '@logger';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect } from 'react';
import { Linking, Text, View } from 'react-native';
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
		<View style={tw('flex flex-1 justify-center items-center')}>
			<Text style={tw('text-s-md font-bold uppercase')}>Menu</Text>
			{userInfo && (
				<Text style={tw('pt-6 font-normal text-s-md')}>{userInfo.email}</Text>
			)}
			<View style={tw('pt-6')} />
			<Buttons.Primary
				title="Bug report"
				onPress={() => Linking.openURL('https://forms.gle/M6sYNPFrWAh5i58d9')}
				size="md"
			/>
			<View style={tw('pt-6')} />

			<Buttons.White
				title="Sign Out"
				onPress={async () => {
					await auth.signOut();
				}}
				size="md"
			/>
		</View>
	);
};
export default Main;
