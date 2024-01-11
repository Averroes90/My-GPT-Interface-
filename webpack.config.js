const path = require('path');
const { VueLoaderPlugin } = require('vue-loader'); // Make sure vue-loader is up-to-date
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './static/frontend_assets/js/script.js',
    vue: './static/frontend_assets/js/vueApp.js'
  },
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'static', 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/dist/'
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader' // Make sure this is up-to-date for Vue 3
      }
    ]
  },
  optimization: {
    moduleIds: 'named',
    runtimeChunk: 'single'
  },

  devServer: {
    static: './templates/',  // where your index.html file is located
    port: 8080,  // port to run the dev server on
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        logLevel: 'debug',
        hot:true
      },
    },
  },

  plugins: [
    new VueLoaderPlugin(), // Make sure this is up-to-date for Vue 3
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
