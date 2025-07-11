const path = require("path");

const config = {
	mode: "production",
	entry: "./src/main.ts",
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader"
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	output: {
		path: path.resolve("./dist")
	}
};

module.exports = config;
