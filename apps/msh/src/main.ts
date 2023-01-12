import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
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
import { provideStoreDevtools } from '@ngrx/store-devtools';

import {
  AuthEffects,
  authFeature,
  AUTH_FEATURE_KEY,
  loadAuthProvider,
  TokenInterceptor,
} from '@msh/auth/data-access-auth';
import { getLocalStorageProvider } from '@msh/shared/data-access-shared';
import { environment } from '@msh/shared/environments';
import { API_URL } from '@msh/shared/util-shared';

import { provideEffects } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
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
    !environment.production
      ? provideStoreDevtools({
          maxAge: 25,
        })
      : [],
    getLocalStorageProvider(),
    loadAuthProvider(),
    { provide: API_URL, useValue: environment.api_url },
    provideEffects([AuthEffects]),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    MessageService,
  ],
});
