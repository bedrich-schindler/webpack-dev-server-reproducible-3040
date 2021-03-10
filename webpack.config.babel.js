const Path = require('path');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MAX_OUTPUT_SIZE_KB = 1750000;

module.exports = (env, argv) => {
  const modeArgument = argv.mode;
  const productionServerArgument = argv.env.productionServer;
  let headers = {};

  if (productionServerArgument && modeArgument === 'production') {
    headers = {
      'Content-Security-Policy': 'default-src \'self\' data: \'unsafe-inline\'',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'deny',
      'X-Powered-By': 'ra2-webpack',
      'X-XSS-Protection': '1; mode=block',
    };
  }

  return ({
    devServer: {
      headers,
      historyApiFallback: true,
      host: '0.0.0.0',
      https: modeArgument === 'production',
      static: Path.join(__dirname, 'public'),
    },
    devtool: modeArgument === 'development'
      ? 'eval-cheap-module-source-map'
      : false,
    entry: {
      bundle: [
        Path.join(__dirname, 'src/main.jsx'),
      ],
    },
    module: {
      rules: [
        {
          resolve: {
            fullySpecified: false,
          },
          test: /\.m?js/,
        },
        {
          exclude: /node_modules/,
          include: Path.join(__dirname, 'src'),
          test: /\.(js|jsx)$/,
          use: [{ loader: 'babel-loader' }],
        },
      ],
    },
    output: {
      filename: '[name].js?v=__ASSET_VERSION__',
      path: Path.join(__dirname, 'public/generated'),
      publicPath: '/generated/',
    },
    performance: {
      hints: (modeArgument === 'production' && !productionServerArgument) ? 'error' : false,
      maxAssetSize: MAX_OUTPUT_SIZE_KB,
      maxEntrypointSize: MAX_OUTPUT_SIZE_KB,
    },
    plugins: [
      new HtmlWebpackPlugin({
        cspPlugin: {
          enabled: modeArgument === 'production',
          hashEnabled: {
            'script-src': true,
            'style-src': false,
          },
          nonceEnabled: {
            'script-src': true,
            'style-src': false,
          },
          policy: {
            'base-uri': "'self'",
            'default-src': "'self'",
            'frame-src': "'none'",
            'img-src': ["'self'", 'data:'],
            'media-src': "'none'",
            'object-src': "'none'",
            'script-src': ["'self'"],
            'style-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          },
        },
        filename: Path.join(__dirname, 'public/index.html'),
        minify: false,
        template: Path.join(__dirname, 'assets/index.html'),
      }),
      new CspHtmlWebpackPlugin(),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['src', 'node_modules'],
    },
  });
};
