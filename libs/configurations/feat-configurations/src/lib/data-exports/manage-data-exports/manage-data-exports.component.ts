import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { DataExport } from '@msh/shared/domain-models';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import {
  DataExportApiService,
  RolesApiService,
} from '@msh/configurations/data-access-configurations';
import { DataExportGridComponent } from '../data-export-grid/data-export-grid.component';
import { DataExportFormComponent } from '../data-export-form/data-export-form.component';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';

@UntilDestroy()
@Component({
  selector: 'msh-manage-data-exports',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    DataExportGridComponent,
    DataExportFormComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-data-exports.component.html',
  styleUrls: ['./manage-data-exports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageDataExportsComponent implements OnInit {
  private dataExports$$ = new BehaviorSubject<DataExport[]>([]);
  dataExports$ = this.dataExports$$.asObservable();
  filters: TableLazyLoadEvent | null = {
    sortField: 'displayOrder',
    sortOrder: 1,
  };

  totalRecords = 0;
  selectedDataExport: DataExport | null = null;
  selectedDataExports: DataExport[] = [];
  displayModal = false;

  parentDataExports: DropdownModel<number>[] = [];
  roles: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly dataExportService: DataExportApiService,
    private readonly rolesService: RolesApiService
  ) {}

  ngOnInit(): void {
    this.getParentDataExportsDropdown();
    this.getRolesDropdown();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedDataExport = {} as DataExport;
  }

  onGridEvent(event: GridEvent<DataExport | DataExport[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedDataExports = [
          ...this.selectedDataExports,
          event.data as DataExport,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedDataExports = this.selectedDataExports.filter(hs => {
          hs.id !== (event.data as DataExport).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedDataExports = [
          ...this.selectedDataExports,
          ...(event.data as DataExport[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedDataExports = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.getParentDataExportsDropdown((event.data as DataExport).id);
        this.selectedDataExport = Object.assign({}, event.data as DataExport);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini data-export-në e zgjedhur?',
          accept: () => {
            this.deleteDataExport(event.data as DataExport);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
    this.getParentDataExportsDropdown();
  }

  onFormSave(dataExport: DataExport) {
    if (dataExport.id) {
      this.updateDataExport(dataExport);
    }
    if (!dataExport.id) {
      this.addDataExport(dataExport);
    }
  }

  getDataExports($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.dataExportService
      .loadDataExports($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.dataExports$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addDataExport(dataExport: DataExport) {
    this.dataExportService
      .save(dataExport)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('DataExportja u shtua me sukses!');
          this.displayModal = false;
          this.getDataExports(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të dataExportsë!'
          );
      });
  }

  updateDataExport(dataExport: DataExport) {
    this.dataExportService
      .update(dataExport)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('DataExportja u ndryshua me sukses!');
          this.displayModal = false;
          this.getDataExports(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të dataExportsë!'
          );
      });
  }

  deleteDataExport(dataExport: DataExport) {
    this.dataExportService
      .delete(dataExport.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('data-export-ja u fshi me sukses!');
          this.getDataExports(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të data-export-së!'
          );
      });
  }

  getParentDataExportsDropdown(current: number | null = null) {
    this.dataExportService
      .loadDropdownList(current)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.parentDataExports = response.data;
      });
  }

  getRolesDropdown() {
    this.rolesService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.roles = response.data;
      });
  }
}
