import { fn } from '@firebase.config';
import logger from '@logger';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import React, { FC, useEffect, useState } from 'react';
import { Alert, Button, Text } from 'react-native';

interface Props {}

const CardForm: FC<Props> = () => {
	const { initPaymentSheet, presentPaymentSheet } = useStripe();
	const [pubKey, setPubKey] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const res = await fn.httpsCallable('getStripePubKey')();
				setPubKey(res.data as string);
			} catch (error) {
				logger.log(error);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const res = await fn.httpsCallable('confirmStripePayment')();
				const paymentIntentClientSecret = res.data as string;
				const { error } = await initPaymentSheet({
					paymentIntentClientSecret,
				});
				if (!error) {
					setLoading(true);
				}
			} catch (error) {
				logger.log(error);
			}
		})();
	}, []);

	const openPaymentSheet = async () => {
		const { error } = await presentPaymentSheet();
		if (error) {
			Alert.alert(`Error code: ${error.code}`, error.message);
		} else {
			Alert.alert('Success', 'Your order is confirmed!');
		}
	};

	return (
		<>
			<StripeProvider
				publishableKey={pubKey}
				merchantIdentifier="merchant.identifier"
			>
				<Text>Card Form</Text>
				<Button
					title="Checkout"
					disabled={!loading}
					onPress={openPaymentSheet}
				/>
			</StripeProvider>
		</>
	);
};
export default CardForm;
