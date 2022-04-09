import { useProfile } from '@Hooks';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { ListingsStackParamList } from 'types';

interface Props {
	route: RouteProp<ListingsStackParamList, 'Profile'>;
	navigation: NativeStackNavigationProp<ListingsStackParamList, 'Profile'>;
}

const Profile: FC<Props> = ({ route }) => {
	const { profile } = useProfile(route.params.uid);

	return (
		<View style={tw('flex flex-col justify-center items-center')}>
			<Text>Profile</Text>
			<Text>{profile?.uid}</Text>
		</View>
	);
};

export default Profile;
