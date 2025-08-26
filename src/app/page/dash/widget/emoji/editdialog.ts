import { Component, inject, signal } from "@angular/core";
import { UiBaseDialog, UiDialog, UiDialogBox, UiForm, UiFormField } from "drifloon";
import { EmojiState, EmojiZ } from "../../state/emoji";
import { ReactiveFormsModule } from "@angular/forms";
import { CatState } from "../../state/cat";
import * as R from "rxjs";

const trimDesc = (s: string | null): string | null => {
	if (s === null) {
		return s;
	}

	const ss = s.trim();
	if (ss.length === 0) {
		return null;
	}

	return ss;
};

@Component({
	selector: "xg-edit-dialog",
	templateUrl: "./editdialog.html",
	imports: [
		UiDialog,
		UiDialogBox,
		UiForm,
		UiFormField,
		ReactiveFormsModule
	]
})
export class EditDialog extends UiBaseDialog<EmojiZ, void> {
	catState = inject(CatState);
	emojiState = inject(EmojiState);

	isLoad = signal(false);
	emoji = signal<EmojiZ | null>(null);

	fg = this.fb.nonNullable.group({
		cat: [this.catState.curCat()],
		desc: [""],
	});

	override updateInput(emoji: EmojiZ): void {
		this.fg.controls.cat.setValue(this.catState.curCat());
		this.fg.controls.desc.setValue(emoji.desc ?? "");
		this.emoji.set(emoji);
	}

	connectSubmit(): void {
		const emoji = this.emoji();
		if (emoji === null) {
			return ;
		}

		const desc = trimDesc(this.fg.controls.desc.value);
		const cat = this.fg.controls.cat.value;

		this.isLoad.set(true);

		this.emojiState.updateEmoji(emoji, { desc, catId: cat.id })
			.pipe(
				R.concatMap(_ => {
					return R.combineLatest([
						this.emojiState.refreshEmojis(),
						this.catState.fetchCats()
					]);
				}),
				R.finalize(() => this.isLoad.set(false))
			)
			.subscribe(_ => this.setFinalResult());
	}
}
