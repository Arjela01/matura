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
import { DashboardSection } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
@Component({
  selector: 'msh-dashboard-sections-form',
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
  ],
  templateUrl: './dashboard-sections-form.component.html',
  styleUrls: ['./dashboard-sections-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSectionsFormComponent {
  @Input() set dashboardSectionDetails(details: DashboardSection | null) {
    if (details) {
      this.dashboardSections = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<DashboardSection>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  dashboardSections: DashboardSection = {
    id: 0,
    name: '',
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.dashboardSections);
    }
  }
}
