var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'app'),
    entry: './entry',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [/*new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }), */new CopyWebpackPlugin([{
        from: 'index.html'
    }])],
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: 'node_modules',
            loader: 'babel',
            query: {
                presets: ['es2015'],
                compact: false
            }
        }]
    }
};
