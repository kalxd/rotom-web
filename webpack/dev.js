const path = require("path");

const config = {
	mode: "development",
	entry: "./src/main.ts",

	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader"
			}
		],
	},

	resolve: {
		extensions: [".ts", ".js"]
	},

	devtool: "inline-source-map",

	devServer: {
		static: {
			directory: path.resolve("assert")
		}
	}
};

module.exports = config;
