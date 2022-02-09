import React, { FC } from 'react';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';

const Select: FC<PickerSelectProps> = ({ ...props }) => {
	return (
		<>
			<RNPickerSelect {...props} />
		</>
	);
};

export default Select;
