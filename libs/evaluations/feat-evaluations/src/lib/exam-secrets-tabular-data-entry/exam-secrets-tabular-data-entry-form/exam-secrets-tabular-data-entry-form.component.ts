import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent } from 'primeng/table';
import { GlobalToastService } from '@msh/shared/util-shared';
import { ExamSecretSearchModel } from '@msh/shared/domain-models';

@UntilDestroy()
@Component({
  selector: 'msh-exam-secrets-tabular-data-entry-form',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule, ButtonModule],
  templateUrl: './exam-secrets-tabular-data-entry-form.component.html',
  styleUrls: ['./exam-secrets-tabular-data-entry-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretsTabularDataEntryFormComponent {
  @ViewChild('form', { static: true }) form!: NgForm;

  @Input() administrationOffices: DropdownModel<number>[] = [];
  @Input() examSites: DropdownModel<string>[] = [];
  @Input() examDates: DropdownModel<number>[] = [];
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() examSubjects: DropdownModel<string>[] = [];
  @Output() applySearch = new EventEmitter<ExamSecretSearchModel>();

  @Output() loadExamSites = new EventEmitter<ExamSecretSearchModel>();
  @Output() loadExamTypes = new EventEmitter<ExamSecretSearchModel>();
  @Output() loadDates = new EventEmitter<ExamSecretSearchModel>();
  @Output() loadExamDates = new EventEmitter<ExamSecretSearchModel>();
  @Output() loadBarcode = new EventEmitter<ExamSecretSearchModel>();
  @Output() loadExamSubjects = new EventEmitter<ExamSecretSearchModel>();

  submitted = false;
  @Input() totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  examTypeId: any;
  examSubjectId: any;
  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
  isFall!: any[];
  hasBarcode!: any[];
  examSecretSearchModal: ExamSecretSearchModel = {} as ExamSecretSearchModel;

  constructor(
    private readonly toastService: GlobalToastService,
    private readonly cd: ChangeDetectorRef
  ) {}

  onAdministrationOfficeChanged(selectedValue: any): void {
    this.examSecretSearchModal.administrationOfficeId = selectedValue;
    if (selectedValue !== null) {
      this.loadExamSites.emit(this.examSecretSearchModal);
    }
  }

  onExamSiteChanged(): void {
    if (this.examSecretSearchModal.examSiteId) {
      this.loadExamTypes.emit(this.examSecretSearchModal);
    }
  }

  onExamTypeChanged(): void {
    if (this.examSecretSearchModal.examSiteId) {
      this.loadExamDates.emit(this.examSecretSearchModal);
      this.loadExamSubjects.emit(this.examSecretSearchModal);
    }
  }

  onSubmit() {
    if (this.isSearchValid(this.examSecretSearchModal)) {
      this.applySearch.emit(this.examSecretSearchModal);
    } else {
      this.toastService.showError(
        'Ju lutem plotësoni të gjitha fushat e kërkuara.'
      );
    }
  }

  private isSearchValid(searchModal: ExamSecretSearchModel) {
    return (
      searchModal.administrationOfficeId &&
      searchModal.examSiteId &&
      searchModal.examDateId &&
      searchModal.examTypeId
    );
  }
}
