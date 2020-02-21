const path = require('path');
// const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: {app: './src/js/app.js'},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: '/\.js$/',
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['es2015']
						}
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
				]
			},
			{
				test: /\.html$/,
				use: ['html-loader']
			},
			{
				test: /\.(jpg|png)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',

							esModule: false,

							outputPath: 'img/',
							publicPath: 'img/'
						}
					}
				]
			},
			{
				test: /\.html/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',

							esModule: false,

						}
					}
				],
				exclude: path.resolve(__dirname, 'src/index.html')
			}
		]
	},
	plugins: [
		// new webpack.ProvidePlugin({
		// 	$: 'jquery',
		// 	jQuery: 'jquery'
		// }),
		new MiniCssExtractPlugin({
			// filename: 'main.css'
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/index.html'
		}),
		// new HtmlWebpackPlugin({
		// 	filename: "users.html",
		// 	template: 'src/users.html',
		// 	chunks: ['app']
		// }),
		new CleanWebpackPlugin({
			cleanAfterEveryBuildPatterns: ['dist']
		})
	],
};

