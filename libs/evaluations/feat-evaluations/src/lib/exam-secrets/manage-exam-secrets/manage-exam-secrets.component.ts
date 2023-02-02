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
  AcademicYearApiService, ExamVersionApiService,

} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {RippleModule} from "primeng/ripple";
import {ExamSecretApiService} from "@msh/evaluations/data-access-evaluations";
import {Router} from "@angular/router";
import {ExamSecretsFormComponent} from "../exam-secrets-form/exam-secrets-form.component";
import {ExamSecretsGridComponent} from "../exam-secrets-grid/exam-secrets-grid.component";
import {FileUploadModule} from "primeng/fileupload";

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-secrets',
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
    FileUploadModule,

  ],
  templateUrl: './manage-exam-secrets.component.html',
  styleUrls: ['./manage-exam-secrets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamSecretsComponent {
  private examSecrets$$ = new BehaviorSubject<ExamSecret[]>([]);
  examSecrets$ = this.examSecrets$$.asObservable();
  filters: LazyLoadEvent | null = null;
  examVersions: DropdownModel<number>[] = [];
  base64: string | ArrayBuffer | null | undefined;

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
    private readonly router: Router,
    private readonly examVersionService: ExamVersionApiService

  ) {}



  onNewClick() {
    this.router.navigate(['/evaluations/exam-secret-form']);

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

  getExamVersions() {
    this.examVersionService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examVersions = response.data;
      });
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

  // getAcademicYearsDropdown() {
  //   this.academicYearApiService
  //     .loadDropdownList()
  //     .pipe(untilDestroyed(this))
  //     .subscribe(response => {
  //       this.academicYears = response.data;
  //     });
  // }

  onUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      this.base64 = base64.split(',')[1];
      this.examSecretService.uploadExcelFile(this.base64).subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Dokumenti u shtua me sukses!');
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ngarkimit të dokumentit!'
          );
      });
    };
  }
}
