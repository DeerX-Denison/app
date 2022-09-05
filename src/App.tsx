import { JustSignOut, UserContext } from '@Contexts';
import {
	useAnalytics,
	useAuth,
	useBackgroundLink,
	useFCMToken,
	useForegroundLink,
	useHealth,
	useNotification,
} from '@Hooks';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	NavigationContainer,
	useNavigationContainerRef,
} from '@react-navigation/native';
import { Listings, Menu, Message, Sell, Wishlist } from '@Tabs';
import React, { FC, useState } from 'react';
import Toast from 'react-native-toast-message';
import { HomeTab, InboxTab, SellTab, TabsParamList } from 'types';
import SignIn from './SignIn';
import ChatActive from './static/chat-active.svg';
import ChatInactive from './static/chat-inactive.svg';
import HeartActive from './static/heart-active.svg';
import HeartInactive from './static/heart-inactive.svg';
import HomeActive from './static/home-active.svg';
import HomeInactive from './static/home-inactive.svg';
import MenuActive from './static/menu-active.svg';
import MenuInactive from './static/menu-inactive.svg';
import ShopActive from './static/shop-active.svg';
import ShopInactive from './static/shop-inactive.svg';

interface Props {}

const App: FC<Props> = () => {
	const [justSignOut, setJustSignOut] = useState<boolean>(false);
	const navigationRef = useNavigationContainerRef<TabsParamList>();
	const { initialRoute, initialParams } = useNotification(navigationRef);
	const { user, userInfo, userProfile } = useAuth();
	const Tab = createBottomTabNavigator<TabsParamList>();
	useHealth();
	useFCMToken(userInfo);
	useAnalytics(userInfo);
	useBackgroundLink(navigationRef);
	useForegroundLink(navigationRef);

	return (
		<>
			{user ? (
				// if user is logged in, display tabs
				<>
					{initialRoute !== null && initialParams !== null && (
						<UserContext.Provider value={{ user, userInfo, userProfile }}>
							<JustSignOut.Provider value={{ justSignOut, setJustSignOut }}>
								<NavigationContainer ref={navigationRef}>
									<Tab.Navigator
										initialRouteName={initialRoute}
										screenOptions={{
											headerShown: false,
											tabBarShowLabel: false,
										}}
									>
										<Tab.Screen
											name="Home"
											initialParams={initialParams as HomeTab}
											options={{
												tabBarIcon: ({ focused }) =>
													focused ? (
														<HomeActive height={32} width={32} />
													) : (
														<HomeInactive height={32} width={32} />
													),
											}}
										>
											{(props) => <Listings {...props} />}
										</Tab.Screen>
										<Tab.Screen
											name="Inbox"
											initialParams={initialParams as InboxTab}
											options={{
												tabBarIcon: ({ focused }) =>
													focused ? (
														<ChatActive height={42} width={42} />
													) : (
														<ChatInactive height={42} width={42} />
													),
											}}
										>
											{(props) => <Message {...props} />}
										</Tab.Screen>
										<Tab.Screen
											name="Sell"
											initialParams={initialParams as SellTab}
											options={{
												tabBarIcon: ({ focused }) =>
													focused ? (
														<ShopActive height={32} width={32} />
													) : (
														<ShopInactive height={32} width={32} />
													),
											}}
										>
											{(props) => <Sell {...props} />}
										</Tab.Screen>
										<Tab.Screen
											name="Liked"
											initialParams={initialParams as undefined}
											options={{
												tabBarIcon: ({ focused }) =>
													focused ? (
														<HeartActive height={32} width={32} />
													) : (
														<HeartInactive height={32} width={32} />
													),
											}}
										>
											{(props) => <Wishlist {...props} />}
										</Tab.Screen>
										<Tab.Screen
											name="Menu"
											initialParams={initialParams as undefined}
											options={{
												tabBarIcon: ({ focused }) =>
													focused ? (
														<MenuActive height={32} width={32} />
													) : (
														<MenuInactive height={32} width={32} />
													),
											}}
										>
											{(props) => <Menu {...props} />}
										</Tab.Screen>
									</Tab.Navigator>
								</NavigationContainer>
							</JustSignOut.Provider>
						</UserContext.Provider>
					)}
				</>
			) : (
				// else display login
				<>
					<SignIn />
				</>
			)}
			<Toast />
		</>
	);
};
export default App;
