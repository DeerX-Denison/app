module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			[
				'module-resolver',
				{
					alias: {
						'@Components/Buttons': './src/Components/Buttons/index',
						'@Components/Carousel': './src/Components/Carousel/index',
						'@Components/Inputs': './src/Components/Inputs/index',
						'@Components/Payments': './src/Components/Payments/index',
						'@Components/Auth': './src/Components/Auth/index',
						'@Contexts': './src/Contexts/index',
						'@Hooks': './src/Hooks/index',
						'@Tabs': './src/Tabs/index',
						'@Constants': './src/Constants/index',
						'@tw': './src/tw',
						'@firebase.config': './src/firebase.config',
						'@logger': './src/logger',
						types: './src/types',
					},
				},
			],
		],
	};
};
