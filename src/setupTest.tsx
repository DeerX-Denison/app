import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import React from 'react';
import * as ReactNative from 'react-native';
import 'ts-jest';

// mock native modules

// mock expo image picker
jest.mock('expo-image-picker', () => ({
	launchImageLibraryAsync: jest.fn(),
	MediaTypeOptions: jest.fn(),
	requestMediaLibraryPermissionsAsync: jest.fn(),
}));

// mock notifee
jest.doMock('react-native', () => {
	return Object.setPrototypeOf(
		{
			NativeModules: {
				...ReactNative.NativeModules,
				NotifeeApiModule: {
					addListener: jest.fn(),
					eventsAddListener: jest.fn(),
					eventsNotifyReady: jest.fn(),
				},
			},
		},
		ReactNative
	);
});

// mock firebase
jest.mock('./firebase.config.ts', () => ({
	db: jest.fn(),
	fn: jest.fn(),
	auth: jest.fn(),
	storage: jest.fn(),
}));

// mock react-native-keyboard-aware-scroll-view
jest.mock('react-native-keyboard-aware-scroll-view', () => ({
	KeyboardAwareScrollView: jest
		.fn()
		.mockImplementation(({ children }) => children),
}));

// mock react-native-picker-select
jest.mock('react-native-picker-select', () => jest.fn().mockReturnValue(<></>));

// mock react-native-vector-icons/FontAwesome
jest.mock('react-native-vector-icons/FontAwesome', () => ({
	default: jest.fn(),
}));

// mock react-native/Libraries/Animated/src/NativeAnimatedHelper
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

// mock async storage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.useFakeTimers();
