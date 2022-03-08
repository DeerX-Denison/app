import { RouteProp } from '@react-navigation/native';
import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { SellStackParamList, TabsParamList } from 'types';
import { Create, Edit, Main } from './Stacks';

interface Props {
	route: RouteProp<TabsParamList, 'Sell'>;
	navigation: NativeStackNavigationProp<TabsParamList, 'Sell'>;
}

/**
 * Sell components, part of the 5 tabs of the app
 */
const Sell: FC<Props> = () => {
	const Stack = createNativeStackNavigator<SellStackParamList>();

	return (
		<Stack.Navigator
			initialRouteName="MyListing"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="MyListing">
				{(props) => <Main {...props} />}
			</Stack.Screen>
			<Stack.Screen name="Create">
				{(props) => <Create {...props} />}
			</Stack.Screen>
			<Stack.Screen name="Edit">{(props) => <Edit {...props} />}</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Sell;
