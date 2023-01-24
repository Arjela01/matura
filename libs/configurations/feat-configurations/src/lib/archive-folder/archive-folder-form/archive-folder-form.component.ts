import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {ArchiveFolder, HighSchool} from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-archive-folder-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
  ],
  templateUrl: './archive-folder-form.component.html',
  styleUrls: ['./archive-folder-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveFolderFormComponent  implements OnChanges {
  @Input() cities: DropdownModel<number>[] = [];
  @Input() regions: DropdownModel<number>[] = [];
  @Input() examTypes: DropdownModel<number>[] = [];

  @Input() set archiveFolder(details: ArchiveFolder | null) {
    if (details) {
      this.archiveFolder = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<ArchiveFolder>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  examTypesFiltered: DropdownModel<number>[] = [];

  submitted = false;

  archiveFolder: ArchiveFolder = {
    id: 0,
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(): void {
    if (this. && this.archiveFolder.regionId) {
      this.onRegionChange({ value: this.archiveFolder.id });
    }
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.archiveFolder);
    }
  }

  onRegionChange($event: any) {
    this.examTypesFiltered = this.examTypes.filter(c => c.parentKey == $event.value);
  }
}
