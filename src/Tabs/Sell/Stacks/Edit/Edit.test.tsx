import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { cleanup, render } from '@testing-library/react-native';
import React, { FC } from 'react';
import { ListingsStackParamList } from 'types';
import Edit from '.';
import * as useListingData from '../../../../Hooks/useListingData';

const mockUseListingData = useListingData.default as jest.Mock;

jest.mock('../../../../Hooks/useListingData', () => ({
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
// const mockInvalidData = {
// 	category: undefined,
// 	condition: undefined,
// 	description: 'Mock description',
// 	id: 'listing-id',
// 	images: ['mock-image-url'],
// 	name: 'Kofee',
// 	price: '420',
// 	savedBy: '1',
// 	seller: {
// 		displayName: null,
// 		photoURL: null,
// 		uid: 'user-id',
// 	},
// 	status: 'posted',
// 	updatedAt: { nanoseconds: 814000000, seconds: 1639246921 },
// 	createdAt: { nanoseconds: 814000000, seconds: 1639246921 },
// };

const Stack = createNativeStackNavigator<ListingsStackParamList>();
const MockEdit: FC = () => (
	<NavigationContainer>
		<Stack.Navigator
			initialRouteName="Edit"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Edit">
				{(props) => (
					<Edit
						{...props}
						// eslint-disable-next-line react/prop-types
						route={{ ...props.route, params: { listingId: 'Mock Listing Id' } }}
					/>
				)}
			</Stack.Screen>
		</Stack.Navigator>
	</NavigationContainer>
);

describe('Listing tabs - Edit stack', () => {
	afterEach(() => {
		mockUseListingData.mockReset();
		cleanup();
	});
	it('listingData === undefined', () => {
		mockUseListingData.mockReturnValue({ listingData: undefined });
		const {
			queryByTestId,
			queryByText,
			queryByPlaceholderText,
			queryByDisplayValue,
		} = render(<MockEdit />);
		expect(queryByTestId('loading')).toBeTruthy();
		expect(queryByText('cancel')).not.toBeTruthy();
		expect(queryByText('delete')).not.toBeTruthy();
		expect(queryByText('save')).not.toBeTruthy();
		expect(queryByText('Remove')).not.toBeTruthy();
		expect(queryByText('Add')).not.toBeTruthy();
		expect(queryByText('View')).not.toBeTruthy();
		expect(queryByPlaceholderText('Item Name')).not.toBeTruthy();
		expect(queryByDisplayValue(mockListingData.name)).not.toBeTruthy();
		expect(queryByPlaceholderText('Item Price')).not.toBeTruthy();
		expect(queryByDisplayValue(mockListingData.price)).not.toBeTruthy();
		// TODO: implement category text matches
		expect(queryByText('Category:')).not.toBeTruthy();
		// TODO: implement condition text matches
		expect(queryByText('Condition:')).not.toBeTruthy();
		expect(queryByPlaceholderText('Item Description')).not.toBeTruthy();
		expect(queryByDisplayValue(mockListingData.description)).not.toBeTruthy();
		expect(queryByText('Private')).not.toBeTruthy();
		expect(queryByText('Public')).not.toBeTruthy();
	});
	it('listingData === [...valid data]', () => {
		mockUseListingData.mockReturnValue({ listingData: mockListingData });
		const {
			queryByTestId,
			queryByText,
			queryByDisplayValue,
			queryByPlaceholderText,
		} = render(<MockEdit />);
		expect(queryByTestId('loading')).not.toBeTruthy();
		expect(queryByText('cancel')).toBeTruthy();
		expect(queryByText('delete')).toBeTruthy();
		expect(queryByText('save')).toBeTruthy();
		expect(queryByText('Remove')).toBeTruthy();
		expect(queryByText('Add')).toBeTruthy();
		expect(queryByText('View')).toBeTruthy();
		expect(queryByPlaceholderText('Item Name')).toBeTruthy();
		expect(queryByDisplayValue(mockListingData.name)).toBeTruthy();
		expect(queryByPlaceholderText('Item Price')).toBeTruthy();
		expect(queryByDisplayValue(mockListingData.price)).toBeTruthy();
		// TODO: implement category text matches
		expect(queryByText('Category:')).toBeTruthy();
		// TODO: implement condition text matches
		expect(queryByText('Condition:')).toBeTruthy();
		expect(queryByPlaceholderText('Item Description')).toBeTruthy();
		expect(queryByDisplayValue(mockListingData.description)).toBeTruthy();
		expect(queryByText('Private')).toBeTruthy();
		expect(queryByText('Public')).toBeTruthy();
	});

	// TODO: implement test when listing data == [...] but its invalid, see if theres error
});
