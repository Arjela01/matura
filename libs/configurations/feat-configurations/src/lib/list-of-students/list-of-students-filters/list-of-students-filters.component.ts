import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamAssignment } from '@msh/shared/domain-models';
import { GlobalToastService } from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'msh-list-of-students-filters',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './list-of-students-filters.component.html',
  styleUrls: ['./list-of-students-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfStudentsFiltersComponent {
  @Input() examDates: DropdownModel<string>[] = [];
  @Input() examSites: DropdownModel<number>[] = [];
  @Output() formSave = new EventEmitter<ExamAssignment>();
  @Output() examDateChanged = new EventEmitter<ExamAssignment>();

  studentList: ExamAssignment = {} as ExamAssignment;
  submitted = false;

  constructor(private readonly toastService: GlobalToastService) {}

  onExamSiteChanged(): void {
    if (this.studentList.examSiteId) {
      this.examDateChanged.emit(Object.assign({}, this.studentList));
    }
  }

  onSubmit() {
    if (this.isSearchValid(this.studentList)) {
      this.formSave.emit(this.studentList);
    } else {
      this.toastService.showError(
        'Ju lutem plotësoni të gjitha fushat e kërkuara.'
      );
    }
  }
  isSearchValid(searchModal: any) {
    return searchModal.examDateId && searchModal.examSiteId;
  }
}
