const HtmlWebpackPlugin = require("html-webpack-plugin");
//const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
const srcPath = path.join(__dirname, "public");
const includePaths = [srcPath];

module.exports = {
  mode: "development",
  entry: ["@babel/polyfill", "./src/index.js"],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "./js/bundle.js",
    publicPath: "/",
  },
  stats: { errorDetails: true },
  module: {
    rules: [
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: {
          loader: "file-loader",
        },
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.less$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "less-loader" },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "less-loader" },
        ],
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      // {
      //   test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
      //   use: "file-loader?name=[name].[ext]?[hash]",
      // },

      // the following 3 rules handle font extraction
      // {
      //   test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      //   loader: "url-loader?limit=10000&mimetype=application/font-woff",
      // },

      // {
      //   test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      //   loader: "file-loader",
      // },
      // {
      //   test: /\.otf(\?.*)?$/,
      //   use:
      //     "file-loader?name=/fonts/[name].[ext]&mimetype=application/font-otf",
      // },
    ],
  },
  resolve: {
    mainFiles: ["index", "Index"],
    extensions: [".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src/"),
      "#": path.resolve(__dirname, "public/"),
      // "../../theme.config$": path.join(
      //   __dirname,
      //   "my-semantic-theme/theme.config"
      // ),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    // new ExtractTextPlugin({
    //   filename: "[name].[contenthash].css",
    // }),
  ],
  devServer: {
    publicPath: "/",
    historyApiFallback: true,
  },
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: "http://localhost:4000",
    }),
  },
};
