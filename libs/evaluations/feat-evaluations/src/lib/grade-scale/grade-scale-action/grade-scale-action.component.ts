import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GradesScaleService } from '@msh/evaluations/data-access-evaluations';
import { GradesScale } from '@msh/evaluations/domain-evaluations';
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
import { BehaviorSubject, map, tap } from 'rxjs';
import { GradeModalFormComponent } from '../grade-form/grade-form.component';

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
  values: BehaviorSubject<any> = new BehaviorSubject([]);
  gradeScales = this.values.asObservable();
  examSubjectId: any;
  @Input() hasActions = true;
  @Input() examSubjectIdDialog = null;
  displayModal?: boolean;
  selectedGradeScale: GradesScale | null = null;
  title: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(
    private gradesScaleApiService: GradesScaleService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private toastService: GlobalToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.examSubjectId = this.route.snapshot.params['examSubjectId'];
    this.getGradeScales(this.examSubjectId);
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
    const scalesList = this.values.value as GradesScale[];
    if (scalesList[0].grade > newGradeScale.grade) {
      return scalesList[0].score > newGradeScale.score;
    }
    if (scalesList[scalesList.length - 1].grade < newGradeScale.grade) {
      return scalesList[scalesList.length - 1].score < newGradeScale.score;
    }
    for (let i = 1; i < scalesList.length - 1; i++) {
      if (
        scalesList[i - 1].grade < newGradeScale.grade &&
        newGradeScale.grade < scalesList[i].grade
      ) {
        return (
          scalesList[i - 1].score < newGradeScale.score &&
          newGradeScale.score < scalesList[i].score
        );
      }
    }
    return;
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
          this.getGradeScales(this.examSubjectId);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes së rolit!'
          );
      });
  }
  getGradeScales(id: number) {
    this.gradesScaleApiService
      .getScale(this.examSubjectId)
      .pipe(
        map(gradeScalesApiResponse => gradeScalesApiResponse.data),
        tap(gradeScales =>
          gradeScales.sort((previous, next) => previous.score - next.score)
        )
      )
      .subscribe({
        next: (gradeScales: any) => {
          this.values.next(gradeScales);
          gradeScales.length > 0
            ? this.title.next(gradeScales[0].examSubjectName)
            : '';
        },
        error: err => {
          err.errorMessage
            ? this.toastService.showError(err.errorMessage)
            : this.toastService.showError('Ndodhi një problem !');
        },
      });
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
            this.getGradeScales(this.examSubjectId);
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
          this.getGradeScales(this.examSubjectId);
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të përshkallëzimit!'
          );
      });
  }
}
