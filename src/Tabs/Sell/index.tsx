import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { SellStackParamList, TabsParamList } from 'types';
import { Main } from './Stacks';

interface Props {
	navigation: NativeStackNavigationProp<TabsParamList>;
}

/**
 * Listing components, part of the 4 tabs of the app
 */
const Sell: FC<Props> = () => {
	const Stack = createNativeStackNavigator<SellStackParamList>();
	return (
		<Stack.Navigator
			initialRouteName="Main"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Main">{(props) => <Main {...props} />}</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Sell;
