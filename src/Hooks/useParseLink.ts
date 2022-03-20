import queryString from 'query-string';
export type UseParseLink = (link: string) => {
	hostname: string;
	path: string;
	params: {
		[key: string]: string | (string | null)[] | null;
	};
};

const useParseLink: UseParseLink = (link) => {
	let trimmedLink: string;
	if (link.startsWith('https://')) {
		trimmedLink = link.substring(8, link.lastIndexOf('?'));
	} else if (link.startsWith('http://')) {
		trimmedLink = link.substring(7, link.lastIndexOf('?'));
	} else {
		throw `Invalid link: ${link}`;
	}
	const linkSection = trimmedLink.split('/');
	const hostname = linkSection[0];
	const path = linkSection[1];
	const params = queryString.parseUrl(link).query;
	return { hostname, path, params };
};

export default useParseLink;
