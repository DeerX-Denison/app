import { useEffect } from 'react';

type UseInitTextFn = (
	initText: string | undefined,
	setInputText: React.Dispatch<React.SetStateAction<string>>
) => void;
const useInitText: UseInitTextFn = (initText, setInputText) => {
	useEffect(() => {
		if (initText) {
			setTimeout(() => {
				setInputText(initText);
			}, 50);
		}
	}, [initText]);
};

export default useInitText;
