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
import { Regrading, RegradingImportCommand } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { GlobalToastService } from '@msh/shared/util-shared';
import { DialogModule } from 'primeng/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TableLazyLoadEvent } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { RegradingApiService } from '@msh/evaluations/data-access-evaluations';

@UntilDestroy()
@Component({
  selector: 'msh-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    UploadComponent,
    FileUploadModule,
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent {
  @Input() set gradeDetails(details: any | null) {
    if (details) {
      this.command = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<RegradingImportCommand>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;
  filters: TableLazyLoadEvent | null = null;
  submitted = false;
  displayUploadModal = false;
  fileContent: string | ArrayBuffer | null | undefined;
  command: RegradingImportCommand = {};
  uploaded = false;

  constructor(
    private readonly regradingService: RegradingApiService,
    private readonly toastService: GlobalToastService
  ) {}

  onCancelClick() {
    this.formClose.emit();
    this.displayUploadModal = false;
  }

  onSubmit() {
    this.submitted = true;

    this.command.file = this.fileContent;
    this.regradingService.import(this.command).subscribe(response => {
      if (response.isSuccessful) {
        this.toastService.showSuccess('Dokumenti u shtua me sukses!');
        this.formClose.emit();
        this.displayUploadModal = false;
      } else this.toastService.showError(response.errorMessage);
      if (response.isBadRequest)
        this.toastService.showError(
          'Ndodhi një problem gjatë ngarkimit të dokumentit!'
        );
    });
  }

  onUploadFile(event: any) {
    const fileContent = event.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(fileContent);
    this.uploaded = true;
    reader.onload = () => {
      const base64 = reader.result as string;
      this.fileContent = base64.split(',')[1];
    };
  }
}
