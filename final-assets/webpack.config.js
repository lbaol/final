const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: {
        'index' :__dirname + "/src/page/index/enter.js",
        'detail' :__dirname + "/src/page/detail/enter.js",
        'alert':__dirname + "/src/page/alert/enter.js",
        'record':__dirname + "/src/page/record/enter.js",
        'setting':__dirname + "/src/page/setting/enter.js",
        'test':__dirname + "/src/page/test/enter.js"
    },
    output: {
        path: __dirname + "/build",//打包后的文件存放的地方
        filename: "[name].js"//打包后输出文件的文件名
    },
    resolve: {
        modules: [
            path.resolve('./src'),
            path.resolve('./node_modules')
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: "./public",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true ,//实时刷新
        hot: true,
        port:8000
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader:'babel-loader',
                exclude: /node_modules/
            }, 
            {
                test: /(\.css)$/,
                exclude: /^node_modules$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                  })
            }, 
            {
                test: /(\.scss)$/,
                exclude: /^node_modules$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader"
                  })
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: false
          }),
        new ExtractTextPlugin("[name].css"),
        new webpack.HotModuleReplacementPlugin()//热加载插件
    ]
};
