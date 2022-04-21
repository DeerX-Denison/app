import tw from '@tw';
import React, { FC, useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Style } from 'tailwind-react-native-classnames';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface Props {
	title: string;
	onPress: () => void;
	size: Size;
}

const Secondary: FC<Props> = ({ title, onPress, size }) => {
	const [buttonStyle, setButtonStyle] = useState<Style>(tw());
	const [textStyle, setTextStyle] = useState<Style>(tw());

	useEffect(() => {
		if (size === 'xs') {
			setButtonStyle(
				tw(
					'flex items-center justify-center px-2.5 py-1.5 border border-gray-300 shadow-sm rounded bg-white'
				)
			);
			setTextStyle(tw('text-denison-red text-xs font-semibold'));
		} else if (size === 'sm') {
			setButtonStyle(
				tw(
					'flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm rounded bg-white'
				)
			);
			setTextStyle(tw('text-denison-red text-sm font-semibold'));
		} else if (size === 'md') {
			setButtonStyle(
				tw(
					'flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm rounded bg-white'
				)
			);
			setTextStyle(tw('text-denison-red text-sm font-semibold'));
		} else if (size === 'lg') {
			setButtonStyle(
				tw(
					'flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm rounded bg-white'
				)
			);
			setTextStyle(tw('text-denison-red text-base font-semibold'));
		} else if (size === 'xl') {
			setButtonStyle(
				tw(
					'flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm rounded bg-white'
				)
			);
			setTextStyle(tw('text-denison-red text-base font-semibold'));
		}
	}, [size]);

	return (
		<>
			<TouchableOpacity style={buttonStyle} onPress={onPress}>
				<Text style={textStyle}>{title}</Text>
			</TouchableOpacity>
		</>
	);
};

export default Secondary;
