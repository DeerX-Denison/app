import { useEffect, useState } from 'react';

/**
 * custom hook to calculate display time for messages
 */
const useMessageDisplayTime = (oldTime: Date | undefined, curTime: Date) => {
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

			const day_hour_minute_ampm = `${
				days[oldTime.getDay()]
			}, ${hour_minute_ampm}`;

			const month_date_hour_minute_ampm = `${
				months[curTime.getMonth()]
			} ${curTime.getDate()}, ${hour_minute_ampm}`;

			const month_date_year_hour_minute_ampm = `${
				months[curTime.getMonth()]
			} ${curTime.getDate()} ${curTime.getFullYear()}, ${hour_minute_ampm}`;

			if (curTime.getFullYear() === curTime.getFullYear()) {
				if (curTime.getMonth() === oldTime.getMonth()) {
					if (curTime.getDate() === oldTime.getDate()) {
						if (curTime.getHours() === oldTime.getHours()) {
							if (curTime.getMinutes() === oldTime.getMinutes()) {
								// same year, month, date, hour, minute
								setDisplayTime('Now');
							} else if (curTime.getMinutes() - oldTime.getMinutes() < 20) {
								// same year, month, date, hour, < 20 minutes apart
								setDisplayTime(
									`${curTime.getMinutes() - oldTime.getMinutes()} min ago`
								);
							} else {
								// same year, month, date, hour, >= 5 minutes apart
								setDisplayTime(`Today, ${hour_minute_ampm}`);
							}
						} else {
							// same year, month, date, different hour
							setDisplayTime(`Today, ${hour_minute_ampm}`);
						}
					} else if (curTime.getDate() - oldTime.getDate() === 1) {
						// same year, month, 1 day behind
						setDisplayTime(`Yesterday, ${hour_minute_ampm}`);
					} else if (curTime.getDate() - oldTime.getDate() < 7) {
						// same year, month, < 7 day behind
						setDisplayTime(day_hour_minute_ampm);
					} else {
						// same year, month, >= 7 days
						setDisplayTime(month_date_hour_minute_ampm);
					}
				} else {
					// same year, different month
					setDisplayTime(month_date_hour_minute_ampm);
				}
			} else {
				// different year
				setDisplayTime(month_date_year_hour_minute_ampm);
			}
		}
	}, [curTime]);
	return { displayTime };
};

export default useMessageDisplayTime;
