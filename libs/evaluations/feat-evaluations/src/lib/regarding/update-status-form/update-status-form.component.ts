import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Regrading, RegradingUpdate } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TableLazyLoadEvent } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModel } from '@msh/shared/data-access-shared';

@UntilDestroy()
@Component({
  selector: 'msh-update-status-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    UpdateStatusFormComponent,
    FileUploadModule,
    DropdownModule,
    InputTextareaModule,
  ],
  templateUrl: './update-status-form.component.html',
  styleUrls: ['./update-status-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateStatusFormComponent {
  @Input() set details(details: Regrading | null) {
    if (details) {
      this.regradingStatus = Object.assign({}, details);
    }
  }
  @Input() statuses: DropdownModel<any>[] = [];
  @Output() formSave = new EventEmitter<Regrading>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;
  filters: TableLazyLoadEvent | null = null;
  submitted = false;
  regradingStatus: Regrading = {};

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.regradingStatus);
    }
  }
}
