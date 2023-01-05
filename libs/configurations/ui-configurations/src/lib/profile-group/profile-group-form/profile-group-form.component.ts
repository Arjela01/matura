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
import { ProfileGroup} from '@msh/configurations/domain-configurations';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-profile-group-form',
  standalone: true,
  imports: [
  CommonModule,
  FormsModule,
  InputTextModule,
  InputNumberModule,
  RadioButtonModule,
  InputTextareaModule,
  ButtonModule,
  CheckboxModule,],
  templateUrl: './profile-group-form.component.html',
  styleUrls: ['./profile-group-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileGroupFormComponent {
@Input() set profileGroupDetails(details: ProfileGroup | null) {
  if (details) {
    this.profileGroup = Object.assign({}, details);
  }
}
@Output() formSave = new EventEmitter<ProfileGroup>();
@Output() formClose = new EventEmitter<undefined>();

@ViewChild('form', { static: true }) form!: NgForm;

submitted = false;

profileGroup: ProfileGroup = {
  Id: 0,
  Name: '',
  Ordering: '',
};

onCancelClick() {
  this.formClose.emit();
}

onSubmit() {
  this.submitted = true;
  if (this.form.valid) {
    this.formSave.emit(this.profileGroup);
  }
}
}
