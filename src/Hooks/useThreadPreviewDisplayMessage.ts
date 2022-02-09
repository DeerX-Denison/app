import { DEFAULT_LATEST_MESSAGE } from '@Constants';
import { useEffect, useState } from 'react';

/**
 * custom hook to calculate display message for thread previews
 */
const useThreadPreviewDisplayMessage = (
	latestMessage: string | null | undefined
) => {
	const [displayMessage, setDisplayMessage] = useState<string>(
		DEFAULT_LATEST_MESSAGE
	);
	useEffect(() => {
		if (latestMessage) {
			setDisplayMessage(latestMessage);
		}
	}, [latestMessage]);
	return { displayMessage };
};

export default useThreadPreviewDisplayMessage;
