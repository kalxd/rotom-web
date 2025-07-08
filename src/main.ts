import { mount } from "drifloon";
import { EitherAsync, Right } from "drifloon/purify";
import * as m from "drifloon/m";
import { useDefLoader } from "drifloon/module/loader";
import * as Store from "./store";

import LoginForm from "./widget/login";

const App = (): m.Component => {
	const [updater, comp] = useDefLoader();

	updater(() => EitherAsync.fromPromise(async () => {
		const token = Store.readToken();
		const rsp = await fetch("/api/user/self");
		const result = await rsp.json();
		console.log(result);

		return Right(LoginForm);
	}));

	return {
		view() {
			return m(comp);
		}
	};
};

const main = () => {
	const token = Store.readToken();
	console.log(token);
	mount(App);
};

main();
