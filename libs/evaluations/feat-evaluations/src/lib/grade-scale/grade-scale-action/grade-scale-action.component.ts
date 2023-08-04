import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamSubjectApiService } from '@msh/configurations/data-access-configurations';
import { GradesScaleService } from '@msh/evaluations/data-access-evaluations';
import { GlobalToastService } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { GradeModalFormComponent } from '../grade-form/grade-form.component';
import { GradesScale } from '@msh/shared/domain-models';

@Component({
  selector: 'msh-grade-scale-action',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    GradeModalFormComponent,
  ],
  templateUrl: './grade-scale-action.component.html',
  styleUrls: ['./grade-scale-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class GradeScaleActionComponent {
  gradeScales$: BehaviorSubject<any> = new BehaviorSubject([]);
  gradeScales = this.gradeScales$.asObservable();
  examSubjectId: any;
  @Input() hasActions = true;
  @Input() examSubjectIdDialog = null;
  displayModal?: boolean;
  selectedGradeScale: GradesScale | null = null;
  examSubject: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private gradesScaleApiService: GradesScaleService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private toastService: GlobalToastService,
    private router: Router,
    private examSubjectApiService: ExamSubjectApiService
  ) {}

  ngOnInit() {
    this.examSubjectId = this.route.snapshot.params['examSubjectId'];
    this.initializeTable();
  }

  private initializeTable() {
    const apiCalls = [
      this.getGradeScales(this.examSubjectId),
      this.getExamSubjectById(this.examSubjectId),
    ];
    combineLatest(apiCalls)
      .pipe(untilDestroyed(this))
      .subscribe(([gradeScales, examSubject]) => {
        const examSubjectChoosen = examSubject.data.find(
          (subject: any) => subject.key === this.examSubjectId
        );
        this.gradeScales$.next(gradeScales);
        this.examSubject.next(examSubjectChoosen.value);
      });
  }

  getExamSubjectById(examSubjectId: string): Observable<any> {
    return this.examSubjectApiService.loadDropDownList(examSubjectId);
  }

  onModalClose() {
    this.displayModal = false;
    this.selectedGradeScale = null;
  }

  onFormSave(gradeScale: GradesScale) {
    if (!this.areScoresValid(gradeScale)) {
      this.toastService.showError(
        'Bazuar në të dhënat e mëparshme pikët dhe nota e vendosur ndodhen në një interval të gabuar'
      );
      return;
    }
    if (gradeScale.id) {
      this.updateGradeScales(gradeScale);
    }
    if (!gradeScale.id) {
      this.addGradeScales(gradeScale);
    }
  }
  areScoresValid(newGradeScale: GradesScale) {
    const gradeScalesList = this.gradeScales$.value as GradesScale[];
    if (newGradeScale.id) {
      const index = gradeScalesList.findIndex(
        data => data.id === newGradeScale.id
      );
      index !== -1 ? gradeScalesList.splice(index, 1) : '';
    }
    if (gradeScalesList.length <= 0) {
      return true;
    }
    if (gradeScalesList[0].grade > newGradeScale.grade) {
      return gradeScalesList[0].score > newGradeScale.score;
    }
    if (
      gradeScalesList[gradeScalesList.length - 1].grade < newGradeScale.grade
    ) {
      return (
        gradeScalesList[gradeScalesList.length - 1].score < newGradeScale.score
      );
    }
    for (let i = 1; i < gradeScalesList.length; i++) {
      const insideRangeOfGrades =
        gradeScalesList[i - 1].grade < newGradeScale.grade &&
        newGradeScale.grade < gradeScalesList[i].grade;
      // check if new grade choosen is in the middle of the current iteration grade and the previous one.If this condition doesnt fail check if scores are in the correct order to
      if (insideRangeOfGrades) {
        const insideRangeOfScores =
          gradeScalesList[i - 1].score < newGradeScale.score &&
          newGradeScale.score < gradeScalesList[i].score;
        return insideRangeOfScores;
      }
    }
    return true;
  }

  onEditClick(gradeScale: GradesScale) {
    this.selectedGradeScale = Object.assign({}, gradeScale as GradesScale);
    this.displayModal = true;
  }
  onDeleteClick(gradeScale: GradesScale) {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini përshkallëzimin e zgjedhur?',
      accept: () => {
        this.deleteGradeScale(gradeScale as GradesScale);
      },
    });
  }

  onExitForm() {
    this.router.navigate(['/evaluations/grades-scale']);
  }

  onNewClick() {
    this.displayModal = true;
  }
  deleteGradeScale(gradeScale: GradesScale) {
    this.gradesScaleApiService
      .delete(gradeScale?.id)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Përshkallëzimi u fshi me sukses!');
          this.initializeTable();
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së përshkallëzimit!'
          );
      });
  }
  getGradeScales(id: number): Observable<any> {
    return this.gradesScaleApiService.getScale(this.examSubjectId).pipe(
      map(gradeScalesApiResponse => gradeScalesApiResponse.data),
      tap(gradeScales =>
        gradeScales.sort((previous, next) => previous.score - next.score)
      )
    );
  }
  addGradeScales(gradesScale: GradesScale) {
    gradesScale.examSubjectId = this.examSubjectId;
    this.gradesScaleApiService
      .save(gradesScale)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          if (response.isSuccessful) {
            this.toastService.showSuccess('Përshkallëzimi u shtua me sukses!');
            this.displayModal = false;
            this.initializeTable();
          } else {
            response.errorMessage
              ? this.toastService.showError(response.errorMessage)
              : this.toastService.showError(
                  'Ndodhi një problem gjatë shtimit të përshkallëzimit!'
                );
          }
          if (response.isBadRequest)
            this.toastService.showError(
              'Ndodhi një problem gjatë shtimit të  përshkallëzimit!'
            );
        },
        error: error => {
          error.errorMessage
            ? this.toastService.showError(error.errorMessage)
            : this.toastService.showError(
                'Ndodhi një problem gjatë shtimit të përshkallëzimit!'
              );
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të përshkallëzimit!'
          );
        },
      });
  }

  updateGradeScales(gradesScale: GradesScale) {
    gradesScale.examSubjectId = this.examSubjectId;
    this.gradesScaleApiService
      .update(gradesScale)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Përshkallëzimi u ndryshua me sukses!');
          this.displayModal = false;
          this.initializeTable();
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të përshkallëzimit!'
          );
      });
  }
}
