import { ApplicationConfig } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { environment } from '@msh/shared/environments';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  // withDebugTracing,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { provideStore } from '@ngrx/store';
import {
  AUTH_FEATURE_KEY,
  AcademicYearInterceptor,
  AuthEffects,
  TokenInterceptor,
  authFeature,
  loadAuthProvider,
} from '@msh/auth/data-access-auth';
import { getStoreDevToolsProvider } from './build-specifics';
import { getLocalStorageProvider } from '@msh/shared/data-access-shared';
import { provideEffects } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import {
  API_URL,
  ErrorInterceptorService,
  REPORTS_APP_URL,
} from '@msh/shared/util-shared';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { LoadingInterceptor } from '@msh/shared/ui-shared';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: `${environment.api_url}/auditQuery`,
          }),
        };
      },
      deps: [HttpLink],
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideRouter(
      APP_ROUTES,
      withPreloading(PreloadAllModules),
      // withDebugTracing(),
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
};
