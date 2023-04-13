import { NgIf } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalSpinnerComponent } from '@msh/shared/ui-shared';
import { ToastModule } from 'primeng/toast';
import {PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'msh-root',
  template: `
    <router-outlet></router-outlet>
    <msh-global-spinner *ngIf="isLoading"></msh-global-spinner>
    <p-toast></p-toast>
  `,
  styles: [],
  standalone: true,
  imports: [RouterOutlet, GlobalSpinnerComponent, NgIf, ToastModule],
})

export class AppComponent implements OnInit{
  //Todo: Loading spinner global
  isLoading = false;

  constructor(
    private primengConfig : PrimeNGConfig,

  ) {}

  ngOnInit() {
    this.primengConfig.setTranslation({
      startsWith: 'Fillon me',
      contains: 'Përmban',
      notContains: 'Nuk përmban',
      endsWith:'Mbaron me',
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
      gt:'Më i madh se',
      gte: 'Më i madh ose i barabartë',
      lt: 'Më i vogël se',
      lte: 'Më i vogël ose i barabartë'
    });
  }

}
