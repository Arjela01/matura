import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToolbarModule} from "primeng/toolbar";
import {ExamResultsFormComponent} from "../exam-results-form/exam-results-form.component";
import {ExamResultsGridComponent} from "../exam-results-grid/exam-results-grid.component";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {BehaviorSubject} from "rxjs";
import {ExamType, HighSchool} from "@msh/configurations/domain-configurations";
import {DropdownModel} from "@msh/shared/data-access-shared";
import {GlobalToastService, GRID_ACTIONS, GridEvent} from "@msh/shared/util-shared";
import {
  AdministrationOfficeApiService,
  CityApiService,
  HighSchoolApiService, RegionApiService
} from "@msh/configurations/data-access-configurations";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ExamResultApiService} from "@msh/evaluations/data-access-evaluations";
import {ExamResult} from "@msh/evaluations/domain-evaluations";

@UntilDestroy()
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
  ) {
  }


  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini elementët e zgjedhur?',
      accept: () => {
        // this.examTypeService.deleteSelectedExamTypes();
        this.toastService.showWarning(' është fshirë');
      },
    });
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
        this.selectedExamResult= Object.assign({}, event.data as ExamResult);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini rezultatin e zgjedhur?',
          accept: () => {
            this.deleteExamResult(event.data as ExamResult);
          },
        });
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
    if (!examResult.id) {
      this.addExamResult(examResult);
    }
  }

  getExamResults($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event)

    this.examResultService
      .loadExamResults($event)
      .pipe(untilDestroyed(this))
      .subscribe( response => {
        this.examResults$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addExamResult(examResult: ExamResult) {
    this.examResultService
      .save(examResult)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Rezultati i provimit u shtua me sukses!');
          this.displayModal = false;
          this.getExamResults(this.filters as LazyLoadEvent);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së reszultatit të provimit!'
          );
      });
  }
  updateExamResult(examResult: ExamResult) {
    this.examResultService
      .update(examResult)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Rezultati i provimit u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getExamResults(this.filters as LazyLoadEvent);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së rezultatit të provimit!'
          );
      });
  }

  deleteExamResult(examResult: ExamResult) {
    this.examResultService
      .delete(examResult.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Rezultati i provimit u fshi me sukses!');
          this.getExamResults(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së rezultatit të provimit!'
          );
      });
  }
}
