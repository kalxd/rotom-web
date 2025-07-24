import { HttpInterceptorFn } from '@angular/common/http';
import { Session } from "../data/session";
import { inject } from '@angular/core';

const fixWithPrefix = (url: string): string => {
	if (url.startsWith("/")) {
		return `_${url}`;
	}
	else {
		return `_/${url}`;
	}
};

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
	const sessionSrv = inject(Session);

	const neoReq = (req => {
		const fullUrl = fixWithPrefix(req.url);
		const { session } = sessionSrv;
		if (session) {
			return req.clone({
				url: fullUrl,
				headers: req.headers.set("xgtoken", session.token)
			});
		}
		else {
			return req.clone({ url: fullUrl });
		}
	})(req);

	return next(neoReq);
};
