import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  ArchiveExamApiService,
  ArchiveFolderApiService,
  ExamScoreApiService,
} from '@msh/evaluations/data-access-evaluations';
import { BehaviorSubject, forkJoin } from 'rxjs';
import {
  ExamScore,
  ExamScoreDataEntry,
  ExamScores,
} from '@msh/evaluations/domain-evaluations';
import { DropdownModule } from 'primeng/dropdown';
import { ExamScoreTabularDataEntryFiltersComponent } from '../exam-score-tabular-data-entry-filters/exam-score-tabular-data-entry-filters.component';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamScoreTabularDataEntryListComponent } from '../exam-score-tabular-data-entry-list/exam-score-tabular-data-entry-list.component';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-score-tabular-data-entry',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    ExamScoreTabularDataEntryFiltersComponent,
    ExamScoreTabularDataEntryListComponent,
    ConfirmDialogModule,
  ],
  templateUrl: './manage-exam-score-tabular-data-entry.component.html',
  styleUrls: ['./manage-exam-score-tabular-data-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamScoreTabularDataEntryComponent implements OnInit {
  private examScoreList$$ = new BehaviorSubject<ExamScoreDataEntry[]>([]);
  examScoreList$ = this.examScoreList$$.asObservable();
  totalRecords = 0;
  filters: LazyLoadEvent | null = null;
  archiveFolder: DropdownModel<number>[] = [];
  selectedExamScoreList: any | null;
  examTypeId: any;
  examSubjectId: any;
  examTypeName: any;
  examSubjectName: any;

  event = {
    first: 0,
    rows: 10000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  constructor(
    private readonly archiveExamService: ArchiveExamApiService,
    private readonly examScoreService: ExamScoreApiService,
    private readonly archiveFolderService: ArchiveFolderApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit() {
    this.getArchiveFolders();
  }

  onGridEvent(event: GridEvent<ExamScores | ExamScores[]>) {
    switch (event.action) {
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini rezultatin e  provimit të zgjedhur?',
          accept: () => {
            this.deleteExamScore(event.data as ExamScores);
          },
        });
        break;
    }
  }
  getExamScoresListById($event: any) {
    debugger;
    this.filters = Object.assign({}, $event);
    this.event.filters = {
      archiveFolderId: [
        {
          value: $event.archiveFolderId,
          matchMode: 'contains',
          operator: 'and',
        },
      ],
      hasWritingScore: [
        {
          value: $event.hasWritingScore,
          matchMode: 'contains',
          operator: 'and',
        },
      ],
    };
    forkJoin([
      this.archiveExamService.getExamsByFolderId($event.archiveFolderId),
      this.examScoreService.loadExamScores(this.event),
      this.archiveFolderService.getById($event.archiveFolderId),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([archiveExams, examScores, archiveFolders]) => {
        (this.examSubjectId = archiveFolders.data.examSubjectId),
          (this.examTypeId = archiveFolders.data.examTypeId),
          (this.examTypeName = archiveFolders.data.examTypeName),
          (this.examSubjectName = archiveFolders.data.examSubjectName),
          examScores.data.map((item: any) => (item.hasWritingScore = true));
        const result = archiveExams.data.map(
          (archiveExam: { barcode: string }) => {
            return {
              archiveExam: archiveExam,
              examScore:
                examScores.data.find(
                  (examScore: { barcode: string }) =>
                    examScore.barcode == archiveExam.barcode
                ) ?? ({} as ExamScore),
            } as unknown as ExamScoreDataEntry;
          }
        );
        this.examScoreList$$.next(result);
        console.log(12, result);
      });
  }

  saveExamScore(examScore: any) {
    this.examScoreService
      .save(examScore)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Piket Totale u shtuan me sukses!');
          this.getExamScoresListById(this.filters as LazyLoadEvent);
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të pikeve!'
          );
        }
      });
  }
  updateExamScore(examScore: any) {
    this.examScoreService
      .update(examScore)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Rezultati i provimit u ndryshua me sukses!'
          );
          this.getExamScoresListById(this.filters as LazyLoadEvent);
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së rezultatit të provimit!'
          );
      });
  }

  saveWritingScoreChanges(rowData: ExamScoreDataEntry) {
    const examScore: any = {
      id: rowData.examScore.id,
      archiveFolderId: rowData.archiveExam.archiveFolderId,
      archiveFolderNr: rowData.archiveExam.archiveFolderNr,
      examSubjectId: this.examSubjectId,
      barcode: rowData.archiveExam.barcode,
      examTypeId: this.examTypeId,
      writingScore: rowData.examScore.writingScore,
      multipleChoiceScore: rowData.examScore.multipleChoiceScore,
    };
    if (!rowData.examScore.hasWritingScore) {
      this.saveExamScore(examScore);
    } else {
      this.updateExamScore(examScore);
    }
  }

  deleteExamScore(examScore: any) {
    this.examScoreService
      .delete(examScore.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Rezultati i provimit u fshi me sukses!');
          this.getExamScoresListById(this.filters as LazyLoadEvent);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së rezultatit të provimit!'
          );
      });
  }

  getArchiveFolders() {
    this.archiveFolderService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.archiveFolder = response.data;
      });
  }
}
