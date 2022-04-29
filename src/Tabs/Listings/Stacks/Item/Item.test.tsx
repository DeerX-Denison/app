import { DEFAULT_USER_DISPLAY_NAME } from '@Constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { cleanup, render } from '@testing-library/react-native';
import React, { FC } from 'react';
import { ListingsStackParamList } from 'types';
import Item from '.';
import * as useIsSeller from '../../../../Hooks/useIsSeller';
import * as useListingData from '../../../../Hooks/useListingData';

const mockUseListingData = useListingData.default as jest.Mock;
const mockUseIsSeller = useIsSeller.default as jest.Mock;

jest.mock('../../../../Hooks/useListingData', () => ({
	__esModule: true,
	default: jest.fn(),
}));
jest.mock('../../../../Hooks/useIsSeller', () => ({
	__esModule: true,
	default: jest.fn(),
}));

const mockListingData = {
	category: 'INSTRUMENT',
	condition: 'USEABLE',
	description: 'Mock description',
	id: 'listing-id',
	images: ['mock-image-url'],
	name: 'Kofee',
	price: '420',
	savedBy: '1',
	seller: {
		displayName: null,
		photoURL: null,
		uid: 'user-id',
	},
	status: 'posted',
	updatedAt: { nanoseconds: 814000000, seconds: 1639246921 },
	createdAt: { nanoseconds: 814000000, seconds: 1639246921 },
};

const Stack = createNativeStackNavigator<ListingsStackParamList>();
const MockItem: FC = () => (
	<NavigationContainer>
		<Stack.Navigator
			initialRouteName="Item"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Item">
				{(props) => (
					<Item
						debouncedAddWishlistToDb={undefined}
						debouncedRemoveWishlistFromDb={undefined}
						{...props}
						route={{
							// eslint-disable-next-line react/prop-types
							...props.route,
							params: { listingId: 'Mock Listing Id' },
						}}
					/>
				)}
			</Stack.Screen>
		</Stack.Navigator>
	</NavigationContainer>
);

describe('Listing tabs - Item stack', () => {
	afterEach(() => {
		mockUseListingData.mockReset();
		cleanup();
	});

	it.skip('listingData === undefined && isSeller', () => {
		mockUseListingData.mockReturnValue({ listingData: undefined });
		mockUseIsSeller.mockReturnValue({ isSeller: true });
		const { queryByTestId, queryByText } = render(<MockItem />);
		// renders loading
		expect(queryByTestId('loading')).toBeTruthy();
		// renders nothing else
		expect(queryByText(mockListingData.name)).not.toBeTruthy();
		expect(queryByText(`$ ${mockListingData.price}`)).not.toBeTruthy();
		expect(
			queryByText(`Saved by: ${mockListingData.savedBy}`)
		).not.toBeTruthy();
		expect(queryByText('View')).not.toBeTruthy();
		expect(queryByText('Edit')).not.toBeTruthy();
		expect(queryByText('send message')).not.toBeTruthy();
		expect(queryByText('Like')).not.toBeTruthy();
		expect(queryByText('Seller info:')).not.toBeTruthy();
		expect(queryByText(mockListingData.seller.uid)).not.toBeTruthy();
		expect(
			queryByText(`Category: ${mockListingData.category}`)
		).not.toBeTruthy();
		expect(
			queryByText(`Condition: ${mockListingData.condition}`)
		).not.toBeTruthy();
		expect(queryByText(mockListingData.description)).not.toBeTruthy();
	});

	it.skip('listingData === undefined && !isSeller', () => {
		mockUseListingData.mockReturnValue({ listingData: undefined });
		mockUseIsSeller.mockReturnValue({ isSeller: false });
		const { queryByTestId, queryByText } = render(<MockItem />);
		// renders loading
		expect(queryByTestId('loading')).toBeTruthy();
		// renders nothing else
		expect(queryByText(mockListingData.name)).not.toBeTruthy();
		expect(queryByText(`$ ${mockListingData.price}`)).not.toBeTruthy();
		expect(
			queryByText(`Saved by: ${mockListingData.savedBy}`)
		).not.toBeTruthy();
		expect(queryByText('View')).not.toBeTruthy();
		expect(queryByText('Edit')).not.toBeTruthy();
		expect(queryByText('send message')).not.toBeTruthy();
		expect(queryByText('Like')).not.toBeTruthy();
		expect(queryByText('Seller info:')).not.toBeTruthy();
		expect(queryByText(mockListingData.seller.uid)).not.toBeTruthy();
		expect(
			queryByText(`Category: ${mockListingData.category}`)
		).not.toBeTruthy();
		expect(
			queryByText(`Condition: ${mockListingData.condition}`)
		).not.toBeTruthy();
		expect(queryByText(mockListingData.description)).not.toBeTruthy();
	});

	it.skip('listingData === [...valid data] && isSeller', () => {
		mockUseListingData.mockReturnValue({ listingData: mockListingData });
		mockUseIsSeller.mockReturnValue({ isSeller: true });
		const { queryByTestId, queryByText } = render(<MockItem />);
		// not renders loading
		expect(queryByTestId('loading')).not.toBeTruthy();
		// renders everything else
		expect(queryByText(mockListingData.name)).toBeTruthy();
		expect(queryByText(`$ ${mockListingData.price}`)).toBeTruthy();
		expect(queryByText(`Saved by: ${mockListingData.savedBy}`)).toBeTruthy();
		expect(queryByText('View')).toBeTruthy();
		expect(queryByText('Edit')).toBeTruthy();
		expect(queryByText('send message')).not.toBeTruthy();
		expect(queryByText('add to wishlist')).not.toBeTruthy();
		expect(queryByText('Seller info:')).toBeTruthy();
		expect(
			queryByText(
				mockListingData.seller.displayName
					? mockListingData.seller.displayName
					: DEFAULT_USER_DISPLAY_NAME
			)
		).toBeTruthy();
		expect(queryByText(`Category: ${mockListingData.category}`)).toBeTruthy();
		expect(queryByText(`Condition: ${mockListingData.condition}`)).toBeTruthy();
		expect(queryByText(mockListingData.description)).toBeTruthy();
	});

	it.skip('listingData === [...valid data] && !isSeller', () => {
		mockUseListingData.mockReturnValue({ listingData: mockListingData });
		mockUseIsSeller.mockReturnValue({ isSeller: false });
		const { queryByTestId, queryByText } = render(<MockItem />);
		expect(queryByTestId('loading')).not.toBeTruthy();
		expect(queryByText(mockListingData.name)).toBeTruthy();
		expect(queryByText(`$ ${mockListingData.price}`)).toBeTruthy();
		expect(queryByText(`Saved by: ${mockListingData.savedBy}`)).toBeTruthy();
		expect(queryByText('View')).toBeTruthy();
		expect(queryByText('edit')).not.toBeTruthy();
		expect(queryByText('send message')).toBeTruthy();
		expect(queryByText('add to wishlist')).toBeTruthy();
		expect(queryByText('Seller info:')).toBeTruthy();
		expect(
			queryByText(
				mockListingData.seller.displayName
					? mockListingData.seller.displayName
					: DEFAULT_USER_DISPLAY_NAME
			)
		).toBeTruthy();
		expect(queryByText(`Category: ${mockListingData.category}`)).toBeTruthy();
		expect(queryByText(`Condition: ${mockListingData.condition}`)).toBeTruthy();
		expect(queryByText(mockListingData.description)).toBeTruthy();
	});
});
