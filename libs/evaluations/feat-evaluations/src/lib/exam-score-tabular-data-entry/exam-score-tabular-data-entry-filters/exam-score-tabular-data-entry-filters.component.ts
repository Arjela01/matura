import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamScores } from '@msh/evaluations/domain-evaluations';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { GlobalToastService } from '@msh/shared/util-shared';

@UntilDestroy()
@Component({
  selector: 'msh-exam-score-tabular-data-entry-filters',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule, ButtonModule],
  templateUrl: './exam-score-tabular-data-entry-filters.component.html',
  styleUrls: ['./exam-score-tabular-data-entry-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamScoreTabularDataEntryFiltersComponent {
  @ViewChild('form', { static: true }) form!: NgForm;

  @Input() archiveFolder: DropdownModel<number>[] = [];
  @Input() examType: DropdownModel<number>[] = [];

  @Output() formSave = new EventEmitter<ExamScores>();
  @Output() archiveFolderChanged = new EventEmitter<ExamScores>();
  @Output() examTypeChanged = new EventEmitter<ExamScores>();
  @Output() loadWritingScore = new EventEmitter<ExamScores>();

  examScoreList: ExamScores = {} as ExamScores;
  submitted = false;
  hasWritingScore!: any[];

  constructor(private readonly toastService: GlobalToastService) {}

  onExamTypeChanged(): void {
    this.archiveFolderChanged.emit(Object.assign({}, this.examScoreList));
  }
  onSubmit() {
    if (this.isSearchValid(this.examScoreList)) {
      this.formSave.emit(this.examScoreList);
    } else {
      this.toastService.showError(
        'Ju lutem plotësoni të gjitha fushat e kërkuara.'
      );
    }
  }
  isSearchValid(searchModal: any) {
    return searchModal.archiveFolderId && searchModal.examTypeId;
  }
}
