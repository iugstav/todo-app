require('dotenv').config();

const path = require('path')
const Dotenv = require('dotenv-webpack');


module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, '/src/styles')],
  },

  webpack: config => {
    config.plugins = config.plugins || []
    config.plugins = [
      ...config.plugins,
      // Read the .env file
      new Dotenv({
        /* eslint-disable no-undef */
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    ]

    if (config.resolve.alias) {
      delete config.resolve.alias.react;
      delete config.resolve.alias["react-dom"];
    }

    return config;
  }
}

