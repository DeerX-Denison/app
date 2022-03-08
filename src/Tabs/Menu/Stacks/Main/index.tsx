import * as Buttons from '@Components/Buttons';
import { UserContext } from '@Contexts';
import { auth } from '@firebase.config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext } from 'react';
import { Linking, Text, View } from 'react-native';
import { MenuStackParamList } from 'types';

interface Props {
	navigation: NativeStackNavigationProp<MenuStackParamList>;
}

const Main: FC<Props> = () => {
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
