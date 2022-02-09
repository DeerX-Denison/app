module.exports = {
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.json',
		},
	},
	preset: 'react-native',
	testRegex: '.*\\.test\\.tsx',
	rootDir: 'src',
	resetMocks: false,
	moduleNameMapper: {
		'.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
			'identity-obj-proxy',
	},
	setupFiles: ['./setupTest.tsx'],
};
