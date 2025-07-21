import * as m from "drifloon/m";
import { EitherAsync } from "drifloon/purify";
import { useDefLoader } from "drifloon/module/loader";
import * as C from "drifloon/codec";
import { UserC } from "../ty";
import * as Fetch from "../fetch";

const catC = C.Codec.interface({
	id: C.number,
	name: C.string
});

type CatC = C.GetType<typeof catC>;

const fetchCat = (): EitherAsync<string, Array<CatC>> => {
	return Fetch.makeGet("/self/cat/list", C.array(catC));
};

interface MainAppAttr {
	cats: Array<CatC>;
	emojis: Array<string>;
}

const MainApp: m.ComponentTypes<MainAppAttr> = {
	view: ({ attrs }) => {
		return m("div");
	}
};

export interface AppAttr {
	user: UserC;
}

const Main: m.ComponentTypes<AppAttr> = () => {
	const [updater, comp] = useDefLoader();

	updater(() => EitherAsync(async helper => {
		const cats = await fetchCat().then(helper.liftEither);

		return {
			view: () => m(MainApp, { cats, emojis: [] })
		};
	}));

	return {
		view: () => {
			return m(comp);
		}
	};
};

export default Main;
