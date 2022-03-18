import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { cleanup, render } from '@testing-library/react-native';
import React, { FC } from 'react';
import { ListingsStackParamList } from 'types';
import MyListings from '.';
import * as useMyListings from '../../../../Hooks/useMyListings';

const mockUseMyListings = useMyListings.default as jest.Mock;

jest.mock('../../../../Hooks/useMyListings', () => ({
	__esModule: true,
	default: jest.fn(),
}));

const mockMyListingData = [
	{
		category: 'FURNITURE',
		condition: 'LIKE NEW',
		description: 'Sum medium rere stiks',
		id: '925e0068-852f-438b-a55a-8e20080bd984',
		images: ['mock-image-url'],
		name: 'Steaks',
		price: '8.57',
		savedBy: '1',
		seller: {
			displayName: null,
			photoURL: null,
			uid: 'user-id',
		},
		status: 'posted',
		updatedAt: { nanoseconds: 814000000, seconds: 1639246921 },
		createdAt: { nanoseconds: 814000000, seconds: 1639246921 },
	},
];

const Stack = createNativeStackNavigator<ListingsStackParamList>();
const MockMyListing: FC = () => (
	<NavigationContainer>
		<Stack.Navigator
			initialRouteName="MyListing"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="MyListing">
				{(props) => <MyListings {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	</NavigationContainer>
);

describe('Listing tabs - MyListing stack', () => {
	afterEach(() => {
		mockUseMyListings.mockReset();
		cleanup();
	});

	it.skip('myListings === undefined', () => {
		mockUseMyListings.mockReturnValue({ myListings: undefined });
		const { queryByTestId, queryByText } = render(<MockMyListing />);
		expect(queryByTestId('loading')).toBeTruthy();
		expect(queryByText('Listing is empty')).not.toBeTruthy();
	});
	it.skip('myListings === []', () => {
		mockUseMyListings.mockReturnValue({ myListings: [] });
		const { queryByTestId, queryByText } = render(<MockMyListing />);
		expect(queryByTestId('loading')).not.toBeTruthy();
		expect(queryByText('Listing is empty')).toBeTruthy();
	});
	it.skip('myListings === [...valid data]', () => {
		mockUseMyListings.mockReturnValue({ myListings: mockMyListingData });
		const { queryByTestId, queryByText, queryAllByText } = render(
			<MockMyListing />
		);
		expect(queryByTestId('loading')).not.toBeTruthy();
		expect(queryByText('Listing is empty')).not.toBeTruthy();
		expect(queryByText('Create')).toBeTruthy();
		mockMyListingData.forEach((myListingData) => {
			expect(queryByText(myListingData.name)).toBeTruthy();
		});
		expect(queryAllByText('Edit')).toHaveLength(mockMyListingData.length);
	});
});
