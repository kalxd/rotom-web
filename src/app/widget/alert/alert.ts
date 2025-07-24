import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Injectable } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { z } from "zod";

const httpErrorZ = z.object({
	msg: z.string()
});

const extractErrorMsg = (e: unknown): string => {
	if (e instanceof HttpErrorResponse) {
		const result = httpErrorZ.safeParse(e.error);
		console.log(result);

		if (result.success) {
			return result.data.msg;
		}
		else {
			return result.error.message;
		}
	}
	else if (e instanceof Error) {
		return e.message;
	}
	else if (typeof e === "string") {
		return e;
	}
	else {
		return `${e}`;
	}
};

@Component({
	selector: 'xg-alert',
	imports: [
		MatButtonModule,
		MatDialogModule
	],
	templateUrl: './alert.html',
	styleUrl: './alert.css'
})
export class AlertDialog {
	readonly data = inject<{ msg: string }>(MAT_DIALOG_DATA);

	private readonly selfRef = inject(MatDialogRef<AlertDialog>);

	close(): void {
		this.selfRef.close();
	}
}

@Injectable({
	providedIn: "root"
})
export class Alert {
	private readonly dialog = inject(MatDialog);

	show(msg: unknown): void {
		this.dialog.open(AlertDialog, {
			data: { msg: extractErrorMsg(msg) }
		});
	}
}
