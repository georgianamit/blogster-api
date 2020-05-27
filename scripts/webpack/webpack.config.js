const path = require('path')
const webpack = require('webpack')
const StartServerPlugin = require('start-server-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const dist = path.resolve(__dirname, '..', '..', 'dist')
const plugins = [new webpack.NamedModulesPlugin(), new CleanWebpackPlugin({})]
const { NODE_ENV } = process.env

const isProduction =
  typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production'
const mode = isProduction ? 'production' : 'development'
const entry = isProduction
  ? ['./src/index.ts']
  : ['webpack/hot/poll?1000', './src/index.ts']

module.exports = {
  entry,
  mode,
  target: 'node',
  stats: 'minimal',
  watch: !isProduction,
  devtool: 'inline-source-map',
  output: {
    filename: 'index.js',
    path: dist,
    hotUpdateChunkFilename: '.hot/[id].[hash].hot-update.js',
    hotUpdateMainFilename: '.hot/[hash].hot-update.json',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
  plugins: isProduction
    ? [...plugins]
    : [
        ...plugins,
        new StartServerPlugin({
          name: 'index.js',
          signal: false,
          nodeArgs: ['--inspect'],
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
      ],
  externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],
  node: {
    __dirname: false,
    __filename: false,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
}
