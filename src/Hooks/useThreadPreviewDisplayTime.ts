import { useEffect, useState } from 'react';

/**
 * custom hook to calculate display time for thread previews
 */
const useThreadPreviewDisplayTime = (
	oldTime: Date | undefined,
	curTime: Date
) => {
	const [displayTime, setDisplayTime] = useState<string | undefined>();
	useEffect(() => {
		const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];
		if (oldTime) {
			const hour_minute_ampm = `${oldTime.getHours() % 12}:${
				oldTime.getMinutes() >= 10
					? oldTime.getMinutes()
					: `0${oldTime.getMinutes()}`
			} ${oldTime.getHours() < 12 ? 'am' : 'pm'}`;

			const month_date = `${months[oldTime.getMonth()]} ${oldTime.getDate()}`;

			const month_date_year = `${
				months[oldTime.getMonth()]
			} ${oldTime.getDate()}, ${oldTime.getFullYear()}`;

			if (curTime.getFullYear() === oldTime.getFullYear()) {
				if (curTime.getMonth() === oldTime.getMonth()) {
					if (curTime.getDate() === oldTime.getDate()) {
						if (curTime.getHours() === oldTime.getHours()) {
							if (curTime.getMinutes() === oldTime.getMinutes()) {
								// same year, month, date, hour, minute
								setDisplayTime('Now');
							} else if (curTime.getMinutes() - oldTime.getMinutes() < 20) {
								// same year, month, date, hour, < 20 minutes apart
								setDisplayTime(
									`${curTime.getMinutes() - oldTime.getMinutes()} min`
								);
							} else {
								// same year, month, date, hour, >= 5 minutes apart
								setDisplayTime(hour_minute_ampm);
							}
						} else {
							// same year, month, date, different hour
							setDisplayTime(hour_minute_ampm);
						}
					} else if (curTime.getDate() - oldTime.getDate() === 1) {
						// same year, month, 1 day behind
						setDisplayTime('Yesterday');
					} else if (curTime.getDate() - oldTime.getDate() < 7) {
						// same year, month, < 7 day behind
						setDisplayTime(days[oldTime.getDay()]);
					} else {
						// same year, month, >= 7 days
						setDisplayTime(month_date);
					}
				} else {
					// same year, different month
					setDisplayTime(month_date);
				}
			} else {
				// different year
				setDisplayTime(month_date_year);
			}
		}
	}, [curTime]);
	return { displayTime };
};

export default useThreadPreviewDisplayTime;
