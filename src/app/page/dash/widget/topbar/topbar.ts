import { Component, inject, viewChild } from '@angular/core';
import { UiItem, UiTopbar } from 'drifloon';
import { CatZ, DashState } from '../../state/dash';
import { FormsModule } from '@angular/forms';
import { CatDialog } from "./catdialog";

@Component({
	selector: 'xg-topbar',
	imports: [
		UiTopbar,
		UiItem,
		FormsModule,
		CatDialog
	],
	templateUrl: './topbar.html'
})
export class Topbar {
	dashState = inject(DashState);

	catDialog = viewChild.required(CatDialog);

	connectEditCat(): void {
		console.log(this.dashState.curCat());
	}
}
