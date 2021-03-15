const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '/.env'),
});

const HOME_DATE = process.env.HOME_DATE;
const MEDIA_PATH = process.env.MEDIA_PATH;
const FILE_TYPE = process.env.FILE_TYPE;

const HTMLS = ['slider', 'home'];

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    publicPath: '/',
    path: path.resolve(__dirname, './build'),
    clean: true,
  },
  devServer: {
    open: true,
    port: 3500,
    liveReload: true,
    openPage: `${HOME_DATE}/${HOME_DATE}.html`,
  },
  module: {
    rules: [
      // REPLACE STRINGS
      {
        test: /.pug$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: /@HOME_DATE@/g, replace: HOME_DATE },
            { search: /@MEDIA_PATH@/g, replace: MEDIA_PATH },
            { search: /@FILE_TYPE@/g, replace: FILE_TYPE },
            { search: /@SRC@/g, replace: 'src' },
            { search: /@SRCSET@/g, replace: 'srcset' },
          ],
        },
      },
      // HTML
      {
        test: /\.pug/,
        use: [
          { loader: 'html-loader' },
          {
            loader: 'pug-html-loader',
          },
          // {
          //   loader: 'pug-html-info-loader',
          //   options: {
          //     data: {
          //       HOME_DATE,
          //       MEDIA_PATH,
          //       FILE_TYPE,
          //     }, // set of data to pass to the pug render.
          //     basePath: path.resolve(__dirname, 'src'),
          //     // base folder path for local variables.
          //   },
          // },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `${HOME_DATE}/${HOME_DATE}.html`,
      template: `./src/pug/index.pug`,
      inject: false,
      minify: false,
    }),
    // ...HTMLS.map(
    //   (x) =>
    //     new HtmlWebpackPlugin({
    //       filename: `${HOME_DATE}/${x}-${HOME_DATE}.html`,
    //       template: `./src/pug/${x}.pug`,
    //       inject: false,
    //       minify: false,
    //     })
    // ),
    // new HtmlReplaceWebpackPlugin(
    //   {
    //     pattern: /@HOME_DATE@/g,
    //     replacement: date,
    //   },
    //   {
    //     pattern: /@MEDIA_PATH@/g,
    //     replacement: mediaPath,
    //   }
    // ),
    new BeautifyHtmlWebpackPlugin(),
  ],
};
