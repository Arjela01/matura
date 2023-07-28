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
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { GlobalToastService } from '@msh/shared/util-shared';
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
import {ExamSecret, ExamSecretSearchModel, ExamSecretTabularDataEntryItem} from '@msh/evaluations/domain-evaluations';
import {ExamDate, ExamDateTableView} from "@msh/shared/domain-models";

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
  ],
  templateUrl: './manage-exam-secret-tabular-data-entry.component.html',
  styleUrls: ['./manage-exam-secret-tabular-data-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamSecretTabularDataEntryComponent implements OnInit {
  private dataEntryItemList$$ = new BehaviorSubject<ExamSecretTabularDataEntryItem[]>([]);
  dataEntryItemList$ = this.dataEntryItemList$$.asObservable();
  filters: LazyLoadEvent | null = null;
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

  onApplySearch(event: ExamSecretSearchModel) {
    forkJoin([
      this.examAssignmentApiService.forExamDateId(event.examDateId),
      this.examSecretService.forExamSubjectId(event.examSubjectId),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([examAssignmentsResponse, examSecretsResponse]) => {
        const result =examAssignmentsResponse.data.map(x => {
          return {
            examAssignment: x,
            examSecret: examSecretsResponse.data.find(i => i.examTypeId == x.examTypeId && i.studentId == x.studentId) ??
                {} as ExamSecret
          } as ExamSecretTabularDataEntryItem;
        });
        this.dataEntryItemList$$.next(result);
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
        this.cd.markForCheck();
      });
  }

  loadExamTypes($event: ExamSecretSearchModel) {
    this.examTypeService
      .getExamTypesForSiteId($event.examSiteId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examTypes = response.data;
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
  }

  loadExamDates($event: ExamSecretSearchModel) {
    this.examDateService.forExamSiteAndExamType($event.examSiteId, $event.examTypeId)
        .subscribe(response => {
      this.examDates = [...response.data];
      this.cd.markForCheck();
    });
  }
}
