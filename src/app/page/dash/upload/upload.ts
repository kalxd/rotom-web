import { Component, inject, Injectable, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Api, CatSelectItem } from '../api';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
	selector: 'xg-upload',
	imports: [
		ReactiveFormsModule,

		MatTabsModule,
		MatDialogModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule
	],
	templateUrl: './upload.html',
	styleUrl: './upload.scss'
})
export class UploadDialog {
	readonly curTabIdx = signal(0);
	private readonly api = inject(Api);
	private selfDialog = inject(MatDialogRef<UploadDialog>);
	private readonly data = inject<CatSelectItem>(MAT_DIALOG_DATA);
	private readonly fb = inject(FormBuilder);

	/** 网络表情 */
	netForm = this.fb.group({
		url: ["", Validators.required]
	});

	private connectSubmitNet(): void {
		this.netForm.markAllAsDirty();
		if (this.netForm.invalid) {
			return ;
		}
	}
	/** 结束于网络表情 */

	connectSubmit(): void {
		const curTabIdx = this.curTabIdx();
		if (curTabIdx === 0) {
			return this.connectSubmitNet();
		}
	}
}

@Injectable({
	providedIn: "root"
})
export class Upload {
	private readonly dialog = inject(MatDialog);

	show(cat: CatSelectItem): void {
		this.dialog.open(UploadDialog, {
			data: cat
		});
	}
}
