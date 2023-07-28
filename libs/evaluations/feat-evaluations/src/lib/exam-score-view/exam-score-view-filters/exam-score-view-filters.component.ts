import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveFolderApiService } from '@msh/evaluations/data-access-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamScores } from '@msh/evaluations/domain-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@UntilDestroy()
@Component({
  selector: 'msh-exam-score-view-filters',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule, ButtonModule],
  templateUrl: './exam-score-view-filters.component.html',
  styleUrls: ['./exam-score-view-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamScoreViewFiltersComponent implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;

  @Input() archiveFolder: DropdownModel<number>[] = [];

  @Output() formSave = new EventEmitter<ExamScores>();
  @Output() archiveFolderChanged = new EventEmitter<ExamScores>();
  @Output() loadWritingScore = new EventEmitter<ExamScores>();

  examScoreList: ExamScores = {} as ExamScores;
  submitted = false;
  hasWritingScore!: any[];


  constructor(private readonly archiveFolderService: ArchiveFolderApiService) {
    this.hasWritingScore = [
      { key: 'Po', value: 'Po' },
      { key: 'Jo', value: 'Jo' },
    ];
    this.hasWritingScore = [...this.hasWritingScore];
  }

  ngOnInit() {
    this.getArchiveFolders();
  }

  getArchiveFolders() {
    this.archiveFolderService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.archiveFolder = response.data;
      });
  }
  onArchiveFolderChanged(): void {
    this.archiveFolder.map(item => {
      if (item.key == this.examScoreList.archiveFolderId) {
        this.examScoreList.archiveFolderNr = item.value
      }
    })
    this.archiveFolderChanged.emit(Object.assign({}, this.examScoreList));
  }
  onWritingScoreChange() {
    this.hasWritingScore.map(item => {
      if (item.key == this.examScoreList.writingScore) {
        this.examScoreList.writingScore = item.value
      }
    })
    this.loadWritingScore.emit(Object.assign({}, this.examScoreList));
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examScoreList);
    }
  }
}
