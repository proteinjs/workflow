var path = require('path');

module.exports = {
    // entry: './generated/index.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
      app: './generated/index.ts',
      vendor: ['@material-ui/core', '@material-ui/styles']
    },
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist'),
      library: '[name]'
    },
    // output: {
    //   path: path.join(__dirname, 'dist'),
    //   filename: 'index.js',
    //   library: 'app'
    // },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      alias: {
        '@material-ui/styles': path.join(__dirname, '/node_modules/@material-ui/styles'),
        '@material-ui/core/styles': path.join(__dirname, '/node_modules/@material-ui/core/styles'),
        'react': path.join(__dirname, '/node_modules/react')
      },
    },
    module: {
      rules: [
        // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
        { test: /\.tsx?$/, use: ['ts-loader'], exclude: /node_modules/ },
      ],
    },
    optimization: {
      splitChunks: {
          cacheGroups: {
              default: false,
              vendors: false,
              vendor: {
                  name: 'vendor',
                  chunks: 'all',
                  test: /node_modules/
              }
          }
      }
  },
};