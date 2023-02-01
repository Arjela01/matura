import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamSecret } from '@msh/evaluations/domain-evaluations';
import {
  AcademicYearApiService,

} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {RippleModule} from "primeng/ripple";
import {ExamSecretApiService} from "@msh/evaluations/data-access-evaluations";
import {ExamSecretsFormComponent} from "../exam-secrets-form/exam-secrets-form.component";
import {ExamSecretsGridComponent} from "../exam-secrets-grid/exam-secrets-grid.component";

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-score',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamSecretsFormComponent,
    ExamSecretsGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-exam-secrets.component.html',
  styleUrls: ['./manage-exam-secrets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamSecretsComponent implements OnInit {
  private examSecrets$$ = new BehaviorSubject<ExamSecret[]>([]);
  examSecrets$ = this.examSecrets$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamSecret: ExamSecret | null = null;
  selectedExamSecrets: ExamSecret[] = [];
  displayModal = false;

  academicYears: DropdownModel<number>[] = [];
  students: DropdownModel<number>[] = [];


  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examSecretService: ExamSecretApiService,
    private readonly academicYearApiService: AcademicYearApiService,

  ) {}

  ngOnInit(): void {
    this.getAcademicYearsDropdown();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedExamSecret = {
      id: '',
      studentId: '',
      studentName: '',
      examVersionId: '',
      examVersionName: '',
      academicYearId: 0,
      academicYear: '',
      barcode: '',
      isFall: true
    }
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini elementët e zgjedhur?',
      accept: () => {
        this.toastService.showWarning(' është fshirë');
      },
    });
  }

  onGridEvent(event: GridEvent<ExamSecret | ExamSecret[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamSecrets = [
          ...this.selectedExamSecrets,
          event.data as ExamSecret,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedExamSecrets = this.selectedExamSecrets.filter(es => {
          es.id !== (event.data as ExamSecret).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedExamSecrets = [
          ...this.selectedExamSecrets,
          ...(event.data as ExamSecret[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedExamSecrets = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamSecret = Object.assign({}, event.data as ExamSecret);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini rezultatin e zgjedhur?',
          accept: () => {
            this.deleteExamSecret(event.data as ExamSecret);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examScore: ExamSecret) {
    if (examScore.id) {
      this.updateExamScore(examScore);
    }
    if (!examScore.id) {
      this.addExamScore(examScore);
    }
  }

  getExamScores($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examSecretService
      .loadExamSecrets($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSecrets$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addExamScore(examScore: ExamSecret) {
    // this.examScoreService
    //   .save(examScore)
    //   .pipe(untilDestroyed(this))
    //   .subscribe(response => {
    //     if (response.isSuccessful) {
    //       this.toastService.showSuccess(
    //         'Rezultati i provimit u shtua me sukses!'
    //       );
    //       this.displayModal = false;
    //       this.getExamScores(this.filters as LazyLoadEvent);
    //     } else {
    //       this.toastService.showError(
    //           response.errorMessage
    //       );
    //     }
    //     if (response.isBadRequest)
    //       this.toastService.showError(
    //         'Ndodhi një problem gjatë ndryshimit së reszultatit të provimit!'
    //       );
    //   });
  }

  updateExamScore(examScore: ExamSecret) {
    // this.examScoreService
    //   .update(examScore)
    //   .pipe(untilDestroyed(this))
    //   .subscribe(response => {
    //     if (response.isSuccessful) {
    //       this.toastService.showSuccess(
    //         'Rezultati i provimit u ndryshua me sukses!'
    //       );
    //       this.displayModal = false;
    //       this.getExamScores(this.filters as LazyLoadEvent);
    //     }
    //     if (response.isBadRequest)
    //       this.toastService.showError(
    //         'Ndodhi një problem gjatë ndryshimit së rezultatit të provimit!'
    //       );
    //   });
  }

  deleteExamSecret(examSecret: ExamSecret) {
    this.examSecretService
      .delete(examSecret.id)
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

  getAcademicYearsDropdown() {
    this.academicYearApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.academicYears = response.data;
      });
  }

}
