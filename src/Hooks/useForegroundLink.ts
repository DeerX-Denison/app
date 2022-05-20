import { db, dynamicLinks } from '@firebase.config';
import logger from '@logger';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { useEffect } from 'react';
import { TabsParamList, ThreadPreviewDataSv } from 'types';
import config from '../config.json';
import useParseLink from './useParseLink';

export type UseForegroundLink = (
	navigationRef: NavigationContainerRefWithCurrent<TabsParamList>
) => void;

/**
 * handles dynamic links from firebase when foreground (when app is open)
 */
const useForegroundLink: UseForegroundLink = (navigationRef) => {
	useEffect(() => {
		const unsubscribe = dynamicLinks.onLink(async (link) => {
			if (link) {
				if (link.url) {
					const { hostname, path, params } = useParseLink(link.url);
					if (hostname === config.hostname) {
						if (path === 'threads') {
							if ('threadId' in params) {
								if (params.threadId && typeof params.threadId === 'string') {
									const docSnap = await db
										.collection('threads')
										.doc(params.threadId)
										.get();
									if (docSnap.exists) {
										const threadPreviewData =
											docSnap.data() as ThreadPreviewDataSv;
										navigationRef.navigate('Inbox', {
											screen: 'Messages',
											params: {
												members: threadPreviewData.members,
												initRefs: undefined,
												initText: undefined,
											},
											initial: false,
										});
									} else {
										logger.error('Invalid threadId');
									}
								}
							}
						}
					}
				}
			}
		});
		return () => unsubscribe();
	}, []);
};
export default useForegroundLink;
