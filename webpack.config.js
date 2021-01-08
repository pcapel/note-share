const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'note_share.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
