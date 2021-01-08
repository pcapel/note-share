const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'note_share.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
