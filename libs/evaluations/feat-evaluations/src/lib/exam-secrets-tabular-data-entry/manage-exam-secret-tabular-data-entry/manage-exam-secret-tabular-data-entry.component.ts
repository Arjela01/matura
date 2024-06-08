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
  ExamAssignment,
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
  examSecretTabularDataEntryItems: ExamSecretTabularDataEntryItem[] = [];

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
            i =>
              i.examTypeId === x.examTypeId &&
              i.studentId === x.studentGuid &&
              i.isFall == x.isFall
          );
          result.push({
            examAssignment: x,
            examSecret: examSecret || this.prepExamSecret(x),
          });
        });

        this.examSecretTabularDataEntryItems = result.map((entry: any) => ({
          ...entry,
          examSecret: entry.examSecret as ExamSecretTabularDataEntryItem,
        }));
        this.dataEntryItemList$$.next(this.examSecretTabularDataEntryItems);
        this.cd.detectChanges();

        if (examSecret !== undefined) {
          const currentBarcodeInput = document.querySelector<HTMLInputElement>(
            `[examAssignmentId='${examSecret.id}']`
          );

          if (currentBarcodeInput) {
            const currentRow = currentBarcodeInput.closest('tr');

            if (currentRow) {
              const nextRow =
                currentRow.nextElementSibling as HTMLTableRowElement;

              if (nextRow) {
                const nextRowBarcodeInput =
                  nextRow.querySelector<HTMLInputElement>(
                    'input[name="barcode"]'
                  );

                if (nextRowBarcodeInput) {
                  nextRowBarcodeInput.focus();
                }
              }
            }
          }
        }
      });
  }

  prepExamSecret(x: ExamAssignment) {
    return {
      administrationOfficeId: x.administrationOfficeId,
      examSiteId: x.examSiteId,
      examTypeId: x.examTypeId,
      examDateId: x.examDateId,
      examSubjectId: x.examSubjectId,
    } as ExamSecret;
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

  save(examSecret: ExamSecret, rowItem: ExamSecretTabularDataEntryItem) {
    this.examSecretService
      .save(examSecret)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.responseSuccessful = true;
          console.log('save');
          const entryItem = this.examSecretTabularDataEntryItems.find(
            x => x.examAssignment.id == rowItem.examAssignment.id
          );
          if (entryItem) {
            entryItem.examSecret = response.data;
            this.dataEntryItemList$$.next([
              ...this.examSecretTabularDataEntryItems,
            ]);
            this.cd.markForCheck();
          } else {
            console.log('not found');
          }
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

          const entryItem = this.examSecretTabularDataEntryItems.find(
            x => x.examSecret.id == examSecret.id
          );
          if (entryItem) {
            entryItem.examSecret = response.data;
            this.dataEntryItemList$$.next([
              ...this.examSecretTabularDataEntryItems,
            ]);
            this.cd.markForCheck();
          }
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
          const entryItem = this.examSecretTabularDataEntryItems.find(
            x => x.examSecret.id == examSecret.id
          );
          if (entryItem) {
            entryItem.examSecret = this.prepExamSecret(
              entryItem.examAssignment
            );

            this.dataEntryItemList$$.next([
              ...this.examSecretTabularDataEntryItems,
            ]);
            this.cd.markForCheck();
          }
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

  addOrUpdateExamSecret(rowItem: ExamSecretTabularDataEntryItem) {
    const saveTarget: ExamSecret = {
      id: rowItem.examSecret.id,
      examAssignmentId: rowItem.examAssignment.id,
      studentId: rowItem.examAssignment.studentId,
      administrationOfficeId: rowItem.examAssignment.administrationOfficeId,
      examSiteId: rowItem.examAssignment.examSiteId,
      examTypeId: rowItem.examAssignment.examTypeId,
      examDateId: rowItem.examAssignment.examDateId,
      examSubjectId: rowItem.examAssignment.examSubjectId,
      barcode: rowItem.examSecret.barcode,
      isFall: rowItem.examAssignment.isFall,
      examSecretNoteId: rowItem.examSecret.examSecretNoteId,
    };
    if (!saveTarget.id) {
      this.save(saveTarget, rowItem);
    } else {
      this.update(saveTarget);
    }
  }
}
