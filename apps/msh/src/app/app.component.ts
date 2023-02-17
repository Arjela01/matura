import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalSpinnerComponent } from '@msh/shared/ui-shared';
import { ToastModule } from 'primeng/toast';

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
export class AppComponent {
  //Todo: Loading spinner global
  isLoading = false;
}
