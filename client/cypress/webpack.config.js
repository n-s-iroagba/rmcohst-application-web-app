// cypress/webpack.config.js
const path = require("path");

module.exports = {
  resolve: {
    alias: {
      fdir: 'false', // or path.resolve(__dirname, 'mocks/fdirStub.js')
    },
  },
};
