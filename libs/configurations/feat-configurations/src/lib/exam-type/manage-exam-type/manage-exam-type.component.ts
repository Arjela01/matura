import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExamTypeStore} from "@msh/configurations/data-access-configurations";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {GlobalToastService, GRID_ACTIONS, GridEvent} from "@msh/shared/util-shared";
import {ExamType} from "@msh/configurations/domain-configurations";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToolbarModule} from "primeng/toolbar";
import {ExamTypeGridComponent} from "../exam-type-grid/exam-type-grid.component";
import {ExamTypeFormComponent} from "../exam-type-form/exam-type-form.component";

@Component({
  selector: 'msh-manage-exam-type',
  standalone: true,
  imports: [CommonModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    ExamTypeGridComponent,
    ExamTypeFormComponent,

  ],
  templateUrl: './manage-exam-type.component.html',
  styleUrls: ['./manage-exam-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ExamTypeStore, ConfirmationService],

})
export class ManageExamTypeComponent {
  examTypes$ = this.examTypeStore.examTypes$;
  hasSelectedExamTypes$ = this.examTypeStore.hasSelectedExamTypes$;
  activeExamTypes$ = this.examTypeStore.activeExamTypes$;

  examTypeDialog = false;


  constructor(
    private readonly examTypeStore: ExamTypeStore,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService
  ) {
  }


  onNewClick() {
    this.examTypeStore.setActiveExamType(null);
    this.examTypeDialog = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete selected entities?',
      accept: () => {
        this.examTypeStore.deleteSelectedExamTypes();
        this.toastService.showWarning('Exam Type is deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<ExamType | ExamType[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.examTypeStore.selectExamType(event.data as ExamType);
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.examTypeStore.unSelectExamType(event.data as ExamType);
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.examTypeStore.selectManyExamTypes(event.data as ExamType[]);
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.examTypeStore.unselectAllExamTypes();
        break;
      case GRID_ACTIONS.EDIT:
        this.examTypeStore.setActiveExamType(event.data as ExamType);
        this.examTypeDialog = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this entity?',
          accept: () => {
            this.examTypeStore.deleteExamType(event.data as ExamType);
            this.toastService.showWarning('Exam Type deleted!');
          },
        });
        break;
    }
  }

  onFormClose() {
    this.examTypeDialog = false;
  }

  onFormSave(examType: ExamType) {
    if (examType.id) {
      this.examTypeStore.updateExamType(examType);
      this.toastService.showSuccess('Exam Type Updated!');
    }
    if (!examType.id) {
      this.examTypeStore.addExamType(examType);
      this.toastService.showSuccess('Exam Type Added!');
    }
    this.examTypeDialog = false;

  }

  getExamTypes($event: LazyLoadEvent) {
    this.examTypeStore.loadExamTypes($event);

  }
}
