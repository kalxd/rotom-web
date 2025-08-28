import { Component, ElementRef, inject, signal, viewChild } from "@angular/core";
import { emptyStrToUndefined, UiBaseFormDialog, UiFormDialog, UiFormField } from "drifloon";
import { Http } from "../../../../data/http";
import * as R from "rxjs";
import { AddEmojiOption, EmojiState } from "../../state/emoji";
import { CatState } from "../../state/cat";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
	selector: "xg-add-dialog",
	templateUrl: "./adddialog.html",
	imports: [
		UiFormDialog,
		UiFormField,
		ReactiveFormsModule
	]
})
export class AddDialog extends UiBaseFormDialog<void, void> {
	private http = inject(Http);
	private catState = inject(CatState);
	private emojiState = inject(EmojiState);
	private inputEl = viewChild.required<ElementRef<HTMLInputElement>>("file")

	file = signal<null | File>(null);

	override fg = this.fb.nonNullable.group({
		desc: [""]
	});

	override init(_: void): void {
		this.file.set(null);
		this.fg.controls.desc.setValue("");
		this.inputEl().nativeElement.value = "";
	}

	connectFileChange(ev: Event): void {
		const file = (ev.target as HTMLInputElement).files?.[0];

		if (!file) {
			return ;
		}

		this.file.set(file);
	}

	override submit(): R.Observable<void> {
		const file = this.file();

		if (!file) {
			alert("请选择表情文件！");
			return R.EMPTY;
		}

		return this.http.uploadFile(file)
			.pipe(
				R.exhaustMap(file => {
					const option: AddEmojiOption = {
						fileSha: file.sha,
						catId: this.catState.curCat().id,
						desc: emptyStrToUndefined(this.fg.controls.desc.value)
					};
					return this.emojiState.addEmoji(option).pipe(
						R.concatMap(_ => {
							return R.combineLatest([
								this.emojiState.refreshEmojis(),
								this.catState.fetchCats()
							]);
						})
					);
				}),
				R.map(_ => {})
			);
	}
}
