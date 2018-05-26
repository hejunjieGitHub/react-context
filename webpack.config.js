/**
 * 测试环境
 */
var webpack = require('webpack')
var path = require("path")
var htmlWebpackPlugin=require('html-webpack-plugin');//第三方插件使用需要引入

var ExtractTextPlugin = require("extract-text-webpack-plugin")

var CleanWebpackPlugin = require("clean-webpack-plugin")

var proxy = require("http-proxy-middleware")

var CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports={
	  entry:"./src/app.js",
      output:{
            path:__dirname+"/dist",
            filename:"index_[hash].js"
	  },
	  devtool:"source-map",
		plugins:[//因为是引入的第三方差插件，所以需要在plugins数组中配置
		
			new htmlWebpackPlugin({
				template:'./src/index.html', //数据源
				filename:'index.html' //生成的文件名称
			}),
			new ExtractTextPlugin("styles."+Math.random().toString().substring(2)+".css",
				{allChunks:true} //片段
			),
			new webpack.DefinePlugin({
				NODE_ENV : JSON.stringify("test")
			}),
			new webpack.ProvidePlugin({ //全局配置jquery
				$: 'jquery',
				jQuery: 'jquery'
			}),
			new CopyWebpackPlugin([{
				from:__dirname+"/src/assets",
				to:__dirname+"/dist/assets"
			}])
	],
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
