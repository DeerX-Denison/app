import { fn } from '@firebase.config';
import { useEffect } from 'react';

export const useHealth = () => {
	useEffect(() => {
		(async () => {
			try {
				await fn.httpsCallable('health')();
				console.log('ok');
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);
};
