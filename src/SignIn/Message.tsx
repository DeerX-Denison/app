import { TIME_TO_RESEND_SIGNIN_EMAIL } from '@Constants';
import { useCurrentTime } from '@Hooks';
import tw from '@tw';
import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface Props {
	setEmailSent: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Utility component to display message to user when they clicked send signin link thru email
 */
const Message: FC<Props> = ({ setEmailSent }) => {
	const { curTime } = useCurrentTime();
	const [initTime] = useState<Date>(curTime);
	const [timeRemain, setTimeRemain] = useState<number>(
		TIME_TO_RESEND_SIGNIN_EMAIL
	);
	useEffect(() => {
		const milliElapsed = curTime.getTime() - initTime.getTime();
		const secondElapsed = new Date(milliElapsed).getSeconds();
		setTimeRemain(TIME_TO_RESEND_SIGNIN_EMAIL - secondElapsed);
	}, [curTime]);
	useEffect(() => {
		if (timeRemain <= 0) {
			setEmailSent(false);
		}
	}, [timeRemain]);
	return (
		<>
			<View style={tw('flex flex-1 flex-col')}>
				<View style={tw('justify-center items-center')}>
					<Text style={tw('text-s-lg font-semibold p-4')}>
						Sign In Email Sent
					</Text>
				</View>
				<Text style={tw('text-s-md px-8 py-1 font-bold text-denison-red')}>
					Please Open Sign In Email On This Device
				</Text>
				<Text style={tw('text-s-md px-8 py-1')}>
					If you have not received your email
				</Text>
				<Text style={tw('text-s-md px-8 py-1')}>
					You can try again in {timeRemain} seconds.
				</Text>
			</View>
		</>
	);
};

export default Message;
