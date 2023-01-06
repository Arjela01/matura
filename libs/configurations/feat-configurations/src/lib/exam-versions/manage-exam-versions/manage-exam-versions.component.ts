import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {HighSchoolGridComponent} from "../../high-schools/high-school-grid/high-school-grid.component";
import {HighSchoolFormComponent} from "../../high-schools/high-school-form/high-school-form.component";
import {ToolbarModule} from "primeng/toolbar";
import {ExamVersionStore} from "@msh/configurations/data-access-configurations";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {GlobalToastService, GRID_ACTIONS, GridEvent} from "@msh/shared/util-shared";
import {ExamVersion} from "@msh/configurations/domain-configurations";
import {HighSchoolApiService} from "../../../../../data-access-configurations/src/lib/high-school/high-school-api.service";

@Component({
  selector: 'msh-manage-exam-versions',
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
  templateUrl: './manage-exam-versions.component.html',
  styleUrls: ['./manage-exam-versions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ExamVersionStore, ConfirmationService],

})
export class ManageExamVersionsComponent implements OnInit {
  examVersions$ = this.examVersionStore.examVersions$;
  hasSelectedExamVersions$ = this.examVersionStore.hasSelectedExamVersions$;
  activeExamVersions$ = this.examVersionStore.activeExamVersions$;

  examVersionDialog = false;

  constructor(
    private readonly examVersionStore: ExamVersionStore,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly highSchoolApiService: HighSchoolApiService
  ) {}



  onNewClick() {
    this.examVersionStore.setActiveExamVersion(null);
    this.examVersionDialog = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete selected entities?',
      accept: () => {
        this.examVersionStore.deleteSelectedExamVersions();
        this.toastService.showWarning('Exam Versions deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<ExamVersion | ExamVersion[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.examVersionStore.selectExamVersion(event.data as ExamVersion);
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.examVersionStore.unSelectExamVersion(event.data as ExamVersion);
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.examVersionStore.selectManyExamVersions(event.data as ExamVersion[]);
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.examVersionStore.unselectAllExamVersions();
        break;
      case GRID_ACTIONS.EDIT:
        this.examVersionStore.setActiveExamVersion(event.data as ExamVersion);
        this.examVersionDialog = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this entity?',
          accept: () => {
            this.examVersionStore.deleteExamVersion(event.data as ExamVersion);
            this.toastService.showWarning('Exam Version deleted!');
          },
        });
        break;
    }
  }

  onFormClose() {
    this.examVersionDialog = false;
  }

  onFormSave(examVersion: ExamVersion) {
    if (examVersion.id) {
      this.examVersionStore.updateExamVersion(examVersion);
      this.toastService.showSuccess('Exam Version Updated!');
    }
    if (!examVersion.id) {
      this.examVersionStore.addExamVersion(examVersion);
      this.toastService.showSuccess('Exam Version Added!');
    }
    this.examVersionDialog = false;
  }

  getExamVersions($event: LazyLoadEvent) {
    this.examVersionStore.loadExamVersions($event);
  }
}
