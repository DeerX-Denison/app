import { cleanup, render } from '@testing-library/react-native';
import React from 'react';
import SignIn from '.';
import config from '../config.json';
import * as useEmailLinkEffect from './useEmailLinkEffect';

const mockUseEmailLinkEffect = useEmailLinkEffect.default as jest.Mock;
jest.mock('./useEmailLinkEffect', () => ({
	__esModule: true,
	default: jest.fn(),
}));

describe('Sign In Page', () => {
	afterEach(() => {
		mockUseEmailLinkEffect.mockReset();
		cleanup();
	});

	it('correct version', () => {
		mockUseEmailLinkEffect.mockReturnValue({});
		const { queryByText } = render(<SignIn />);
		expect(queryByText(`${config.firebase_env} version`)).toBeTruthy();
	});

	it('renders loading UI, loading === true', () => {
		mockUseEmailLinkEffect.mockReturnValue({ loading: true });
		const { queryByTestId } = render(<SignIn />);
		expect(queryByTestId('loading')).toBeTruthy();
		expect(queryByTestId('tester-login')).not.toBeTruthy();
		expect(queryByTestId('user-login')).not.toBeTruthy();
	});

	it('not renders loading UI, loading === false', () => {
		mockUseEmailLinkEffect.mockReturnValue({ loading: false });
		const { queryByTestId } = render(<SignIn />);
		expect(queryByTestId('loading')).not.toBeTruthy();
	});
});
