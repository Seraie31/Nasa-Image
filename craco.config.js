const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      process: "process/browser"
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: 'process/browser'
        })
      ]
    },
    configure: (webpackConfig) => {
      if (!webpackConfig.resolve) {
        webpackConfig.resolve = {};
      }
      if (!webpackConfig.resolve.fallback) {
        webpackConfig.resolve.fallback = {};
      }

      Object.assign(webpackConfig.resolve.fallback, {
        buffer: require.resolve('buffer/'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert/'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url/'),
        process: require.resolve('process/browser')
      });

      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }

      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(process.env)
        })
      );

      return webpackConfig;
    }
  }
};
