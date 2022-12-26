import { HttpClientModule } from '@angular/common/http';
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
import { getLocalStorageProvider } from '@msh/shared/data-access-shared';
import { environment } from '@msh/shared/environments';
import { API_URL } from '@msh/shared/util-shared';

import { provideStoreDevtools } from '@ngrx/store-devtools';

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
    !environment.production
      ? provideStoreDevtools({
          maxAge: 25,
        })
      : [],
    getLocalStorageProvider(),
    { provide: API_URL, useValue: environment.api_url },
  ],
});
