import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToolbarModule} from "primeng/toolbar";
import {ExamResultsFormComponent} from "../exam-results-form/exam-results-form.component";
import {ExamResultsGridComponent} from "../exam-results-grid/exam-results-grid.component";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {BehaviorSubject} from "rxjs";
import {HighSchool} from "@msh/configurations/domain-configurations";
import {DropdownModel} from "@msh/shared/data-access-shared";
import {GlobalToastService, GRID_ACTIONS, GridEvent} from "@msh/shared/util-shared";
import {
  AdministrationOfficeApiService,
  CityApiService,
  HighSchoolApiService, RegionApiService
} from "@msh/configurations/data-access-configurations";
import {untilDestroyed} from "@ngneat/until-destroy";
import {ExamResultApiService} from "@msh/evaluations/data-access-evaluations";
import {ExamResult} from "@msh/evaluations/domain-evaluations";

@Component({
  selector: 'msh-manage-exam-result',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamResultsFormComponent,
    ExamResultsGridComponent,
    ToolbarModule
  ],
  templateUrl: './manage-exam-results.component.html',
  styleUrls: ['./manage-exam-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],

})
export class ManageExamResultsComponent {
  private examResults$$ = new BehaviorSubject<ExamResult[]>([]);
  examResults$ = this.examResults$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamResult: ExamResult | null = null;
  selectedExamResults: ExamResult[] = [];
  displayModal = false;


  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examResultService: ExamResultApiService,
  ) {}



  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    //
  }

  onGridEvent(event: GridEvent<ExamResult | ExamResult[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamResults = [
          ...this.selectedExamResults,
          event.data as ExamResult,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedExamResults = this.selectedExamResults.filter(hs => {
          hs.id !== (event.data as ExamResult).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedExamResults = [
          ...this.selectedExamResults,
          ...(event.data as ExamResult[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedExamResults = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamResult = Object.assign({}, event.data as ExamResult);
        this.displayModal = true;
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examResult: ExamResult) {
    if (examResult.id) {
      this.updateExamResult(examResult);
    }
  }

  getExamResults(examResult: ExamResult) {
    this.filters = Object.assign({}, $event);

    this.examResultService
      .loadExamResults($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examResults$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  updateHighSchool(highSchool: HighSchool) {
    // this.highSchoolService
    //   .update(highSchool)
    //   .pipe(untilDestroyed(this))
    //   .subscribe(response => {
    //     if (response.isSuccessful) {
    //       this.toastService.showSuccess(
    //         'Shkolla e mesme u ndryshua me sukses!'
    //       );
    //       this.displayModal = false;
    //       this.getHighSchools(this.filters as LazyLoadEvent);
    //     }
    //
    //     if (response.isBadRequest)
    //       this.toastService.showError(
    //         'Ndodhi një problem gjatë ndryshimit së shkollës së mesme!'
    //       );
    //   });
  }

}
