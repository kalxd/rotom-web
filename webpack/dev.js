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
			directory: path.resolve("dist")
		},
		proxy: [
			{
				context: ["/api"],
				target: "http://192.168.31.10:7002",
				pathRewrite: {
					"^/api": ""
				}
			}
		]
	}
};

module.exports = config;
