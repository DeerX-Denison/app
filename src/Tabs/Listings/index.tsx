import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { ListingsStackParamList, TabsParamList } from 'types';
import { Item, Main } from './Stacks';
interface Props {
	navigation: NativeStackNavigationProp<TabsParamList>;
}

/**
 * Listing components, part of the 4 tabs of the app
 */
const Listings: FC<Props> = ({ navigation }) => {
	const Stack = createNativeStackNavigator<ListingsStackParamList>();
	return (
		<Stack.Navigator
			initialRouteName="Main"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Main">
				{(props) => <Main {...props} tabNavigation={navigation} />}
			</Stack.Screen>
			<Stack.Screen name="Item">
				{(props) => <Item {...props} tabNavigation={navigation} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Listings;
