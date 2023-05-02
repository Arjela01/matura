import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalSpinnerComponent } from '@msh/shared/ui-shared';
import { ToastModule } from 'primeng/toast';
import { PrimeNGConfig } from 'primeng/api';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { LoadingInterceptor } from '../../../../libs/shared/ui-shared/src/lib/loader-interceptor/loader-interceptor';

@Component({
  selector: 'msh-root',
  template: `
    <msh-global-spinner>
    </msh-global-spinner>
    <router-outlet>
    </router-outlet>
    <p-toast></p-toast>
  `,
  styles: [],
  standalone: true,
  imports: [
    RouterOutlet,
    GlobalSpinnerComponent,
    NgIf,
    ToastModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
})
export class AppComponent implements OnInit {
  //Todo: Loading spinner global

  constructor(
    private primengConfig: PrimeNGConfig,
  ) {}

  ngOnInit() {
    this.primengConfig.setTranslation({
      startsWith: 'Fillon me',
      contains: 'Përmban',
      notContains: 'Nuk përmban',
      endsWith: 'Mbaron me',
      equals: 'E njëjtë',
      notEquals: 'Jo e njëjtë',
      dateIs: 'Data është',
      dateIsNot: 'Data nuk është',
      dateAfter: 'Data pas',
      dateBefore: 'Data para',
      matchAll: 'Përputhen të gjitha',
      matchAny: 'Përputhen me çfardo',
      apply: 'Apliko',
      clear: 'Fshi',
      addRule: 'Shto Rregull',
      removeRule: 'Hiq Rregullin',
      gt: 'Më i madh se',
      gte: 'Më i madh ose i barabartë',
      lt: 'Më i vogël se',
      lte: 'Më i vogël ose i barabartë',
    });
  }
}
