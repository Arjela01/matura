import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';

import { Router } from '@angular/router';
import { DashboardItemsApiService } from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { DashboardItem } from '@msh/shared/domain-models';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { BehaviorSubject } from 'rxjs';
import { DashboardItemsFormComponent } from '../dashboard-items-form/dashboard-items-form.component';
import { DashboardItemsGridComponent } from '../dashboard-items-grid/dashboard-items-grid.component';

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
  private dashboardItems$$ = new BehaviorSubject<DashboardItem[]>([]);
  dashboardItems$ = this.dashboardItems$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  users: DropdownModel<number>[] = [];
  roles: DropdownModel<number>[] = [];

  totalRecords = 0;
  selectedDashboardItem: DashboardItem | null = null;
  selectedDashboardItems: DashboardItem[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly dashboardItemsService: DashboardItemsApiService,
    private router: Router
  ) {}

  onNewClick() {
    this.router.navigate(['configurations/dashboard-items/add']);
  }
  onModalClose() {
    this.displayModal = false;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini konfigurimet të dashboard-it?',
      accept: () => {
        this.toastService.showWarning(
          'Konfigurimet e dashboard-it të zgjedhur u fshinë!'
        );
      },
    });
  }
  onGridEvent(event: GridEvent<any>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedDashboardItems = [
          ...this.selectedDashboardItems,
          event.data as DashboardItem,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedDashboardItems = this.selectedDashboardItems.filter(sb => {
          sb.id !== (event.data as DashboardItem).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedDashboardItems = [
          ...this.selectedDashboardItems,
          ...(event.data as DashboardItem[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedDashboardItems = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.router.navigate([
          'configurations/dashboard-items/add/' + event.data?.id,
        ]);
        break;
      case GRID_ACTIONS.CUSTOM_ACTION2:
        this.downloadDocument(event.data as DashboardItem);
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini konfigurimet e dashboard-it?',
          accept: () => {
            this.deleteDashboardItems(event.data as DashboardItem);
          },
        });
        break;
    }
  }
  getDashboardItems($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.dashboardItemsService
      .loadDashboardItems($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.dashboardItems$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  downloadDocument(dashboardItem: DashboardItem) {
    const byteCharacters = atob(dashboardItem.document);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const mimeType = 'application/pdf';
    const blob = new Blob([byteArray], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = dashboardItem.documentName;
    link.click();
  }

  deleteDashboardItems(dashboardItems: DashboardItem) {
    this.dashboardItemsService
      .delete(dashboardItems.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo(
            'Konfigurimi i dashboard-it u fshi me sukses!'
          );
          this.getDashboardItems(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të konfigurimit të dashboard-it!'
          );
      });
  }
}
