import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { cleanup, render } from '@testing-library/react-native';
import React, { FC } from 'react';
import { WishlistStackParamList } from 'types';
import Main from '.';
import * as useWishlist from '../../../../Hooks/useWishlist';

const mockUseWishlist = useWishlist.default as jest.Mock;

jest.mock('../../../../Hooks/useWishlist', () => ({
	__esModule: true,
	default: jest.fn(),
}));

const Stack = createNativeStackNavigator<WishlistStackParamList>();
const MockWishlist: FC = () => (
	<NavigationContainer>
		<Stack.Navigator
			initialRouteName="Main"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Main">{(props) => <Main {...props} />}</Stack.Screen>
		</Stack.Navigator>
	</NavigationContainer>
);

const mockWishlist = [
	{
		id: 'id',
		thumbnail: 'mock thumbnail',
		name: 'coffee mug',
		price: '69',
		seller: {
			displayName: 'mock display name',
			photoURL: 'mock user photo url',
			uid: 'mock user uid',
		},
	},
];

describe('Wishlist tab - Main stack', () => {
	afterEach(() => {
		mockUseWishlist.mockReset();
		cleanup();
	});

	it('wishlist === undefined', () => {
		mockUseWishlist.mockReturnValue({ wishlist: undefined });
		const { queryByTestId, queryByText } = render(<MockWishlist />);
		expect(queryByTestId('loading')).toBeTruthy();
		expect(queryByText('Wishlist is empty')).not.toBeTruthy();
	});
	it('wishlist === []', () => {
		mockUseWishlist.mockReturnValue({ wishlist: [] });
		const { queryByTestId, queryByText } = render(<MockWishlist />);
		expect(queryByTestId('loading')).not.toBeTruthy();
		expect(queryByText('Wishlist is empty')).toBeTruthy();
	});
	it('wishlist === [...valid data]', () => {
		mockUseWishlist.mockReturnValue({ wishlist: mockWishlist });
		const { queryByTestId, queryByText, queryAllByText } = render(
			<MockWishlist />
		);
		expect(queryByTestId('loading')).not.toBeTruthy();
		expect(queryByText('Wishlist is empty')).not.toBeTruthy();
		mockWishlist.forEach((wishlistItem) => {
			expect(queryByText(wishlistItem.name)).toBeTruthy();
		});
		expect(queryAllByText('View')).toHaveLength(mockWishlist.length);
	});
});
