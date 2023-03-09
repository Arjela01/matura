import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExamSubjectApiService } from '@msh/configurations/data-access-configurations';
import { GradesScaleService } from '@msh/evaluations/data-access-evaluations';
import { GradesScale } from '@msh/evaluations/domain-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as FileSaver from 'file-saver';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { GradeScaleActionComponent } from '../grade-scale-action/grade-scale-action.component';
import { GradeScaleGridComponent } from '../grade-scale-grid/grade-scale-grid.component';
import { UploadGradeScaleFormComponent } from '../upload-grade-scale-form/upload-grade-scale-form.component';
@Component({
  selector: 'msh-manage-grades-scale',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    GradeScaleActionComponent,
    GradeScaleGridComponent,
    ToolbarModule,
    RippleModule,
    UploadGradeScaleFormComponent,
  ],
  templateUrl: './manage-grades-scale.component.html',
  styleUrls: ['./manage-grades-scale.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageGradesScaleComponent {
  private gradeScales$$ = new BehaviorSubject<GradesScale[]>([]);
  gradeScales$ = this.gradeScales$$.asObservable();
  filters: LazyLoadEvent | null = null;
  displayGradesModal = false;
  base64: string | ArrayBuffer | null | undefined;
  totalRecords = 0;
  examSubjectDropdown: DropdownModel<number>[] = [];
  examTypeDropdown: DropdownModel<number>[] = [];
  displayModal = false;
  private FileSaver: any;

  constructor(
    private readonly gradesScaleApiService: GradesScaleService,
    private readonly router: Router,
    private readonly toastService: GlobalToastService,
    private readonly examSubjectsService: ExamSubjectApiService
  ) {}

  ngOnInit() {
    this.getDropdownSubjects();
  }

  getDropdownSubjects() {
    this.examSubjectsService.loadDropdownList().subscribe(resp => {
      this.examSubjectDropdown = resp.data;
    });
  }

  onNewClick() {
    this.router.navigate(['/evaluations/grades-scale-form']);
  }

  onGridEvent(event: GridEvent<GradesScale>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.router.navigate([
          '/evaluations/grades-scale-form',
          event.data?.id,
        ]);
        break;
    }
  }

  getGradeScales($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    this.examSubjectsService
      .loadExamSubjects($event)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.gradeScales$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  templateDownload() {
    this.gradesScaleApiService
      .export()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        const blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'Nota_Pikë');
      });
  }

  onSubmit(event: any) {
    this.gradesScaleApiService.uploadExcelFile(event).subscribe({
      next: (response: any) => {
        this.displayModal = false;

        if (response.isSuccessful) {
          this.toastService.showSuccess('Dokumenti u shtua me sukses!');
          this.getGradeScales(this.filters as LazyLoadEvent);
        } else {
          !response.errorMessage
            ? this.toastService.showError(
                'Ndodhi një problem gjatë ngarkimit të dokumentit!'
              )
            : this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ngarkimit të dokumentit!'
          );
      },
      error: error => {
        error.errorMessage
          ? this.toastService.showError(error.errorMessage)
          : this.toastService.showError(
              'Ndodhi një problem gjatë ndryshimit të përshkallëzimit!'
            );
        this.toastService.showError(
          'Ndodhi një problem gjatë ndryshimit të përshkallëzimit!'
        );
      },
    });
  }

  onModalClose() {
    this.displayModal = false;
  }

  openDialog() {
    this.displayModal = true;
  }
}
