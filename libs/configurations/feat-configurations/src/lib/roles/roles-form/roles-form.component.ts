import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Role } from '@msh/configurations/domain-configurations';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-roles-form',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CheckboxModule,],
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesFormComponent {

  @Input() set rolesDetails(details: Role | null) {
    if (details) {
      this.role = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<Role>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;


  submitted = false;

  role: Role = {
    id: '',
    code: '',
    name: '',
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}


  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.role);
    }
  }
}
