import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler } from "@angular/core";
import { z } from "zod";

const responseErrorZ = z.object({
	msg: z.string()
});

export class XGErrorHandler implements ErrorHandler {
	handleError(error: any) {
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
	}
}
