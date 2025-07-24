import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { z } from "zod";
import { AlertDialog } from "./widget/alert/alert";

const responseErrorZ = z.object({
	msg: z.string()
});

export class XGErrorHandler implements ErrorHandler {
	handleError(error: any) {
		const dialog = inject(MatDialog);
		const msg = (error => {
			if (error instanceof HttpErrorResponse) {
				const e = error.error;
				const result = responseErrorZ.safeParse(e);
				if (result.success) {
					alert(result.data.msg)
				}
				else {
					alert(result.error.message);
				}
			}
			else if (error instanceof Error) {
				alert(error.message);
			}
			else {
				alert(`${error}`);
			}
		})(error);

	}
}
