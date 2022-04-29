import * as Buttons from '@Components/Buttons';
import { fn } from '@firebase.config';
import logger from '@logger';
// import { UserContext } from '@Contexts';
// import { useProfile } from '@Hooks';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { ListingsStackParamList, ReportData } from 'types';
interface Props {
	route: RouteProp<ListingsStackParamList, 'Report'>;
	navigation: NativeStackNavigationProp<ListingsStackParamList, 'Report'>;
}

const Report: FC<Props> = ({ navigation, route }) => {
	const [textInputValue, setTextInputValue] = useState('');
	const [disabled, setDisabled] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const submitHandler = async () => {
		setDisabled(true);
		if (!route.params.id || !route.params.type) {
			setError('Unknown reporter or types of report. Please try again later.');
			setDisabled(false);
			return;
		}
		if (textInputValue.length === 0) {
			setError('Please provide details of your report...');
			setDisabled(false);
		}

		const reportData: ReportData = {
			type: route.params.type,
			detail: textInputValue,
			id: route.params.id,
		};
		try {
			await fn.httpsCallable('createReport')(reportData);
			navigation.goBack();
		} catch (error) {
			logger.log(error);
			Toast.show({
				type: 'error',
				text1: 'Error creating report, please try again later',
				text2: 'Or email us at deerx.dev@gmail.com',
			});
			setDisabled(false);
		}
	};

	return (
		<View style={tw('flex flex-1 m-4 flex flex-col')}>
			<TextInput
				style={tw('border border-denison-red p-4 mb-4 text-s-lg rounded-2xl')}
				multiline={true}
				scrollEnabled={true}
				onChangeText={(text) => setTextInputValue(text)}
				value={textInputValue}
				placeholder="What is wrong?"
			/>
			{error.length > 0 && (
				<Text style={tw('text-s-md text-denison-red mb-4')}>{error}</Text>
			)}
			<View style={tw('flex justify-center')}>
				<Buttons.Primary
					disabled={disabled}
					title="Submit"
					onPress={() => submitHandler()}
					size={'md'}
				/>
			</View>
		</View>
	);
};

export default Report;
