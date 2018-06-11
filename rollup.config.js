// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
// import nodeGlobals from 'rollup-plugin-node-globals';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import license from 'rollup-plugin-license';
import extend from 'extend';

const pkg = require('./package.json');

const createConfig = (overrides) => {
  const config = {
    output: {
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      resolve({ jsnext: true, preferBuiltins: false }),
      nodeBuiltins(),
      commonjs(),
      license({
        banner: `
        ${pkg.name} v${pkg.version}
        Copyright (c) ${new Date().getFullYear()} QlikTech International AB
        This library is licensed under MIT - See the LICENSE file for full details
      `,
      }),
      filesize(),
    ],
  };
  extend(true, config, overrides);
  if (process.env.NODE_ENV === 'production') {
    config.output.file = config.output.file.replace('.js', '.min.js');
    config.plugins.push(uglify());
  }
  return config;
};

const halyard = createConfig({
  input: 'src/halyard.js',
  output: {
    file: 'dist/halyard.js',
    name: 'halyard',
  },
});

const halyardEnigmaMixins = createConfig({
  input: 'src/enigma-mixin/halyard-enigma-mixin.js',
  output: {
    file: 'dist/halyard-enigma-mixin.js',
    name: 'halyard-enigma-mixin',
  },
});

export default [halyard, halyardEnigmaMixins];
