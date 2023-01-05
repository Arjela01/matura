import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GlobalToastService } from '@msh/shared/util-shared';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  AdministrationOfficeApiService,
  CityApiService,
  HighSchoolStore,
  RegionApiService,
} from '@msh/configurations/data-access-configurations';
import { HighSchool } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';

import { HighSchoolFormComponent } from '../high-school-form/high-school-form.component';
import { HighSchoolGridComponent } from '../high-school-grid/high-school-grid.component';

@Component({
  selector: 'msh-manage-high-schools',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    HighSchoolGridComponent,
    HighSchoolFormComponent,
    ToolbarModule,
  ],
  templateUrl: './manage-high-schools.component.html',
  styleUrls: ['./manage-high-schools.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HighSchoolStore, ConfirmationService],
})
export class ManageHighSchoolsComponent implements OnInit {
  highSchools$ = this.highSchoolStore.highSchools$;
  totalRecords$ = this.highSchoolStore.totalRecords$;
  hasSelectedHighSchools$ = this.highSchoolStore.hasSelectedHighSchools$;
  activeHighSchool$ = this.highSchoolStore.activeHighSchool$;
  isModalVisible$ = this.highSchoolStore.isModalVisible$;

  cities: DropdownModel<number>[] = [];
  administrationOffices: DropdownModel<number>[] = [];
  regions: DropdownModel<number>[] = [];

  constructor(
    private readonly highSchoolStore: HighSchoolStore,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly cityApiService: CityApiService,
    private readonly administrationOfficeApiService: AdministrationOfficeApiService,
    private readonly regionApiService: RegionApiService
  ) {}

  ngOnInit(): void {
    this.getAdministrationOfficeDropdown();
    this.getCitiesDropdown();
    this.getRegionDropdown();
  }

  onNewClick() {
    this.highSchoolStore.setActiveHighSchool(null);
    this.highSchoolStore.showModal();
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini shkollat e zgjedhura?',
      accept: () => {
        //this.highSchoolStore.deleteSelectedHighSchools();
        this.toastService.showWarning('High Schools deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<HighSchool | HighSchool[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.highSchoolStore.selectHighSchool(event.data as HighSchool);
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.highSchoolStore.unSelectHighSchool(event.data as HighSchool);
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.highSchoolStore.selectManySchools(event.data as HighSchool[]);
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.highSchoolStore.unselectAllHighSchools();
        break;
      case GRID_ACTIONS.EDIT:
        this.highSchoolStore.setActiveHighSchool(event.data as HighSchool);
        this.highSchoolStore.showModal();
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini shkollën e zgjedhur?',
          accept: () => {
            this.highSchoolStore.deleteHighSchool(event.data as HighSchool);
            this.toastService.showWarning('High School deleted!');
          },
        });
        break;
    }
  }

  onModalClose() {
    this.highSchoolStore.hideModal();
  }

  onFormSave(highSchool: HighSchool) {
    if (highSchool.id) {
      this.highSchoolStore.updateHighSchool(highSchool);
    }
    if (!highSchool.id) {
      this.highSchoolStore.saveHighSchool(highSchool);
    }
  }

  getHighSchools($event: LazyLoadEvent) {
    this.highSchoolStore.loadHighSchools($event);
  }

  getCitiesDropdown() {
    this.cityApiService.loadDropdownList().subscribe(response => {
      this.cities = response.data;
    });
  }

  getAdministrationOfficeDropdown() {
    this.administrationOfficeApiService
      .loadDropdownList()
      .subscribe(response => {
        this.administrationOffices = response.data;
      });
  }

  getRegionDropdown() {
    this.regionApiService.loadDropdownList().subscribe(response => {
      this.regions = response.data;
    });
  }
}
