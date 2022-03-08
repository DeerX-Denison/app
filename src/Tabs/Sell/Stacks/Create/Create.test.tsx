import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { cleanup, render } from '@testing-library/react-native';
import React, { FC } from 'react';
import { ListingData, ListingsStackParamList } from 'types';
import { v4 as uuidv4 } from 'uuid';
import Create from '.';
import * as useListingError from '../../../../Hooks/useListingError';
import * as useNewListingData from '../../../../Hooks/useNewListingData';

const mockUseListingData = useNewListingData.default as jest.Mock;
jest.mock('../../../../Hooks/useNewListingData', () => ({
	__esModule: true,
	default: jest.fn(),
}));

const mockUseListingError = useListingError.default as jest.Mock;
jest.mock('../../../../Hooks/useListingError', () => ({
	__esModule: true,
	default: jest.fn(),
}));

const mockListingData: ListingData = {
	id: uuidv4(),
	images: [],
	name: 'mock item name',
	price: '420',
	category: 'BOOKS',
	seller: {
		uid: 'user-1',
		displayName: 'displayName',
		photoURL: 'photoURL',
	},
	condition: 'BARELY FUNCTIONAL',
	description: 'mock description',
	savedBy: 0,
	status: 'saved',
	createdAt: undefined,
	updatedAt: undefined,
};

const useListingErrorUndefined = {
	imageError: undefined,
	nameError: undefined,
	priceError: undefined,
	categoryError: undefined,
	conditionError: undefined,
	descError: undefined,
};

const useListingErrorMock = {
	imageError: 'Mock image error',
	nameError: 'Mock name error',
	priceError: 'Mock price error',
	categoryError: 'Mock category error',
	conditionError: 'Mock condition error',
	descError: 'Mock description error',
};

const Stack = createNativeStackNavigator<ListingsStackParamList>();
const MockCreate: FC = () => (
	<NavigationContainer>
		<Stack.Navigator
			initialRouteName="Create"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Create">
				{(props) => <Create {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	</NavigationContainer>
);

describe('Listing tabs - Create stack', () => {
	afterEach(() => {
		mockUseListingError.mockReset();
		mockUseListingData.mockReset();
		cleanup();
	});
	it.skip('listingData === undefined && useListingError returns all undefined', () => {
		mockUseListingData.mockReturnValue({ listingData: undefined });
		mockUseListingError.mockReturnValue(useListingErrorUndefined);
		const {
			queryByTestId,
			queryByText,
			queryByPlaceholderText,
			queryByDisplayValue,
		} = render(<MockCreate />);
		expect(queryByTestId('loading')).toBeTruthy();
		expect(queryByText('cancel')).not.toBeTruthy();
		expect(queryByText('create')).not.toBeTruthy();
		expect(queryByText('Add Image')).not.toBeTruthy();
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
	it.skip('listingData === newListingData && useListingError returns all undefined', () => {
		mockUseListingData.mockReturnValue({
			listingData: mockListingData,
		});
		mockUseListingError.mockReturnValue(useListingErrorUndefined);

		const {
			queryByPlaceholderText,
			queryByText,
			queryByDisplayValue,
			queryByTestId,
		} = render(<MockCreate />);
		expect(queryByTestId('loading')).not.toBeTruthy();
		expect(queryByText('cancel')).toBeTruthy();
		expect(queryByText('create')).toBeTruthy();
		expect(queryByText('Add Image')).toBeTruthy();
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
	it.skip('listingData === newListingData && useListingError returns mock errors', () => {
		mockUseListingData.mockReturnValue({
			listingData: mockListingData,
		});
		mockUseListingError.mockReturnValue(useListingErrorMock);

		const { queryByText } = render(<MockCreate />);
		expect(queryByText('Mock image error')).toBeTruthy();
		expect(queryByText('Mock name error')).toBeTruthy();
		expect(queryByText('Mock price error')).toBeTruthy();
		expect(queryByText('Mock category error')).toBeTruthy();
		expect(queryByText('Mock condition error')).toBeTruthy();
		expect(queryByText('Mock description error')).toBeTruthy();
		expect(queryByText('Private')).toBeTruthy();
		expect(queryByText('Public')).toBeTruthy();
	});
});
