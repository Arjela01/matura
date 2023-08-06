import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { A1ZApiService } from '@msh/applications/data-access-applications';
import { A1ZTableRecord } from '@msh/applications/domain-application';

import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { A1zFormComponent } from '../a1z-form/a1z-form.component';
import { A1zGridComponent } from '../a1z-grid/a1z-grid.component';
import {TableLazyLoadEvent} from "primeng/table";
@UntilDestroy()
@Component({
  selector: 'msh-manage-users',
  standalone: true,
  templateUrl: './manage-a1z.component.html',
  styleUrls: ['./manage-a1z.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    A1zGridComponent,
    A1zFormComponent,
    RippleModule,
  ],
  providers: [ConfirmationService],
})
export class ManageA1zComponent {
  private a1zList$$ = new BehaviorSubject<A1ZTableRecord[]>([]);
  a1zList$ = this.a1zList$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;
  selectedA1Z: A1ZTableRecord | null = null;
  selectedA1ZList: A1ZTableRecord[] = [];

  constructor(
    private readonly a1zservice: A1ZApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly router: Router,
    private authFacade: AuthFacade
  ) {}
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([_]) => {
      if (this.filters) {
        this.getA1Z(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onNewClick() {
    this.router.navigate(['/applications/a1z/add']);
  }

  onGridEvent(event: GridEvent<A1ZTableRecord | A1ZTableRecord[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedA1ZList = [
          ...this.selectedA1ZList,
          event.data as A1ZTableRecord,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedA1ZList = this.selectedA1ZList.filter(u => {
          u.id !== (event.data as A1ZTableRecord).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedA1ZList = [
          ...this.selectedA1ZList,
          ...(event.data as A1ZTableRecord[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedA1ZList = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedA1Z = Object.assign({}, event.data as A1ZTableRecord);
        this.router.navigate([
          'applications',
          'a1z',
          'edit',
          this.selectedA1Z.id,
        ]);
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni ta fshini këtë formular?',
          accept: () => {
            this.deleteA1Z(event.data as A1ZTableRecord);
          },
        });
        break;
    }
  }

  deleteA1Z(a1z: A1ZTableRecord) {
    this.a1zservice
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .delete(a1z.id!.toString())
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Formulari A1Z u fshi me sukses!');
        }
        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndonje një problem gjatë fshirjes së formularit A1Z!'
          );
        }
      });
  }

  getA1Z($event: TableLazyLoadEvent): void {
    this.filters = Object.assign({}, $event);

    this.a1zservice
      .loadA1Z($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.a1zList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
