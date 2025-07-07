import { mount } from "drifloon";
import * as m from "drifloon/m";

const App: m.Component = {
	view() {
		return m("div", [
			m("h1", "hello")
		]);
	}
};

const main = () => {
	mount(App);
};

main();
