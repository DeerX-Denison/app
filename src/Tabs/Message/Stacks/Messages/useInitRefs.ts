import { useEffect } from 'react';
import { InputTextRef } from 'types';

type UseInitTextFn = (
	initRefs: InputTextRef[] | undefined,
	setRefs: React.Dispatch<React.SetStateAction<InputTextRef[]>>
) => void;
const useInitRef: UseInitTextFn = (initRefs, setInputRefs) => {
	useEffect(() => {
		if (initRefs && initRefs.length > 0) {
			setTimeout(() => {
				setInputRefs(initRefs);
			}, 50);
		}
	}, [initRefs]);
};

export default useInitRef;
