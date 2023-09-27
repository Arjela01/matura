import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ExamSecretsTabularDataEntryListComponent } from '../exam-secrets-tabular-data-entry-list/exam-secrets-tabular-data-entry-list.component';
import { ExamSecretsTabularDataEntryFormComponent } from '../exam-secrets-tabular-data-entry-form/exam-secrets-tabular-data-entry-form.component';
import { ExamSecretsFormComponent } from '../../exam-secrets/exam-secrets-form/exam-secrets-form.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import {
  AdministrationOfficeApiService,
  ExamAssignmentApiService,
  ExamDateApiService,
  ExamSiteApiService,
  ExamSubjectApiService,
  ExamTypeApiService,
} from '@msh/configurations/data-access-configurations';
import { ExamSecretsGridComponent } from '../../exam-secrets/exam-secrets-grid/exam-secrets-grid.component';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {
  ExamSecret,
  ExamSecretSearchModel,
  ExamSecretTabularDataEntryItem,
} from '@msh/shared/domain-models';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-secret-tabular-data-entry',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    ExamSecretsTabularDataEntryListComponent,
    ExamSecretsTabularDataEntryFormComponent,
    ExamSecretsFormComponent,
    ExamSecretsGridComponent,
    ButtonModule,
    ConfirmDialogModule,
  ],
  templateUrl: './manage-exam-secret-tabular-data-entry.component.html',
  styleUrls: ['./manage-exam-secret-tabular-data-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamSecretTabularDataEntryComponent implements OnInit {
  private dataEntryItemList$$ = new BehaviorSubject<
    ExamSecretTabularDataEntryItem[]
  >([]);
  dataEntryItemList$ = this.dataEntryItemList$$.asObservable();
  filters: ExamSecretSearchModel | null = null;
  examSecretSubjects: any = [];
  totalRecords = 0;
  event = {
    first: 0,
    rows: 1000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
  searchModel: ExamSecretSearchModel = {} as ExamSecretSearchModel;
  examSites: DropdownModel<string>[] = [];
  examTypes: DropdownModel<number>[] = [];
  administrationOffices: DropdownModel<number>[] = [];
  examSubjects: DropdownModel<string>[] = [];
  examDates: DropdownModel<number>[] = [];
  examSubjectId: any;
  subjectName!: any;
  data: any;
  examSecretNotes: DropdownModel<string>[] = [];
  responseSuccessful: any;
  examSecretNoteId: any;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examSecretService: ExamSecretApiService,
    private readonly administrationOfficeService: AdministrationOfficeApiService,
    private readonly examDateService: ExamDateApiService,
    private readonly examTypeService: ExamTypeApiService,
    private readonly examSubjectService: ExamSubjectApiService,
    private readonly examSiteService: ExamSiteApiService,
    private readonly examAssignmentApiService: ExamAssignmentApiService,
    private readonly cd: ChangeDetectorRef
  ) {}

  onGridEvent(event: GridEvent<ExamSecret | ExamSecret[]>) {
    switch (event.action) {
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini barkodin e zgjedhur?',
          accept: () => {
            this.deleteExamSecret(event.data as ExamSecret);
          },
        });
        break;
    }
  }
  getExamSecretNotes() {
    this.examTypeService
      .loadDropdownExamNotesList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSecretNotes = response.data;
      });
  }
  onApplySearch($event: ExamSecretSearchModel, examSecret?: ExamSecret) {
    this.filters = Object.assign({}, $event);

    forkJoin([
      this.examAssignmentApiService.forExamDateId($event.examDateId),
      this.examSecretService.forExamSubject(
        $event.examTypeId,
        $event.examSubjectId
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([examAssignmentsResponse, examSecretsResponse]) => {
        if ($event.examSubjectId) {
          examSecretsResponse.data
            .filter(item => item.examSubjectId === $event.examSubjectId)
            .map(item => {
              item.hasBarcode = true;
              this.examSubjectId = item.examSubjectId;
              this.subjectName = item.examSubjectName;
            });
        } else {
          examSecretsResponse.data.map(item => {
            item.hasBarcode = true;
            this.examSubjectId = item.examSubjectId;
          });
        }
        const result: any = [];
        examAssignmentsResponse.data.forEach(x => {
          const examSecret = examSecretsResponse.data.find(
            i => i.examTypeId === x.examTypeId && i.studentId === x.studentId
          );
          result.push({
            examAssignment: x,
            examSecret: examSecret || ({} as ExamSecret),
          });
        });

        const resultAsExamSecretTabularDataEntryItem = result.map(
          (entry: any) => ({
            ...entry,
            examSecret: entry.examSecret as ExamSecretTabularDataEntryItem,
          })

        );
        console.log(123 , examSecret)
        this.dataEntryItemList$$.next(resultAsExamSecretTabularDataEntryItem);
        this.cd.detectChanges();

        if (examSecret !== undefined) {
          setTimeout(() => {
            document
              .querySelector<HTMLInputElement>(
                `[examAssignmentId='${examSecret.id}']`
              )
              ?.focus();
          }, 100);
        }
      });
  }

  loadAdministrationOffices() {
    this.administrationOfficeService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.administrationOffices = response.data;
        this.cd.markForCheck();
      });
  }

  loadExamSites($event: ExamSecretSearchModel) {
    this.examSiteService
      .forAdministrationOffice($event.administrationOfficeId)
      .subscribe(response => {
        this.examSites = response.data;
        this.examSubjects = [];
        this.examTypes = [];
        this.examDates = [];
        this.cd.markForCheck();
      });
  }

  loadExamTypes($event: ExamSecretSearchModel) {
    this.examTypeService
      .getExamTypesForSiteId($event.examSiteId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examTypes = response.data;
        this.examDates = [];
        this.examSubjects = [];
        this.cd.markForCheck();
      });
  }

  loadExamSubjects($event: ExamSecretSearchModel) {
    this.examSubjectService
      .forExamType($event.examTypeId, undefined, undefined, undefined, true)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjects = response.data;
        this.cd.markForCheck();
      });
  }

  ngOnInit(): void {
    this.loadAdministrationOffices();
    this.getExamSecretNotes();
  }

  loadExamDates($event: ExamSecretSearchModel) {
    this.examDateService
      .forExamSiteAndExamType($event.examSiteId, $event.examTypeId)
      .subscribe(response => {
        this.examDates = [...response.data];
        this.cd.markForCheck();
      });
  }
  save(examSecret: ExamSecret) {
    this.examSecretService
      .save(examSecret)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.responseSuccessful = true;
          this.toastService.showSuccess('Ndryshimet u ruajtën  me sukses!');
          this.onApplySearch(
            this.filters as ExamSecretSearchModel,
            response.data
          );
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError('Ndodhi një problem!');
        }
      });
  }
  update(examSecret: ExamSecret) {
    this.examSecretService
      .update(examSecret)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.responseSuccessful = true;
          this.toastService.showSuccess('Ndryshimet u ruajtën  me sukses!');
          this.onApplySearch(
            this.filters as ExamSecretSearchModel,
            response.data
          );
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError('Ndodhi një problem!');
        }
      });
  }
  deleteExamSecret(examSecret: ExamSecret) {
    this.examSecretService
      .delete(examSecret.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Sekretimi u fshi!');
          this.onApplySearch(this.filters as ExamSecretSearchModel);
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi një problem gjatë fshires të sekretimit!'
          );
        }
      });
  }

  addOrUpdateExamSecret(filterResults: any) {
    const examSecret: ExamSecret = {
      id: filterResults.examAssignment.id,
      studentId: filterResults.examAssignment.studentId,
      barcode: filterResults.examSecret.barcode || null,
      examTypeId: filterResults.examAssignment.examTypeId,
      examSubjectId: this.examSubjectId,
      isFall: filterResults.examAssignment.isFall,
      examSecretNoteId: filterResults.examSecret.examSecretNoteId,
    };
    if (!filterResults.examSecret.hasBarcode) {
      this.save(examSecret);
    } else {
      this.update(filterResults.examSecret);
    }
  }
}
