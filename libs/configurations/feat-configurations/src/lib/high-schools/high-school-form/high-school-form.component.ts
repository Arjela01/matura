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
import { HighSchool } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-high-school-form',
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
  templateUrl: './high-school-form.component.html',
  styleUrls: ['./high-school-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighSchoolFormComponent implements OnChanges {
  @Input() cities: DropdownModel<number>[] = [];
  @Input() regions: DropdownModel<number>[] = [];
  @Input() administrationOffices: DropdownModel<number>[] = [];

  @Input() set highSchoolDetails(details: HighSchool | null) {
    if (details) {
      this.highSchool = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<HighSchool>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  citiesFiltered: DropdownModel<number>[] = [];

  submitted = false;

  highSchool: HighSchool = {
    id: 0,
    code: '',
    name: '',
    isPublic: true,
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(): void {
    if (this.cities && this.highSchool.regionId) {
      this.onRegionChange({ value: this.highSchool.regionId });
    }
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.highSchool);
    }
  }

  onRegionChange($event: any) {
    this.citiesFiltered = this.cities.filter(c => c.parentKey == $event.value);
  }
}
