const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin');

const HOME_DATE = '20092021';

const isProduction =
  process.argv[process.argv.indexOf('--mode') + 1] ===
  'production';

const MEDIA_PATH = isProduction
  ? '//media.easy.cl/is/image/EasySA/'
  : `/assets/${HOME_DATE}/`;
const FILE_TYPE = isProduction ? '' : '.png';
const STAGE_URL = isProduction
  ? ''
  : 'https://stage1.easy.cl';

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
          { search: /@STAGE_URL@/g, replace: STAGE_URL },
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
    entry: `./src/${HOME_DATE}.js`,
    output: {
      filename: `${HOME_DATE}.js`,
      publicPath: '/',
      path: path.resolve(__dirname, './build'),
      clean: true,
    },
    devServer: {
      port: 3500,
      liveReload: true,
      open: `${HOME_DATE}/${HOME_DATE}.html`,
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
