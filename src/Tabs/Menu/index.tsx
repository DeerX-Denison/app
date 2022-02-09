import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { MenuStackParamList } from 'types';
import { Main, SignIn } from './Stacks';

interface Props {}
/**
 * Menu components, part of the 4 tabs of the app
 */
const Menu: FC<Props> = () => {
	const Stack = createNativeStackNavigator<MenuStackParamList>();

	return (
		<Stack.Navigator
			screenOptions={{ headerShown: false }}
			initialRouteName="Main"
		>
			<Stack.Screen name="Main">{(props) => <Main {...props} />}</Stack.Screen>
			<Stack.Screen name="SignIn">
				{(props) => <SignIn {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Menu;
