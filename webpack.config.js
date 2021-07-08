const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin');
// const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
// const dotenv = require('dotenv').config({
//   path: path.join(__dirname, '/.env'),
// });

const HOME_DATE = '12072021';

const isProduction =
  process.argv[process.argv.indexOf('--mode') + 1] === 'production';

const MEDIA_PATH = isProduction
  ? '//media.easy.cl/is/image/EasySA/'
  : `/assets/${HOME_DATE}/`;
const FILE_TYPE = isProduction ? '' : '.png';

const HTMLS = ['slider', 'home'];

const HTML = {
  test: /.pug$/,
  use: [
    {
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
    { loader: 'html-loader' },
    {
      loader: 'pug-html-loader',
    },
  ],
};

const config = (mode) => {
  return {
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
      rules: [HTML],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: `${HOME_DATE}/${HOME_DATE}.html`,
        template: `./src/pug/index.pug`,
        inject: false,
        minify: false,
      }),
      ...HTMLS.map(
        (x) =>
          new HtmlWebpackPlugin({
            filename: `${HOME_DATE}/${x}-${HOME_DATE}.html`,
            template: `./src/pug/${x}.pug`,
            inject: false,
            minify: false,
          })
      ),
      new BeautifyHtmlWebpackPlugin(),
    ],
  };
};
module.exports = (env, arvg) => config(arvg.mode);
