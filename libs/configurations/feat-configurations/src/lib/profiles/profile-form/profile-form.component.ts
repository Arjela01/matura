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
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import {Profile} from "@msh/configurations/domain-configurations";

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
  @Input() AcademicYears: DropdownModel<number>[] = [];
  @Input() ProfileGroups: DropdownModel<number>[] = [];

  @Input() set profileDetails(details: Profile | null) {
    if (details) {
      this.profile = Object.assign({}, details);
    }
  }


  @Output() formSave = new EventEmitter<Profile>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', {static: true}) form!: NgForm;

  AcademicYearsFiltered: DropdownModel<number>[] = [];
  ProfileGroupsFiltered: DropdownModel<number>[] = [];

  submitted = false;

  profile: Profile = {
    id: 0,
    code: '',
    name: '',
    IsTechnical: true,
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnChanges(): void {
    if (this.AcademicYears && this.profile.AcademicYear) {
      this.onAcademicYearChange({value: this.profile.AcademicYear});
    }
    if (this.ProfileGroups && this.profile.ProfileGroup) {
      this.onProfileGroupChange({value: this.profile.ProfileGroup});
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

  onAcademicYearChange($event: any) {
    // eslint-disable-next-line max-len
    this.AcademicYearsFiltered = this.AcademicYears.filter(a => a.parentKey == $event.value);
  }
  onProfileGroupChange($event: any) {
    // eslint-disable-next-line max-len
    this.ProfileGroupsFiltered = this.ProfileGroups.filter(p => p.parentKey == $event.value);
  }
}
