import { Component, ElementRef, inject, signal, viewChild } from "@angular/core";
import { UiBaseDialog, UiDialog, UiDialogBox, UiForm, UiFormField, UiTopbar } from "drifloon";
import { Http } from "../../../../data/http";
import * as R from "rxjs";
import { AddEmojiOption, EmojiState } from "../../state/emoji";
import { CatState } from "../../state/cat";
import { ReactiveFormsModule } from "@angular/forms";

const trimStr = (s: string | undefined): string | null => {
	if (s === undefined) {
		return null;
	}

	const ss = s.trim();
	if (ss.length === 0) {
		return null;
	}
	return ss;
};

@Component({
	selector: "xg-add-dialog",
	templateUrl: "./adddialog.html",
	imports: [
		UiDialog,
		UiTopbar,
		UiDialogBox,
		UiForm,
		UiFormField,
		ReactiveFormsModule
	]
})
export class AddDialog extends UiBaseDialog<void, void> {
	private http = inject(Http);
	private catState = inject(CatState);
	private emojiState = inject(EmojiState);
	private inputEl = viewChild.required<ElementRef<HTMLInputElement>>("file")

	file = signal<null | File>(null);
	isLoad = signal(false);

	fg = this.fb.nonNullable.group({
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

	connectSubmit(): void {
		const file = this.file();

		if (!file) {
			return alert("请选择表情文件！");
		}

		this.isLoad.set(true);

		this.http.uploadFile(file)
			.pipe(
				R.exhaustMap(file => {
					const option: AddEmojiOption = {
						fileSha: file.sha,
						catId: this.catState.curCat().id,
						desc: trimStr(this.fg.value.desc)
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
				R.finalize(() => this.isLoad.set(false))
			)
			.subscribe(_ => this.setFinalResult());
	}
}
