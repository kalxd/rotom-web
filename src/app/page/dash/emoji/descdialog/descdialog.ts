import { Component, inject, Injectable, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import * as R from "rxjs";
import { CatSelectItem } from '../../api';
import { MatSelectModule } from '@angular/material/select';

interface DialogInputData {
	curCat: CatSelectItem;
	cats: Array<CatSelectItem>;
	desc: string | null;
}

export interface DialogOutputData {
	cat: CatSelectItem;
	desc: string | null;
}

@Component({
	selector: 'xg-descdialog',
	imports: [
		FormsModule,

		MatDialogModule,
		MatFormField,
		MatSelectModule,
		MatInputModule,
		MatButtonModule
	],
	templateUrl: './descdialog.html',
	styleUrl: './descdialog.scss'
})
class DescDialogImpl {
	private readonly selfRef: MatDialogRef<DialogInputData, DialogOutputData>
		= inject(MatDialogRef<DescDialogImpl>);

	protected readonly data = inject<DialogInputData>(MAT_DIALOG_DATA);
	protected readonly curCat = signal(this.data.curCat);
	protected readonly desc = signal(this.data.desc ?? "");

	connectOk(): void {
		const data: DialogOutputData = {
			cat: this.curCat(),
			desc: this.desc()
		};

		this.selfRef.close(data);
	}
}

@Injectable({
	providedIn: "root"
})
export class DescDialog {
	private readonly dialog = inject(MatDialog);

	show(opt: DialogInputData): R.Observable<DialogOutputData> {
		const dialog = this.dialog.open(DescDialogImpl, {
			data: opt
		});

		return dialog.afterClosed().pipe(
			R.filter(x => x !== null)
		);
	}
}
