import { db, dynamicLinks } from '@firebase.config';
import logger from '@logger';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { TabsParamList, ThreadPreviewDataSv } from 'types';
import config from '../config.json';
import useParseLink from './useParseLink';

export type UseBackgroundLink = (
	navigationRef: NavigationContainerRefWithCurrent<TabsParamList>
) => void;

export type HandleDynamicLink = (
	url: string,
	navigationRef: NavigationContainerRefWithCurrent<TabsParamList>
) => Promise<void>;

/**
 * handles url parsed from dynamic link
 */
const handleDynamicLink: HandleDynamicLink = async (url, navigationRef) => {
	const { hostname, path, params } = useParseLink(url);
	if (hostname === config.hostname) {
		if (path === 'threads') {
			if ('threadId' in params) {
				if (params.threadId && typeof params.threadId === 'string') {
					const docSnap = await db
						.collection('threads')
						.doc(params.threadId)
						.get();
					if (docSnap.exists) {
						const threadPreviewData = docSnap.data() as ThreadPreviewDataSv;
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
};

/**
 * handles dynamic link from firebase in the background (when app first open)
 */
const useBackgroundLink: UseBackgroundLink = (navigationRef) => {
	useEffect(() => {
		(async () => {
			const link = await dynamicLinks.getInitialLink();
			if (link) {
				if (link.url) {
					handleDynamicLink(link.url, navigationRef);
				}
			} else {
				const initialUrl = await Linking.getInitialURL();
				if (initialUrl) {
					const link = await dynamicLinks.resolveLink(initialUrl);
					if (link.url) {
						handleDynamicLink(link.url, navigationRef);
					}
				}
			}
		})();
	}, []);
};
export default useBackgroundLink;
