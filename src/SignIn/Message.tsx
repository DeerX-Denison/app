import { TIME_TO_RESEND_SIGNIN_EMAIL } from '@Constants';
import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface Props {
	setEmailSent: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Utility component to display message to user when they clicked send signin link thru email
 */
const Message: FC<Props> = ({ setEmailSent }) => {
	const [timeRemain, setTimeRemain] = useState<number>(
		TIME_TO_RESEND_SIGNIN_EMAIL
	);
	useEffect(() => {
		const interval = setInterval(() => {
			if (timeRemain > 0) {
				setTimeRemain(timeRemain - 1);
			} else {
				setEmailSent(false);
			}
		}, 1000);
		return () => clearInterval(interval);
	});

	return (
		<>
			<View>
				<Text>
					Email sent. Try again in {timeRemain} seconds. This is a temporary
					message, it will be reworded better later.
				</Text>
			</View>
		</>
	);
};

export default Message;
