import { RouteProp } from '@react-navigation/native';
import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Button } from 'react-native';
import { SellStackParamList, TabsParamList } from 'types';
import { Create, Edit, MyListings } from './Stacks';

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
			screenOptions={{ headerTitle: 'My Listings' }}
		>
			<Stack.Screen
				name="MyListing"
				options={({ navigation }) => ({
					headerRight: () => (
						<Button
							title="create"
							onPress={() => navigation.navigate('Create')}
						/>
					),
				})}
			>
				{(props) => <MyListings {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Create"
				options={{
					headerRight: () => (
						<Button
							title="post"
							onPress={() => {
								// do nothing
							}}
						/>
					),
				}}
			>
				{(props) => <Create {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Edit"
				options={{
					headerRight: () => (
						<Button
							title="save"
							onPress={() => {
								// do nothing
							}}
						/>
					),
				}}
			>
				{(props) => <Edit {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Sell;
