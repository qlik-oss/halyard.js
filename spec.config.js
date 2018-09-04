module.exports = {
  glob: ['./src/**/*.js'],
  package: './package.json',
  api: {
    name: 'halyard.js',
    stability: 'stable',
    properties: {
      'x-qlik-visibility': 'public',
      'x-qlik-stability': 'stable',
    },
  },
  output: {
    file: './docs/api-spec.json',
  },
};
