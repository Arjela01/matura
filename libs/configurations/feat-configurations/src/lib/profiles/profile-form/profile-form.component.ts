import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Profile } from '@msh/shared/domain-models';

@Component({
  selector: 'msh-profile-form',
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
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent implements OnChanges {
  @Input() profileGroups: DropdownModel<number>[] = [];

  @Input() set profileDetails(details: Profile | null) {
    if (details) {
      this.profile = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<Profile>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  profileGroupsFiltered: DropdownModel<number>[] = [];

  submitted = false;

  profile: Profile = {
    id: 0,
    code: '',
    name: '',
    isTechnical: true,
    academicYearId: 1,

  };

  ngOnChanges(): void {

    if (this.profileGroups && this.profile.profileGroupId) {
      this.onProfileGroupChange({ value: this.profile.profileGroupId });
    }
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.profile);
    }
  }


  onProfileGroupChange($event: any) {
    this.profileGroupsFiltered = this.profileGroups.filter(
      p => p.parentKey == $event.value
    );
  }
}
