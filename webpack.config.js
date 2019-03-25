// webpack v4
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
module.exports = {
  entry: { main: './src/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 9000,
    contentBase: path.resolve(__dirname, 'dist'),
    open: true,
    compress: true
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.sass$/,
        use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },

      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        include: [
          path.resolve(__dirname, 'src/fonts/')
        ],
        use: [
          {
            loader: 'file-loader?name=./src/fonts/[name]/[name].[ext]'
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: [
          path.resolve(__dirname, 'src/img/')
        ],
        use: [
          'file-loader?name=./src/img/[name].[ext]'
        ]
      },
      {
        test: /\.pug$/,
        use:  ['html-loader', 'pug-html-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin('dist', {} ),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.pug',
      filename: 'index.html'
    }),
    new WebpackMd5Hash()
  ]
};