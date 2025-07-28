import { Component, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Api, CatSelectItem, EmojiZ } from '../api';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Http } from '../../../data/http';
import * as R from "rxjs";
import { emptyToNull } from '../../../data/util';
import { Alert } from '../../../widget/alert/alert';

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
	readonly isUpload = signal(false);
	private readonly http = inject(Http);
	private readonly alert = inject(Alert);

	/** 网络表情 */
	netForm = this.fb.group({
		url: ["", Validators.required],
		desc: [""]
	});

	private connectSubmitNet(): void {
		this.netForm.markAllAsDirty();
		if (this.netForm.invalid) {
			return ;
		}
	}
	/** 结束于网络表情 */

	/** 本地表情 */
	private readonly localFile: WritableSignal<File | undefined> = signal(undefined);
	readonly localForm = this.fb.group({
		desc: [""]
	});
	readonly localError: WritableSignal<String | undefined> = signal(undefined);

	connectLocalFileChange(event: Event): void {
		const { target } = event;
		if (target === null) {
			return ;
		}

		const file = (target as HTMLInputElement).files?.[0];
		if (file === null) {
			return ;
		}

		this.localFile.set(file);
		this.localError.set(undefined);
	}

	private connectSubmitLocal(): void {
		const file = this.localFile();
		if (file === undefined) {
			return this.localError.set("请选择本地文件！");
		}

		if (!["image/gif", "image/jpeg", "image/png", "image/webp"].includes(file.type)) {
			return this.localError.set("请选择图片类型的文件！");
		}

		this.localError.set(undefined);
		this.isUpload.set(true);

		this.http.uploadFile(file)
			.pipe(
				R.switchMap(file => this.api.addEmoji({
					fileSha: file.sha,
					desc: emptyToNull(this.localForm.get("desc")?.value ?? ""),
					catId: this.data.id
				}))
			)
			.subscribe({
				next: value => {
					this.isUpload.set(false);
					this.selfDialog.close(value);
				},
				error: e => this.alert.show(e)
			});
	}
	/** 结束于本地表情 */

	connectSubmit(): void {
		const curTabIdx = this.curTabIdx();
		if (curTabIdx === 0) {
			return this.connectSubmitNet();
		}
		else if (curTabIdx === 1) {
			return this.connectSubmitLocal();
		}
	}
}

@Injectable({
	providedIn: "root"
})
export class Upload {
	private readonly dialog = inject(MatDialog);

	show(cat: CatSelectItem): R.Observable<EmojiZ> {
		const dialog = this.dialog.open(UploadDialog, {
			data: cat
		});

		return dialog.afterClosed();
	}
}
