const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

console.log('@@@@@@@@@ USING PRODUCTION @@@@@@@@@@@@@@@');

module.exports = {

	entry: {
		app: './angular2App/main-aot.ts', // AoT compilation
	},

	output: {
		path: './wwwroot/',
		filename: 'dist/[name].[hash].bundle.js',
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
				test: /\.ts$/,
				loaders: [
					'awesome-typescript-loader',
				],
			},
			{
				test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader: 'file-loader?name=fonts/[name].[ext]',
			},
			{
				test: /\.(png|jpg|gif|ico)$/i,
				loader: 'file-loader?name=/assets/[name].[ext]',
			},
			{
				test: /\.css$/,
				loader: [ 'style', 'css' ],
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loaders: [ 'style', 'css', 'sass' ],
			},
			{
				test: /\.html$/,
				loader: 'raw',
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
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
			output: {
				comments: false,
			},
			sourceMap: false,
		}),

		new HtmlWebpackPlugin({
			filename: 'index.html',
			inject: 'body',
			template: 'angular2App/index.html',
		}),

		new CopyWebpackPlugin([
			{ from: './angular2App/images/*.*', to: 'assets/', flatten: true },
		]),
	],
};
