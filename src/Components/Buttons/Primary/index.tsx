import tw from '@tw';
import React, { FC, useEffect, useState } from 'react';
import { ButtonProps, Text, TouchableOpacity } from 'react-native';
import { Style } from 'tailwind-react-native-classnames';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface Props {
	size: Size;
}

const Primary: FC<Props & ButtonProps> = ({
	title,
	onPress,
	size,
	...props
}) => {
	const [buttonStyle, setButtonStyle] = useState<Style>(tw());
	const [textStyle, setTextStyle] = useState<Style>(tw());

	useEffect(() => {
		if (size === 'xs') {
			setButtonStyle(
				tw(
					`flex items-center justify-center px-2.5 py-1.5 border border-transparent rounded shadow-sm ${
						props.disabled ? 'bg-gray-400' : 'bg-indigo-600'
					}`
				)
			);
			setTextStyle(tw('text-white text-xs font-medium'));
		} else if (size === 'sm') {
			setButtonStyle(
				tw(
					`flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm ${
						props.disabled ? 'bg-gray-400' : 'bg-indigo-600'
					}`
				)
			);
			setTextStyle(tw('text-white text-sm font-medium'));
		} else if (size === 'md') {
			setButtonStyle(
				tw(
					`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm ${
						props.disabled ? 'bg-gray-400' : 'bg-indigo-600'
					}`
				)
			);
			setTextStyle(tw('text-white text-sm font-medium'));
		} else if (size === 'lg') {
			setButtonStyle(
				tw(
					`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm ${
						props.disabled ? 'bg-gray-400' : 'bg-indigo-600'
					}`
				)
			);
			setTextStyle(tw('text-white text-base font-medium'));
		} else if (size === 'xl') {
			setButtonStyle(
				tw(
					`flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm ${
						props.disabled ? 'bg-gray-400' : 'bg-indigo-600'
					}`
				)
			);
			setTextStyle(tw('text-white text-base font-medium'));
		}
	}, [size, props.disabled]);

	return (
		<>
			<TouchableOpacity style={buttonStyle} onPress={onPress} {...props}>
				<Text style={textStyle}>{title}</Text>
			</TouchableOpacity>
		</>
	);
};

export default Primary;
