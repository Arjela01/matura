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
import { City } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-city-form',
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
  templateUrl: './city-form.component.html',
  styleUrls: ['./city-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityFormComponent implements OnChanges {
  @Input() regions: DropdownModel<number>[] = [];
  @Input() cities: DropdownModel<number>[] = [];

  @Input() set cityDetails(details: City | null) {
    if (details) {
      this.city = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<City>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  citiesFiltered: DropdownModel<number>[] = [];

  submitted = false;

  city: City = {
    id: 0,
    name: '',
    isCity: true,
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(): void {
    if (this.city.regionId) {
      this.onRegionChange({ value: this.city.regionId });
    }
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.city);
    }
  }

  onRegionChange($event: any) {
    this.citiesFiltered = this.cities.filter(c => c.parentKey == $event.value);
  }
}
