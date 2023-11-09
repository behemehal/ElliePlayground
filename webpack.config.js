const path = require("path");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
  entry: "./src/js/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 8080,
    hot: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/*.html",
          to: "index.html",
        },
      ],
    }),
    
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "./wasm"),
      outDir: path.resolve(__dirname, "./src/js/pkg"),
      pluginLogLevel: 'error',
      args: '--log-level error',
      forceMode: "release",
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new HtmlMinimizerPlugin()],
  },
  experiments: {
    asyncWebAssembly: true,
  },
  stats: {
    errorDetails: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: "style-loader",
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: "css-loader",
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: function () {
                  return [require("autoprefixer")];
                },
              },
            },
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
};
