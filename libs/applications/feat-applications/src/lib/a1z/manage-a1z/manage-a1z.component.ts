import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { A1ZApiService } from '@msh/applications/data-access-applications';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { A1Z } from '../../../../../domain-applications';
import { A1zFormComponent } from '../a1z-form/a1z-form.component';
import { A1zGridComponent } from '../a1z-grid/a1z-grid.component';
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
export class ManageA1zComponent implements OnInit {
  private a1zList$$ = new BehaviorSubject<A1Z[]>([]);
  a1zList$ = this.a1zList$$.asObservable();
  filters: LazyLoadEvent | null = null;

  hideA1ZForm = true;

  totalRecords = 0;
  selectedA1Z: A1Z | null = null;
  selectedA1ZList: A1Z[] = [];

  constructor(
    private readonly a1zservice: A1ZApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit(): void {
    console.log('init');
  }

  onNewClick() {
    this.hideA1ZForm = !this.hideA1ZForm;
  }
  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete selected entities?',
      accept: () => {
        this.toastService.showWarning('A1Z deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<A1Z | A1Z[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedA1ZList = [...this.selectedA1ZList, event.data as A1Z];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedA1ZList = this.selectedA1ZList.filter(u => {
          u.id !== (event.data as A1Z).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedA1ZList = [
          ...this.selectedA1ZList,
          ...(event.data as A1Z[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedA1ZList = [];
        break;
      case GRID_ACTIONS.EDIT:
        // TODO: Route to a1z-form with id as a query parameter to get the dertails
        this.selectedA1Z = Object.assign({}, event.data as A1Z);
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this entity?',
          accept: () => {
            this.deleteA1Z(event.data as A1Z);
          },
        });
        break;
    }
  }

  deleteA1Z(a1z: A1Z) {
    this.a1zservice
      .delete(a1z.id!.toString())
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Formulari A1Z u fshi me sukses!');
        }
        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndonje nje problem gjate fshirjes se formularit A1Z!'
          );
        }
      });
  }

  getA1Z($event: LazyLoadEvent): void {
    this.filters = Object.assign({}, $event);

    this.a1zservice
      .loadA1Z($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        console.log(response);
        this.a1zList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
