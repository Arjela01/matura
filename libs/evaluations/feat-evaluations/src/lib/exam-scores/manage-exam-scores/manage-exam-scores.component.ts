import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToolbarModule} from "primeng/toolbar";
import {ExamScoresFormComponent} from "../exam-scores-form/exam-scores-form.component";
import {ExamScoresGridComponent} from "../exam-scores-grid/exam-scores-grid.component";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {BehaviorSubject} from "rxjs";
import {GlobalToastService, GRID_ACTIONS, GridEvent} from "@msh/shared/util-shared";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ExamScoreApiService} from "@msh/evaluations/data-access-evaluations";
import {ExamScore} from "@msh/evaluations/domain-evaluations";

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-score',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamScoresFormComponent,
    ExamScoresGridComponent,
    ToolbarModule
  ],
  templateUrl: './manage-exam-scores.component.html',
  styleUrls: ['./manage-exam-scores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],

})
export class ManageExamScoresComponent {
  private examScores$$ = new BehaviorSubject<ExamScore[]>([]);
  examScores$ = this.examScores$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamScore: ExamScore | null = null;
  selectedExamScores: ExamScore[] = [];
  displayModal = false;


  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examScoreService: ExamScoreApiService,
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

  onGridEvent(event: GridEvent<ExamScore | ExamScore[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamScores = [
          ...this.selectedExamScores,
          event.data as ExamScore,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedExamScores = this.selectedExamScores.filter(es => {
          es.id !== (event.data as ExamScore).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedExamScores = [
          ...this.selectedExamScores,
          ...(event.data as ExamScore[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedExamScores = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamScore= Object.assign({}, event.data as ExamScore);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini rezultatin e zgjedhur?',
          accept: () => {
            this.deleteExamResult(event.data as ExamScore);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examScore: ExamScore) {
    if (examScore.id) {
      this.updateExamScore(examScore);
    }
    if (!examScore.id) {
      this.addExamScore(examScore);
    }
  }

  getExamScores($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event)

    this.examScoreService
      .loadExamScores($event)
      .pipe(untilDestroyed(this))
      .subscribe( response => {
        this.examScores$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addExamScore(examScore: ExamScore) {
    this.examScoreService
      .save(examScore)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Rezultati i provimit u shtua me sukses!');
          this.displayModal = false;
          this.getExamScores(this.filters as LazyLoadEvent);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së reszultatit të provimit!'
          );
      });
  }
  updateExamScore(examScore: ExamScore) {
    this.examScoreService
      .update(examScore)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Rezultati i provimit u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getExamScores(this.filters as LazyLoadEvent);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së rezultatit të provimit!'
          );
      });
  }

  deleteExamResult(examScore: ExamScore) {
    this.examScoreService
      .delete(examScore.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Rezultati i provimit u fshi me sukses!');
          this.getExamScores(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së rezultatit të provimit!'
          );
      });
  }
}
