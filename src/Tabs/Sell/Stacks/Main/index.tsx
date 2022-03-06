import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Text } from 'react-native';
import { ListingsStackParamList } from 'types';

interface Props {
	navigation: NativeStackNavigationProp<ListingsStackParamList>;
}

const Main: FC<Props> = () => {
	return <Text>Main</Text>;
};

export default Main;
