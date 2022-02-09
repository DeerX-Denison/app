import React, { FC } from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface Props {}

const Text: FC<Props & TextInputProps> = ({ ...props }) => {
	return (
		<>
			<TextInput {...props} />
		</>
	);
};

export default Text;
