import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GlobalToastService } from '@msh/shared/util-shared';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { HighSchoolStore } from '@msh/configurations/data-access-configurations';
import { HighSchool } from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { HighSchoolFormComponent } from '../high-school-form/high-school-form.component';
import { HighSchoolGridComponent } from '../high-school-grid/high-school-grid.component';
import { HighSchoolApiService } from '../../../../../data-access-configurations/src/lib/high-school/high-school-api.service';

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
  hasSelectedHighSchools$ = this.highSchoolStore.hasSelectedHighSchools$;
  activeHighSchool$ = this.highSchoolStore.activeHighSchool$;

  highSchoolDialog = false;

  constructor(
    private readonly highSchoolStore: HighSchoolStore,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly highSchoolApiService: HighSchoolApiService
  ) {}

  ngOnInit(): void {
  }

  onNewClick() {
    this.highSchoolStore.setActiveHighSchool(null);
    this.highSchoolDialog = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete selected entities?',
      accept: () => {
        this.highSchoolStore.deleteSelectedHighSchools();
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
        this.highSchoolDialog = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this entity?',
          accept: () => {
            this.highSchoolStore.deleteHighSchool(event.data as HighSchool);
            this.toastService.showWarning('High School deleted!');
          },
        });
        break;
    }
  }

  onFormClose() {
    this.highSchoolDialog = false;
  }

  onFormSave(highSchool: HighSchool) {
    if (highSchool.id) {
      this.highSchoolStore.updateHighSchool(highSchool);
      this.toastService.showSuccess('High School Updated!');
    }
    if (!highSchool.id) {
      this.highSchoolStore.addHighSchool(highSchool);
      this.toastService.showSuccess('High School Added!');
    }
    this.highSchoolDialog = false;
  }

  getHighSchools($event: LazyLoadEvent) {
    this.highSchoolApiService.loadHighSchools($event).subscribe(response => {
      const highSchools = response.data as HighSchool[];
      this.highSchoolStore.patchState({
        status: 'success',
        highSchools,
      })
    });
  }
}
