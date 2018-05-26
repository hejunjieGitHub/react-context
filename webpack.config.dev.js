/**
 * 本地，联调环境
 */
var webpack = require('webpack')
var path = require("path")
var htmlWebpackPlugin=require('html-webpack-plugin');//第三方插件使用需要引入

var ExtractTextPlugin = require("extract-text-webpack-plugin")

var CleanWebpackPlugin = require("clean-webpack-plugin")

var proxy = require("http-proxy-middleware")

var CopyWebpackPlugin = require("copy-webpack-plugin")

const apiMocker = require('webpack-api-mocker')
const port = 8080;

module.exports={
	  entry:"./src/app.js",
      output:{
            path:__dirname+"/dist",
            filename:"index_[hash].js"
	  },
	  devtool:"eval-source-map",
		plugins:[//因为是引入的第三方差插件，所以需要在plugins数组中配置
		
			new htmlWebpackPlugin({
				template:'./src/index.html', //数据源
				filename:'index.html' //生成的文件名称
			}),
			new ExtractTextPlugin("styles."+Math.random().toString().substring(2)+".css",
				{allChunks:true} //片段
			),
			new CleanWebpackPlugin(['dist']),
			new webpack.DefinePlugin({
				NODE_ENV : JSON.stringify("dev"),
				NODE_PORT : JSON.stringify(port)
			}),
			new webpack.ProvidePlugin({ //全局配置jquery,开发不需要import
				$: 'jquery',
				jQuery: 'jquery'
			}),
			// new CopyWebpackPlugin([{
			// 	from:__dirname+"/src/assets",
			// 	to:__dirname+"/dist/assets"
			// },{
			// 	from:__dirname+"/src/mock",
			// 	to:__dirname+"/dist/mock"
			// }]),
			new CopyWebpackPlugin([{
				from:__dirname+"/src/assets",
				to:__dirname+"/dist/assets"
			}]),
			// 热加载插件
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin(),
	],
	devServer: {
		inline: true,
		port: port,
		open:true,
		hot:true,
		historyApiFallback:true,
		// host:"0.0.0.0",
		clientLogLevel: "none",
		contentBase: path.join(__dirname, "dist"),
		overlay:{errors:true,warnings:false},
		before(app) { 
			apiMocker(app, path.resolve("mock/api.js"))
		},
		proxy: {
	        '/exchange': {
	          target: 'http://192.168.1.98:8080', //联调域名和端口
			  changeOrigin: true,
			  secure: false
			}
	     }
	},
	module:{
		loaders:[
			{test: /\.(png|jpg|jpeg|gif)$/, loader:  'file-loader?name=images/[hash].[ext]'},
			{test: /\.(svg|woff|woff2|ttf|eot)$/, loader:  'file-loader?name=fonts/[hash].[ext]'},
			{test:/\.css$/,loader:'style-loader!css-loader'},
			{
				test:/\.scss$/,
				loader:ExtractTextPlugin.extract({
					fallback:"style-loader",
					use:'css-loader?modules&localIdentName=[name]__[local]--[hash:base64:5]!sass-loader?sourceMap=true'
				})
			},
			{//编译js
				test:/\.js$/,
				loader:'babel-loader',
				options:{
					"presets":['es2015','react','stage-2'],
					"plugins": [
						["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }], // `style: true` 会加载 less 文件
						[
							"transform-runtime",
							{
							  "helpers": false,
							  "polyfill": false,
							  "regenerator": true,
							  "moduleName": "babel-runtime"
							}
						  ]
					]
				},
				exclude: /node_modules/
			}
		]
	}
}
