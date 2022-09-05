import { fn } from '@firebase.config';
import { useEffect } from 'react';

export const useHealth = () => {
	useEffect(() => {
		try {
			fn.httpsCallable('health')();
			console.log('ok');
		} catch (error) {
			console.error(error);
		}
	}, []);
};
