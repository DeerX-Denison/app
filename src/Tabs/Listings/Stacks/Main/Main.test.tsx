import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { cleanup, render } from '@testing-library/react-native';
import React, { FC } from 'react';
import { ListingData, ListingsStackParamList } from 'types';
import Main from '.';
import * as useListings from '../../../../Hooks/useListings';

const mockUseListings = useListings.default as jest.Mock;
jest.mock('../../../../Hooks/useListings', () => ({
	__esModule: true,
	default: jest.fn(),
}));

const Stack = createNativeStackNavigator<ListingsStackParamList>();
const MockMain: FC = () => (
	<NavigationContainer>
		<Stack.Navigator
			initialRouteName="Main"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Main">{(props) => <Main {...props} />}</Stack.Screen>
		</Stack.Navigator>
	</NavigationContainer>
);

describe('Listing tabs - Main stack', () => {
	afterEach(() => {
		mockUseListings.mockReset();
		cleanup();
	});

	it('renders', () => {
		mockUseListings.mockReturnValue({ listings: undefined });
		const { queryByTestId } = render(<MockMain />);
		expect(queryByTestId('loading')).toBeTruthy();
		expect(queryByTestId('create')).toBeTruthy();
		expect(queryByTestId('myListings')).toBeTruthy();
	});
	it('listings === undefined', () => {
		mockUseListings.mockReturnValue({ listings: undefined });
		const { queryByTestId } = render(<MockMain />);
		expect(queryByTestId('loading')).toBeTruthy();
		expect(queryByTestId('empty')).not.toBeTruthy();
	});

	it('listings === []', () => {
		mockUseListings.mockReturnValue({ listings: [] });
		const { queryByTestId } = render(<MockMain />);
		expect(queryByTestId('loading')).not.toBeTruthy();
		expect(queryByTestId('empty')).toBeTruthy();
	});

	it('listings === [...]', () => {
		mockUseListings.mockReturnValue({ listings: listings });
		const { queryByTestId, queryAllByText } = render(<MockMain />);
		expect(queryByTestId('loading')).not.toBeTruthy();
		expect(queryByTestId('empty')).not.toBeTruthy();
		for (let i = 0; i < listings.length; i++) {
			expect(queryAllByText(listings[i].name)).toHaveLength(
				listings.filter((listing) => listing.name === listings[i].name).length
			);
		}
	});
});

const listings: ListingData[] = [
	{
		id: 'item-1',
		images: [
			'https://m.media-amazon.com/images/I/71pWwFObbFL._AC_SL1500_.jpg',
			'https://m.media-amazon.com/images/I/61HRnUdvv6L._AC_SL1000_.jpg',
			'https://cdn-4.nikon-cdn.com/e/Q5NM96RZZo-YRYNeYvAi9beHK4x3L-8u4h56I3YwHLAQ4G0XzTY4Dg==/Views/1590_D3500_front.png',
		],
		name: 'Camera',
		price: '500',
		category: 'ELECTRONIC',
		seller: {
			email: 'hello@world',
			uid: 'user-1',
			displayName: 'John Doe',
			photoURL:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		condition: 'BRAND NEW',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		savedBy: 1,
		createdAt: undefined,
		updatedAt: undefined,
		status: 'posted',
	},
	{
		id: 'item-2',
		images: [
			'https://m.media-amazon.com/images/I/71pWwFObbFL._AC_SL1500_.jpg',
			'https://m.media-amazon.com/images/I/61HRnUdvv6L._AC_SL1000_.jpg',
			'https://cdn-4.nikon-cdn.com/e/Q5NM96RZZo-YRYNeYvAi9beHK4x3L-8u4h56I3YwHLAQ4G0XzTY4Dg==/Views/1590_D3500_front.png',
		],
		name: 'Camera',
		price: '500',
		category: 'ELECTRONIC',
		seller: {
			email: 'hello@world',
			uid: 'user-2',
			displayName: 'John Doe',
			photoURL:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		condition: 'BRAND NEW',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		savedBy: 2,
		createdAt: undefined,
		updatedAt: undefined,
		status: 'posted',
	},
	{
		id: 'item-3',
		images: [
			'https://m.media-amazon.com/images/I/71pWwFObbFL._AC_SL1500_.jpg',
			'https://m.media-amazon.com/images/I/61HRnUdvv6L._AC_SL1000_.jpg',
			'https://cdn-4.nikon-cdn.com/e/Q5NM96RZZo-YRYNeYvAi9beHK4x3L-8u4h56I3YwHLAQ4G0XzTY4Dg==/Views/1590_D3500_front.png',
		],
		name: 'Camera',
		price: '500',
		category: 'ELECTRONIC',
		seller: {
			email: 'hello@world',
			uid: 'user-3',
			displayName: 'John Doe',
			photoURL:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		condition: 'BRAND NEW',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		savedBy: 3,
		createdAt: undefined,
		updatedAt: undefined,
		status: 'posted',
	},
	{
		id: 'item-4',
		images: [
			'https://m.media-amazon.com/images/I/71pWwFObbFL._AC_SL1500_.jpg',
			'https://m.media-amazon.com/images/I/61HRnUdvv6L._AC_SL1000_.jpg',
			'https://cdn-4.nikon-cdn.com/e/Q5NM96RZZo-YRYNeYvAi9beHK4x3L-8u4h56I3YwHLAQ4G0XzTY4Dg==/Views/1590_D3500_front.png',
		],
		name: 'Camera',
		price: '500',
		category: 'ELECTRONIC',
		seller: {
			email: 'hello@world',
			uid: 'user-4',
			displayName: 'John Doe',
			photoURL:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		condition: 'BRAND NEW',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		savedBy: 4,
		createdAt: undefined,
		updatedAt: undefined,
		status: 'posted',
	},
	{
		id: 'item-5',
		images: [
			'https://m.media-amazon.com/images/I/71pWwFObbFL._AC_SL1500_.jpg',
			'https://m.media-amazon.com/images/I/61HRnUdvv6L._AC_SL1000_.jpg',
			'https://cdn-4.nikon-cdn.com/e/Q5NM96RZZo-YRYNeYvAi9beHK4x3L-8u4h56I3YwHLAQ4G0XzTY4Dg==/Views/1590_D3500_front.png',
		],
		name: 'Camera',
		price: '500',
		category: 'ELECTRONIC',
		seller: {
			email: 'hello@world',
			uid: 'user-5',
			displayName: 'John Doe',
			photoURL:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		condition: 'BRAND NEW',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		savedBy: 5,
		createdAt: undefined,
		updatedAt: undefined,
		status: 'posted',
	},
	{
		id: 'item-6',
		images: [
			'https://m.media-amazon.com/images/I/71pWwFObbFL._AC_SL1500_.jpg',
			'https://m.media-amazon.com/images/I/61HRnUdvv6L._AC_SL1000_.jpg',
			'https://cdn-4.nikon-cdn.com/e/Q5NM96RZZo-YRYNeYvAi9beHK4x3L-8u4h56I3YwHLAQ4G0XzTY4Dg==/Views/1590_D3500_front.png',
		],
		name: 'Camera',
		price: '500',
		category: 'ELECTRONIC',
		seller: {
			email: 'hello@world',
			uid: 'user-6',
			displayName: 'John Doe',
			photoURL:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		condition: 'BRAND NEW',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		savedBy: 6,
		createdAt: undefined,
		updatedAt: undefined,
		status: 'posted',
	},
	{
		id: 'item-7',
		images: [
			'https://m.media-amazon.com/images/I/71pWwFObbFL._AC_SL1500_.jpg',
			'https://m.media-amazon.com/images/I/61HRnUdvv6L._AC_SL1000_.jpg',
			'https://cdn-4.nikon-cdn.com/e/Q5NM96RZZo-YRYNeYvAi9beHK4x3L-8u4h56I3YwHLAQ4G0XzTY4Dg==/Views/1590_D3500_front.png',
		],
		name: 'Camera',
		price: '500',
		category: 'ELECTRONIC',
		seller: {
			email: 'hello@world',
			uid: 'user-7',
			displayName: 'John Doe',
			photoURL:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		condition: 'BRAND NEW',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		savedBy: 7,
		createdAt: undefined,
		updatedAt: undefined,
		status: 'posted',
	},
	{
		id: 'item-8',
		images: [
			'https://m.media-amazon.com/images/I/71pWwFObbFL._AC_SL1500_.jpg',
			'https://m.media-amazon.com/images/I/61HRnUdvv6L._AC_SL1000_.jpg',
			'https://cdn-4.nikon-cdn.com/e/Q5NM96RZZo-YRYNeYvAi9beHK4x3L-8u4h56I3YwHLAQ4G0XzTY4Dg==/Views/1590_D3500_front.png',
		],
		name: 'Camera',
		price: '500',
		category: 'ELECTRONIC',
		seller: {
			email: 'hello@world',
			uid: 'user-8',
			displayName: 'John Doe',
			photoURL:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		condition: 'BRAND NEW',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		savedBy: 8,
		createdAt: undefined,
		updatedAt: undefined,
		status: 'posted',
	},
	{
		id: 'item-9',
		images: [
			'https://m.media-amazon.com/images/I/71pWwFObbFL._AC_SL1500_.jpg',
			'https://m.media-amazon.com/images/I/61HRnUdvv6L._AC_SL1000_.jpg',
			'https://cdn-4.nikon-cdn.com/e/Q5NM96RZZo-YRYNeYvAi9beHK4x3L-8u4h56I3YwHLAQ4G0XzTY4Dg==/Views/1590_D3500_front.png',
		],
		name: 'Camera',
		price: '500',
		category: 'ELECTRONIC',
		seller: {
			email: 'hello@world',
			uid: 'user-9',
			displayName: 'John Doe',
			photoURL:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		condition: 'BRAND NEW',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		savedBy: 9,
		createdAt: undefined,
		updatedAt: undefined,
		status: 'posted',
	},
	{
		id: 'item-10',
		images: [
			'https://m.media-amazon.com/images/I/71pWwFObbFL._AC_SL1500_.jpg',
			'https://m.media-amazon.com/images/I/61HRnUdvv6L._AC_SL1000_.jpg',
			'https://cdn-4.nikon-cdn.com/e/Q5NM96RZZo-YRYNeYvAi9beHK4x3L-8u4h56I3YwHLAQ4G0XzTY4Dg==/Views/1590_D3500_front.png',
		],
		name: 'Camera',
		price: '500',
		category: 'ELECTRONIC',
		seller: {
			email: 'hello@world',
			uid: 'user-10',
			displayName: 'John Doe',

			photoURL:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		condition: 'BRAND NEW',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		savedBy: 10,
		createdAt: undefined,
		updatedAt: undefined,
		status: 'posted',
	},
	{
		id: 'item-11',
		images: [
			'https://m.media-amazon.com/images/I/71pWwFObbFL._AC_SL1500_.jpg',
			'https://m.media-amazon.com/images/I/61HRnUdvv6L._AC_SL1000_.jpg',
			'https://cdn-4.nikon-cdn.com/e/Q5NM96RZZo-YRYNeYvAi9beHK4x3L-8u4h56I3YwHLAQ4G0XzTY4Dg==/Views/1590_D3500_front.png',
		],
		name: 'Camera',
		price: '500',
		category: 'ELECTRONIC',
		seller: {
			email: 'hello@world',
			uid: 'user-11',
			displayName: 'John Doe',
			photoURL:
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		condition: 'BRAND NEW',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		savedBy: 11,
		createdAt: undefined,
		updatedAt: undefined,
		status: 'posted',
	},
];
