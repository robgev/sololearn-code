const path = require('path');

const webpack = require('webpack');
require('babel-polyfill');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

console.log('@@@@@@@@@ USING DEVELOPMENT @@@@@@@@@@@@@@@');

module.exports = {

	devtool: 'source-map',

	entry: {
		app: [ 'babel-polyfill', './app/Scripts/index.js' ],
	},

	output: {
		path: path.join(__dirname, 'wwwroot'),
		filename: 'dist/[name].bundle.js',
		publicPath: '/',
	},

	resolve: {
		extensions: [ '.ts', '.js', '.json', '.css', '.scss', '.html' ],
		alias: {
			actions: path.resolve(__dirname, 'app/Scripts/actions'),
			assets: path.resolve(__dirname, 'wwwroot/assets'),
			api: path.resolve(__dirname, 'app/Scripts/api'),
			components: path.resolve(__dirname, 'app/Scripts/components'),
			config: path.resolve(__dirname, 'app/Scripts/config'),
			constants: path.resolve(__dirname, 'app/Scripts/constants'),
			containers: path.resolve(__dirname, 'app/Scripts/containers'),
			defaults: path.resolve(__dirname, 'app/Scripts/defaults'),
			reducers: path.resolve(__dirname, 'app/Scripts/reducers'),
			styles: path.resolve(__dirname, 'app/Scripts/styles'),
			utils: path.resolve(__dirname, 'app/Scripts/utils'),
			i18n: path.resolve(__dirname, 'app/Scripts/i18n.js'),
			selectors: path.resolve(__dirname, 'app/Scripts/selectors'),
			texts: path.resolve(__dirname, 'app/Scripts/defaults/texts.js'),
		},
	},

	devServer: {
		historyApiFallback: true,
		stats: 'minimal',
		outputPath: path.join(__dirname, 'wwwroot/'),
	},

	module: {
		rules: [
			{
				exclude: /(node_modules|bower_components)/,
				test: /\.(jsx|js)?$/,
				loaders: [
					{
						loader: 'babel-loader',
						query: {
							plugins: [
								'transform-decorators-legacy',
							],
							presets: [ 'flow', 'react', 'env', 'stage-0' ],
						},
					},
				],
			},
			{
				test: /\.(png|jpg|gif|ico|woff|woff2|ttf|svg|eot)$/i,
				exclude: /node_modules/,
				loader: 'file-loader?name=/assets/[name].[ext]',
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loaders: [ 'style-loader', 'css-loader', 'sass-loader' ],
			},
			{
				test: /\.html$/,
				loader: 'raw',
			},
			{
				test: /\.json$/,
				loaders: [ 'json-loader' ],
			},
		],
		exprContextCritical: false,
	},

	plugins: [
		new CleanWebpackPlugin([
			'./wwwroot/dist',
			'./wwwroot/fonts',
			'./wwwroot/assets',
		]),

		// new HtmlWebpackPlugin({
		//    filename: 'Index.html',
		//    inject: 'body',
		//    template: 'src/Views/Home/Index.cshtml'
		// }),

		// new HtmlWebpackPlugin({
		//    filename: 'Index.html',
		//    inject: 'body',
		//    template: 'src/Index.html'
		// }),

		new CopyWebpackPlugin([
			{ from: './app/images/*.*', to: 'assets/', flatten: true },
			{ from: './app/translations/*.*', to: 'assets/translations', flatten: true }
		]),
	],
};
