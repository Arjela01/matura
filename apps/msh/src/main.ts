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
  AuthEffects,
  authFeature,
  AUTH_FEATURE_KEY,
  loadAuthProvider,
  TokenInterceptor,
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

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
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
      useClass: ErrorInterceptorService,
      multi: true,
    },
    MessageService,
  ],
});
