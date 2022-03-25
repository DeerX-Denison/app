import { useEffect, useState } from 'react';
import { SeenIcons, ThreadData } from 'types';

export type UseMsgWithSeenIconIds = (
	seenIcons: SeenIcons | undefined,
	threadData: ThreadData | undefined
) => {
	msgsWithSeenIconsIds: string[];
	setMsgsWithSeenIconsIds: React.Dispatch<React.SetStateAction<string[]>>;
};

/**
 * custom hook to parse seenIcons and threadData into msgsWithSeenIconsIds
 */
const useMsgWithSeenIconIds: UseMsgWithSeenIconIds = (
	seenIcons,
	threadData
) => {
	const [msgsWithSeenIconsIds, setMsgsWithSeenIconsIds] = useState<string[]>(
		[]
	);
	useEffect(
		() => {
			if (threadData) {
				const msgsWithSeenIconsIds: string[] = [];
				const msgIds = threadData.messages.map((x) => x.id);
				for (const nonSelfUid in seenIcons) {
					if (typeof seenIcons[nonSelfUid] === 'string') {
						if (msgIds.includes(seenIcons[nonSelfUid] as string)) {
							msgsWithSeenIconsIds.push(seenIcons[nonSelfUid] as string);
						}
					}
				}
				setMsgsWithSeenIconsIds(msgsWithSeenIconsIds);
			}
		},
		// threadData is intentionally left out because seenIcons already has
		// threadData as dependency
		[seenIcons]
	);

	return { msgsWithSeenIconsIds, setMsgsWithSeenIconsIds };
};

export default useMsgWithSeenIconIds;
