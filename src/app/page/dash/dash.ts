import { Component, inject } from "@angular/core";
import { CatState } from "./state/cat";
import * as R from "rxjs";
import { ActionResult, UiTaskDirective } from "drifloon";
import { Topbar } from "./widget/topbar/topbar";
import { Emoji } from "./widget/emoji/emoji";

@Component({
	selector: "xg-dash",
	imports: [
		UiTaskDirective,

		Topbar,
		Emoji
	],
	templateUrl: "./dash.html"
})
export class Dash {
	protected catState = inject(CatState);
	protected cats$: R.Observable<ActionResult<void>>;

	constructor() {
		this.cats$ = this.catState.fetchCats().pipe(
			R.map(_ => ActionResult.Ok(undefined)),
			R.startWith(ActionResult.Pend)
		);
	}
}
