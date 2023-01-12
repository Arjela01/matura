import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { University } from '@msh/configurations/domain-configurations';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import {DropdownModel} from "@msh/shared/data-access-shared";

@Component({
  selector: 'msh-university-form',
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
  templateUrl: './university-form.component.html',
  styleUrls: ['./university-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityFormComponent {
  @Input() set universityDetails(details: University | null) {
    if (details) {
      this.university = Object.assign({}, details);
    }
  }

  @Input() cities: DropdownModel<number>[] = [];
  @Input() regions: DropdownModel<number>[] = [];

  @Output() formSave = new EventEmitter<University>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  citiesFiltered: DropdownModel<number>[] = [];

  university: University = {
    cityId: 0,
    cityName: '',
    regionId: 0,
    regionName: '',
    id: '',
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
      this.formSave.emit(this.university);
    }
  }

  onRegionChange($event: any) {
    this.citiesFiltered = this.cities.filter(c => c.parentKey == $event.value);
  }
}
