import { mount } from "drifloon";
import { EitherAsync, Just, Maybe, Nothing } from "drifloon/purify";
import * as C from "drifloon/codec";
import * as m from "drifloon/m";
import { useDefLoader } from "drifloon/module/loader";
import * as Store from "./store";

import Login from "./page/login";
import App from "./page/app";
import { SessionUserC, userC } from "./ty";
import { mutable } from "drifloon/data";

const Root = (): m.Component => {
	const [updater, comp] = useDefLoader();

	const state = mutable<Maybe<SessionUserC>>(Nothing);

	const LoginWrap: m.ComponentTypes = () => {
		const onlogin = (session: SessionUserC): void => {
			state.set(Just(session));
			Store.writeToken(session.token);
		};
		return {
			view: () => {
				return m(Login, { connectLogin: onlogin })
			}
		};
	};

	updater(() => EitherAsync(async helper => {
		const token = Store.readToken().extract();

		if (!token) {
			return LoginWrap;
		}

		const fetchInit = {
			headers: {
				"xgtoken": token
			}
		};

		const muser = await fetch("/api/user/self", fetchInit)
			.then(r => r.json())
			.then(C.maybe(userC).decode)
			.then(helper.liftEither);

		return muser.caseOf({
			Just: user => App,
			Nothing: () => LoginWrap
		});
	}));

	return {
		view() {
			return state.get().caseOf({
				Just: sessionUser => m(App),
				Nothing: () => m(comp)
			});
		}
	};
};

const main = () => {
	mount(Root);
};

main();
