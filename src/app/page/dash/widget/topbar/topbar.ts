import { Component, inject, viewChild } from '@angular/core';
import { UiItem, UiTopbar } from 'drifloon';
import { CatState } from '../../state/cat';
import { FormsModule } from '@angular/forms';
import { CatDialog, CatZWithId } from "./catdialog";

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
	catState = inject(CatState);

	catDialog = viewChild.required(CatDialog);

	connectEditCat(): void {
		const curCat = this.catState.curCat();
		if (curCat.id === null) {
			return alert("无法编辑默认分类！");
		}

		this.catDialog().show(curCat as CatZWithId);
		console.log(this.catState.curCat());
	}
}
