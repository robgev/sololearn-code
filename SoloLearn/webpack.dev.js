var path = require('path');

var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

console.log("@@@@@@@@@ USING DEVELOPMENT @@@@@@@@@@@@@@@");

module.exports = {

    devtool: 'source-map',

    entry: {
        'app': './app/Scripts/index.js' // JiT compilation
    },

    output: {
        path: path.join(__dirname, "wwwroot"),
        filename: 'dist/[name].bundle.js',
        publicPath: "/"
    },
   
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.html']
    },

    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        outputPath: path.join(__dirname, 'wwwroot/')
    },

    module: {
        rules: [
            {
                exclude: /(node_modules|bower_components)/,
                test: /\.jsx?$/,
                loaders: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['react', 'env', 'stage-0']
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|ico|woff|woff2|ttf|svg|eot)$/i,
                exclude: /node_modules/,
                loader: "file-loader?name=/assets/[name].[ext]"
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.html$/,
                loader: 'raw'
            },
            {
                test: /\.json$/,
                loaders: ["json-loader"]
            }
        ],
        exprContextCritical: false
    },

    plugins: [
        new CleanWebpackPlugin(
            [
                './wwwroot/dist',
                './wwwroot/fonts',
                './wwwroot/assets'
            ]
        ),

        //new HtmlWebpackPlugin({
        //    filename: 'Index.html',
        //    inject: 'body',
        //    template: 'src/Views/Home/Index.cshtml'
        //}),

        //new HtmlWebpackPlugin({
        //    filename: 'Index.html',
        //    inject: 'body',
        //    template: 'src/Index.html'
        //}),

        new CopyWebpackPlugin([
            { from: './app/images/*.*', to: "assets/", flatten: true }
        ])
    ],
};

