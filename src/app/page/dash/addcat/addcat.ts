import { Component, inject, Injectable } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import * as R from "rxjs";

export interface DialogModel {
	name: string;
}

@Component({
	selector: 'xg-addcat',
	imports: [
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule
	],
	templateUrl: './addcat.html',
	styleUrl: './addcat.scss'
})
export class AddCatDialog {
	private readonly selfRef: MatDialogRef<DialogModel | null, DialogModel | null>
		= inject(MatDialogRef<AddCatDialog>);
	readonly data = inject<DialogModel | null>(MAT_DIALOG_DATA);

	private readonly fb = inject(FormBuilder);
	dialogForm = this.fb.group({
		name: [this.data?.name ?? "", Validators.required]
	});

	checkForm(): void {
		this.dialogForm.markAllAsDirty();
		if (this.dialogForm.invalid) {
			return ;
		}

		this.selfRef.close({
			name: this.dialogForm.value.name!
		});
	}
}

@Injectable({
	providedIn: "root"
})
export class AddCat {
	private readonly dialog = inject(MatDialog);

	show(value: DialogModel | null): Observable<DialogModel> {
		const dialog = this.dialog.open(AddCatDialog, {
			data: value
		});

		return dialog.afterClosed()
			.pipe(
				R.filter(x => x !== null)
			);
	}
}
