import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withDebugTracing,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';

import { provideStore } from '@ngrx/store';

import {
  AUTH_FEATURE_KEY,
  AcademicYearInterceptor,
  AuthEffects,
  TokenInterceptor,
  authFeature,
  loadAuthProvider,
} from '@msh/auth/data-access-auth';
import { getLocalStorageProvider } from '@msh/shared/data-access-shared';
import { environment } from '@msh/shared/environments';
import {
  API_URL,
  ErrorInterceptorService,
  REPORTS_APP_URL,
} from '@msh/shared/util-shared';

import { provideEffects } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { getStoreDevToolsProvider } from './app/build-specifics';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { LoadingInterceptor } from '../../../libs/shared/ui-shared/src/lib/loader-interceptor/loader-interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideRouter(
      APP_ROUTES,
      withPreloading(PreloadAllModules),
      withDebugTracing(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),

    provideStore({
      [AUTH_FEATURE_KEY]: authFeature.reducer,
    }),
    getStoreDevToolsProvider(),
    getLocalStorageProvider(),
    loadAuthProvider(),
    { provide: API_URL, useValue: environment.api_url },
    { provide: REPORTS_APP_URL, useValue: environment.reports_app_url },
    provideEffects([AuthEffects]),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AcademicYearInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
    MessageService,
  ],
});
