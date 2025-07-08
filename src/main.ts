import { mount } from "drifloon";
import { EitherAsync } from "drifloon/purify";
import * as C from "drifloon/codec";
import * as m from "drifloon/m";
import { useDefLoader } from "drifloon/module/loader";
import * as Store from "./store";

import Login from "./page/login";
import App from "./page/app";
import { userC } from "./ty";

const Root = (): m.Component => {
	const [updater, comp] = useDefLoader();

	updater(() => EitherAsync(async helper => {
		const token = Store.readToken();

		if (!token) {
			return Login;
		}

		const muser = await fetch("/api/user/self")
			.then(r => r.json())
			.then(C.maybe(userC).decode)
			.then(helper.liftEither);

		return muser.caseOf({
			Just: user => App,
			Nothing: () => Login
		});
	}));

	return {
		view() {
			return m(comp);
		}
	};
};

const main = () => {
	mount(Root);
};

main();
