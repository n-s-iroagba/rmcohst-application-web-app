// cypress/webpack.config.ts
export default {
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      // Remove fdir if not needed, or fix the path
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  }
};