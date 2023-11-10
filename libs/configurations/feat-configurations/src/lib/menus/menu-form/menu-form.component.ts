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
import { Menu } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'msh-menu-form',
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
    MultiSelectModule,
  ],
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuFormComponent implements OnChanges {
  @Input() parentMenus: DropdownModel<number>[] = [];
  @Input() roles: DropdownModel<number>[] = [];

  @Input() set menuDetails(details: Menu | null) {
    if (details) {
      this.menu = { ...details };
    }
  }

  @Output() formSave = new EventEmitter<Menu>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  menu: Menu = {
    id: 0,
    displayOrder: 0,
    isVisible: false,
    url: '',
    text: '',
    parentId: null,
    roles: [],
  };

  constructor(private cd: ChangeDetectorRef) {}

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.menu);
    }
  }

  ngOnChanges(): void {
    this.cd.detectChanges();
  }
}
