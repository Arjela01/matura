import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';


import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { RippleModule } from 'primeng/ripple';
import { DashboardItemsFormComponent } from '../dashboard-items-form/dashboard-items-form.component';
import { DashboardItemsGridComponent } from '../dashboard-items-grid/dashboard-items-grid.component';
import { DashboardItems } from '@msh/shared/domain-models';
import {
  DashboardItemsApiService
} from "../../../../../data-access-configurations/src/lib/dashboard-items/dashboard-items-api.service";
import {DashboardSectionApiService} from "@msh/configurations/data-access-configurations";
import {DropdownModel} from "@msh/shared/data-access-shared";

@UntilDestroy()
@Component({
  selector: 'msh-manage-dashboard-items',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    DashboardItemsFormComponent,
    DashboardItemsGridComponent,
  ],
  templateUrl: './manage-dashboard-items.component.html',
  styleUrls: ['./manage-dashboard-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageDashboardItemsComponent {
  private dashboardItems$$ = new BehaviorSubject<DashboardItems[]>([]);
  dashboardItems$ = this.dashboardItems$$.asObservable();
  filters: LazyLoadEvent | null = null;
  users: DropdownModel<number>[] = [];
  roles: DropdownModel<number>[] = [];

  totalRecords = 0;
  selectedDashboardItem: DashboardItems | null = null;
  selectedDashboardItems: DashboardItems[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly dashboardItemsService: DashboardItemsApiService,
    private readonly dashboardSectionService: DashboardSectionApiService,


  ) {}

  onNewClick() {
    this.displayModal = true;
  }
  onModalClose() {
    this.displayModal = false;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini studentët e zgjedhur?',
      accept: () => {
        this.toastService.showWarning('Studentët e zgjedhur u fshinë!');
      },
    });
  }

  onGridEvent(event: GridEvent<DashboardItems | DashboardItems[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedDashboardItems = [
          ...this.selectedDashboardItems,
          event.data as DashboardItems,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedDashboardItems = this.selectedDashboardItems.filter(sb => {
          sb.id !== (event.data as DashboardItems).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedDashboardItems = [
          ...this.selectedDashboardItems,
          ...(event.data as DashboardItems[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedDashboardItems = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedDashboardItem = Object.assign(
          {},
          event.data as DashboardItems
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini studentin e skualifikuar të zgjedhur?',
          accept: () => {
            this.deleteDashboardItems(event.data as DashboardItems);
          },
        });
        break;
    }
  }
  onFormSave(dashboardItems: DashboardItems) {
    if (dashboardItems.id) {
      this.updateDashboardItems(dashboardItems);
    }
    if (!dashboardItems.id) {
      this.addDashboardItems(dashboardItems);
    }
  }

  getDashboardItems($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.dashboardItemsService
      .loadDashboardItems($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.dashboardItems$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addDashboardItems(dashboardItems: DashboardItems) {
    this.dashboardItemsService
      .save(dashboardItems)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u shtua me sukses!');
          this.displayModal = false;
          this.getDashboardItems(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të studentit!'
          );
      });
  }

  updateDashboardItems(dashboardItems: DashboardItems) {
    this.dashboardItemsService
      .update(dashboardItems)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u ndryshua me sukses!');
          this.getDashboardItems(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të studentit!'
          );
        this.displayModal = false;
      });
  }

  deleteDashboardItems(dashboardItems: DashboardItems) {
    this.dashboardItemsService
      .delete(dashboardItems.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Studenti u fshi me sukses!');
          this.getDashboardItems(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të studentit!'
          );
      });
  }
}
