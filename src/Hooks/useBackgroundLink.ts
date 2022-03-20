import { db, dynamicLinks } from '@firebase.config';
import logger from '@logger';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { TabsParamList, ThreadPreviewDataSv } from 'types';
import config from '../config.json';
import useParseLink from './useParseLink';

export type UseBackgroundLink = (
	navigationRef: NavigationContainerRefWithCurrent<TabsParamList>
) => void;

/**
 * handles dynamic link from firebase in the background (when app first open)
 */
const useBackgroundLink: UseBackgroundLink = async (navigationRef) => {
	const link = await dynamicLinks.getInitialLink();
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
								const threadPreviewData = docSnap.data() as ThreadPreviewDataSv;
								navigationRef.navigate('Inbox', {
									screen: 'Messages',
									params: {
										members: threadPreviewData.members,
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
};
export default useBackgroundLink;
