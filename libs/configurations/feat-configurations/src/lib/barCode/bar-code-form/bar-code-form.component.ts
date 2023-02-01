// import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {DropdownModel} from "@msh/shared/data-access-shared";
// import {ArchiveFolder, Profile} from "@msh/configurations/domain-configurations";
// import {FormsModule, NgForm} from "@angular/forms";
// import {InputTextModule} from "primeng/inputtext";
// import {InputNumberModule} from "primeng/inputnumber";
// import {RadioButtonModule} from "primeng/radiobutton";
// import {InputTextareaModule} from "primeng/inputtextarea";
// import {ButtonModule} from "primeng/button";
// import {CheckboxModule} from "primeng/checkbox";
// import {DropdownModule} from "primeng/dropdown";
//
// @Component({
//   selector: 'msh-bar-code-form',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     InputTextModule,
//     InputNumberModule,
//     RadioButtonModule,
//     InputTextareaModule,
//     ButtonModule,
//     CheckboxModule,
//     DropdownModule,
//   ],
//   templateUrl: './bar-code-form.component.html',
//   styleUrls: ['./bar-code-form.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class BarCodeFormComponent  {
//
//   @Input() set archiveFolderDetails(details: ArchiveFolder | null) {
//     if (details) {
//       this.archiveFolder = Object.assign({}, details);
//     }
//   }
//
//   @Output() formSave = new EventEmitter<ArchiveFolder>();
//   @Output() formClose = new EventEmitter<undefined>();
//
//   @ViewChild('form', {static: true}) form!: NgForm;
//
//
//
//   submitted = false;
//
//   archiveFolder: ArchiveFolder = {
//     id: 0, isClosed: false, lastUserId: undefined, nr: 0
//
//   };
//
//
//   onCancelClick() {
//     this.formClose.emit();
//   }
//
//   onSubmit() {
//     this.submitted = true;
//     if (this.form.valid) {
//       this.formSave.emit(this.archiveFolder);
//     }
//   }
//
// }
