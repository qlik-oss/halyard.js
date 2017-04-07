const path = require('path');
const Webpack = require('webpack');

const outputName = 'halyard';
const srcDir = path.resolve(__dirname, 'src');
const entryPoint = path.resolve(srcDir, 'halyard');
const outputPath = path.resolve(__dirname, 'dist');


function createConfig(isDebug) {
  const config = {
    entry: entryPoint,
    output: {
      path: outputPath,
      filename: `${outputName}.js`,
      library: outputName,
      libraryTarget: 'umd',
    },
    module: {
      loaders: [{
        test: /\.js$/,
        include: [srcDir],
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      }],
    },
    devtool: 'source-map',
    plugins: [
      new Webpack.NormalModuleReplacementPlugin(/superagent|q/, (result) => {
        if (result.request === 'superagent') {
          result.request = 'empty-module';
        }
      }),
    ],
  };

  if (isDebug) {
    config.debug = true;
  } else {
    config.output.filename = `${outputName}.min.js`;
    config.plugins.push(new Webpack.optimize.UglifyJsPlugin());
  }

  return config;
}

function createEnigmaMixinConfig(isDebug) {
  const config = {
    entry: path.resolve(srcDir + '/enigma-mixin/', 'halyard-enigma-mixin'),
    output: {
      path: outputPath,
      filename: 'halyard-enigma-mixin.js',
      library: 'halyard-enigma-mixin',
      libraryTarget: 'umd',
    },
    module: {
      loaders: [{
        include: [srcDir],
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      }],
    },
    devtool: 'source-map',
    plugins: [
      new Webpack.NormalModuleReplacementPlugin(/superagent|q/, (result) => {
        if (result.request === 'superagent') {
          result.request = 'empty-module';
        }
      }),
    ],
  };

  if (isDebug) {
    config.debug = true;
  } else {
    config.output.filename = 'halyard-enigma-mixin.min.js';
    config.plugins.push(new Webpack.optimize.UglifyJsPlugin());
  }

  return config;
}

module.exports = [
  createConfig(true),
  createConfig(false),
  createEnigmaMixinConfig(true),
  createEnigmaMixinConfig(false),
];
