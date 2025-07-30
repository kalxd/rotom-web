import { Component, inject, Injectable, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import * as R from "rxjs";

interface DialogInputData {
	desc: string | null;
}

@Component({
	selector: 'xg-descdialog',
	imports: [
		FormsModule,

		MatDialogModule,
		MatFormField,
		MatInputModule,
		MatButtonModule
	],
	templateUrl: './descdialog.html',
	styleUrl: './descdialog.scss'
})
class DescDialogImpl {
	private readonly data = inject<DialogInputData>(MAT_DIALOG_DATA);
	protected readonly desc = signal(this.data.desc ?? "");
}

@Injectable({
	providedIn: "root"
})
export class DescDialog {
	private readonly dialog = inject(MatDialog);

	show(desc: string | null): R.Observable<string | null> {
		const dialog = this.dialog.open(DescDialogImpl, {
			data: { desc }
		});

		return dialog.afterClosed().pipe(
			R.filter(x => x !== null)
		);
	}
}
