import { useEffect, useState } from 'react';

/**
 * custom hook to get current time
 */
const useCurrentTime = () => {
	const [curTime, setCurTime] = useState<Date>(new Date());
	useEffect(() => {
		const intervalId = setInterval(() => setCurTime(new Date()), 1000);
		return () => clearInterval(intervalId);
	}, []);
	return { curTime };
};

export default useCurrentTime;
