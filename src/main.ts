import { mount } from "drifloon";
import { EitherAsync, Right } from "drifloon/purify";
import * as m from "drifloon/m";
import { useDefLoader } from "drifloon/module/loader";
import * as Store from "./store";

import LoginForm from "./widget/login";

const App = (): m.Component => {
	const [updater, comp] = useDefLoader();

	updater(() => {
		const token = Store.readToken();
		return EitherAsync.liftEither(Right(LoginForm));
	});

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
