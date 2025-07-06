import * as m from "mithril";

const main = () => {
	const appNode = document.getElementById("app");

	if (appNode) {
		m.render(appNode, null);
	}
};

main();
