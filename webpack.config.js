const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

let mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const devtool = devMode ? 'source-map' : undefined;
const target = devMode ? 'web' : 'browserslist';

mode = (mode !== 'build') ? mode : 'development',

module.exports = {
   mode,
   target,
   devtool,
   entry: path.resolve(__dirname, 'src', 'main.js'),
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: path.resolve(__dirname, 'src', 'index.html'),
         inject: 'body'
      }),
      new MiniCssExtractPlugin({
         filename: '[name].[contenthash].css'
      }),
   ],
   module: {
      rules: [
         {
            test: /\.html$/i,
            loader: "html-loader",
         },
         {
            test: /\.scss$/i,
            use: [
              devMode ? "style-loader" : MiniCssExtractPlugin.loader,
              "css-loader",
               {
                  loader: "postcss-loader",
                  options: {
                     postcssOptions: {
                        plugins: [
                           ["postcss-preset-env",],
                        ],
                     },
                  },
               },
              "sass-loader",
            ],
         },
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
               options: {
                  presets: [
                     ['@babel/preset-env']
                  ]
               }
            }
         },
         { 
            test: /\.ts$/, 
            loader: "ts-loader" 
         },
         {
            test: /\.(png|jpg|webp)$/,
            type: 'asset/resource',
            generator: {
               filename: 'img/[name].[ext]'
            }
         },
         {
            test: /\.mp3$/,
            type: 'asset/resource',
            generator: {
               filename: 'audio/[name].[ext]'
            }
         }
      ],
   },
   devServer: {
      hot: true,
      open: true
   },
   resolve: {
      extensions: ['.ts', '.js', '.png', '.jpg', '.mp3', '.html', '.scss'],
   },
}