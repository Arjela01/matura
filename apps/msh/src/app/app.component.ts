import { NgIf } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalSpinnerComponent, LoaderService } from '@msh/shared/ui-shared';
import { ToastModule } from 'primeng/toast';
import { PrimeNGConfig } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'msh-root',
  template: `
    <router-outlet></router-outlet>
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
})
export class AppComponent implements OnInit, AfterViewChecked {
  //Todo: Loading spinner global
  constructor(
    private primengConfig: PrimeNGConfig,
    public loader: LoaderService,
    private cd: ChangeDetectorRef
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
  ngAfterViewChecked() {
    this.cd.detectChanges();
  }
}
