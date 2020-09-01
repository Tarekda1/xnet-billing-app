const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const srcPath = path.join(__dirname, 'public');
const includePaths = [ srcPath ];

module.exports = {
	mode: 'development',
	entry: [ '@babel/polyfill', './src/index.js' ],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: './js/bundle.js',
		publicPath: '/'
	},
	stats: { errorDetails: true },
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.less$/,
				use: [ { loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'less-loader' } ]
			},
			{
				test: /\.css$/,
				use: [ { loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'less-loader' } ]
			},
			{
				test: /\.(jpe?g|gif|png|svg)$/i,
				use: [
					{
						loader: 'file-loader'
					}
				]
			}
		]
	},
	resolve: {
		mainFiles: [ 'index', 'Index' ],
		extensions: [ '.js', '.jsx' ],
		alias: {
			'@': path.resolve(__dirname, 'src/'),
			'#': path.resolve(__dirname, 'public/')
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html'
		})
	],
	devServer: {
		publicPath: '/',
		historyApiFallback: true
	},
	externals: {
		// global app config object
		config: JSON.stringify({
			apiUrl: 'http://localhost:4000'
		})
	}
};
