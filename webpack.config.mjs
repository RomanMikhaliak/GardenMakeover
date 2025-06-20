import path from "path";

import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

export default (_env, argv) => {
  return {
    stats: "minimal", // Keep console output easy to read.
    entry: "./src/main.ts", // Your program entry point

    // Your build destination
    output: {
      path: path.resolve(process.cwd(), "dist"),
      filename: "bundle.js",
      clean: true,
    },

    // Config for your testing server
    devServer: {
      compress: true,
      allowedHosts: "all", // If you are using WebpackDevServer as your production server, please fix this line!
      static: false,
      client: {
        logging: "warn",
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      },
      port: 3333,
      host: "0.0.0.0",
    },

    // Web games are bigger than pages, disable the warnings that our game is too big.
    performance: { hints: false },

    // Enable sourcemaps while debugging
    devtool: argv.mode === "development" ? "eval-source-map" : undefined,

    // Minify the code when making a final build
    optimization: {
      minimize: argv.mode === "production",
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 6,
            compress: { drop_console: true },
            output: { comments: false, beautify: false },
          },
        }),
      ],
    },

    // Explain webpack how to do Typescript
    module: {
      rules: [
        {
          test: /\.ts(x)?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },

    plugins: [

      new CopyPlugin({
        patterns: [{ from: "public/" }],
      }),


      new HtmlWebpackPlugin({
        template: "./index.ejs",
        hash: true,
        minify: false,
      }),
    ],
  };
};
