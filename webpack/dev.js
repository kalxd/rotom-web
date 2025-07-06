const config = {
	mode: "development",

	entry: "./src/main.ts",

	resolve: {
		extensions: [".ts", ".js"]
	},

	output: {
		filename: "main.js"
	}
};

module.exports = config;
