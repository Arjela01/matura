import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { GradesScaleService } from '@msh/evaluations/data-access-evaluations';
import { GradesScale } from '@msh/evaluations/domain-evaluations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { GradeScaleFormComponent } from '../grade-scale-form/grade-scale-form.component';
import { GradeScaleGridComponent } from '../grade-scale-grid/grade-scale-grid.component';

@Component({
  selector: 'msh-manage-grades-scale',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    GradeScaleFormComponent,
    GradeScaleGridComponent,
    ToolbarModule,
    RippleModule,
    FileUploadModule,
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
  base64: string | ArrayBuffer | null | undefined;
  totalRecords = 0;

  constructor(
    private readonly gradesScaleApiService: GradesScaleService,
    private readonly router: Router
  ) {}

  onNewClick() {
    this.router.navigate(['/evaluations/grades-scale-form']);
  }
  onGridEvent(event: GridEvent<GradesScale>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.router.navigate([
          '/evaluations/grades-scale-form',
          event.data?.examSubjectId,
        ]);
        break;
    }
  }

  getGradeScales($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    this.gradesScaleApiService
      .loadGradesScale($event)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.gradeScales$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  // onUpload(event: any) {
  //   const file = event.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     const base64 = reader.result as string;
  //     this.base64 = base64.split(',')[1];
  //     this.examSecretService
  //       .uploadExcelFile(this.base64)
  //       .subscribe((response: any) => {
  //         if (response.isSuccessful) {
  //           this.toastService.showSuccess('Dokumenti u shtua me sukses!');
  //         }
  //         if (response.isBadRequest)
  //           this.toastService.showError(
  //             'Ndodhi një problem gjatë ngarkimit të dokumentit!'
  //           );
  //       });
  //   };
  // }
}
