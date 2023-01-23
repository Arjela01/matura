import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { A1ApiService } from '@msh/applications/data-access-applications';
import { A1 } from '@msh/applications/domain-application';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { A1FormComponent } from '../a1-form/a1-form.component';
import { A1GridComponent } from '../a1-grid/a1-grid.component';
@Component({
  selector: 'manage-a1',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    A1FormComponent,
    A1GridComponent,
    ToolbarModule,
    RouterModule,
  ],
  templateUrl: './manage-a1.component.html',
  styleUrls: ['./manage-a1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageA1Component {
  private a1$$ = new BehaviorSubject<A1[]>([]);
  a1$ = this.a1$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedA1: A1 | null = null;
  selectedA1Forms: A1[] = [];
  displayForm = false;
  d3Dropdown: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly a1ApiService: A1ApiService,
    private router: Router
  ) {
    this.getD3Subjects();
  }

  onNewClick() {
    this.displayForm = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini formularët A1 të zgjedhur?',
      accept: () => {
        this.toastService.showWarning('Formularët A1 të zgjedhur u fshinë!');
      },
    });
  }

  onGridEvent(event: GridEvent<A1 | A1[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedA1Forms = [...this.selectedA1Forms, event.data as A1];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedA1Forms = this.selectedA1Forms.filter(a1 => {
          a1.id !== (event.data as A1).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedA1Forms = [
          ...this.selectedA1Forms,
          ...(event.data as A1[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedA1Forms = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedA1 = Object.assign({}, event.data as A1);
        this.displayForm = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini formularët e zgjedhur?',
          accept: () => {
            this.deleteA1(event.data as A1);
          },
        });
        break;
    }
  }

  onFormSave(a1: A1) {
    if (a1.id) {
      this.updateA1(a1);
    }
    if (!a1.id) {
      this.updateA1(a1);
    }
  }

  getA1($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.a1ApiService
      .loadA1($event)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.a1$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addA1(a1: A1) {
    this.a1ApiService
      .save(a1)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Formulari A1 u shtua me sukses!');

          this.getA1(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të formularit A1!'
          );
      });
  }

  updateA1(a1: A1) {
    this.a1ApiService
      .update(a1)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Formulari A1 u ndryshua me sukses!');
          this.getA1(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të formularit A1!'
          );
      });
  }

  deleteA1(a1: A1) {
    this.a1ApiService
      .delete(a1.id)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Formulari A1 u fshi me sukses!');
          this.getA1(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së formularit A1!'
          );
      });
  }
  getD3Subjects() {
    this.d3Dropdown = this.a1ApiService.loadD3Subjects();
  }
}
