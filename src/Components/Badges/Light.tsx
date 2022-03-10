import tw from '@tw';
import React, { FC } from 'react';
import { View } from 'react-native';

interface Props {}

const Light: FC<Props> = ({ children }) => {
	return (
		<View
			style={tw(
				'flex-row border mx-2 my-1 items-center py-0.5 px-1 rounded-full bg-yellow-100'
			)}
		>
			{children}
		</View>
	);
};

export default Light;
