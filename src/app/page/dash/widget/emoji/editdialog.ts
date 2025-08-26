import { Component, signal } from "@angular/core";
import { UiBaseDialog, UiDialog, UiDialogBox, UiForm, UiFormField } from "drifloon";
import { EmojiZ } from "../../state/emoji";
import { ReactiveFormsModule } from "@angular/forms";

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
	isLoad = signal(false);

	fg = this.fb.group({
		desc: [""]
	});

	override updateInput(emoji: EmojiZ): void {
		this.fg.controls.desc.setValue(emoji.desc);
	}

	connectSubmit(): void {
		const desc = trimDesc(this.fg.controls.desc.value);
	}
}
