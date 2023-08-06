import { appConfig } from './app/app.config';

import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

import { LoadingInterceptor } from '@msh/shared/ui-shared';
import { APOLLO_OPTIONS } from 'apollo-angular';
import {environment} from "@msh/shared/environments";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig);
