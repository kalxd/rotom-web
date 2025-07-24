import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";

import { routes } from './app.routes';
import { httpInterceptor } from "./interceptor/http";
import { XGErrorHandler } from './error';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes),
		provideHttpClient(
			withFetch(),
			withInterceptors([httpInterceptor])
		),
		{ provide: ErrorHandler, useClass: XGErrorHandler }
	]
};
