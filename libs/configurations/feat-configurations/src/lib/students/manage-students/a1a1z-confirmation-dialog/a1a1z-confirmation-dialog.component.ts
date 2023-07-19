import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormType } from '@msh/applications/domain-application';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-a1a1z-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, RadioButtonModule, FormsModule, ButtonModule],
  templateUrl: './a1a1z-confirmation-dialog.component.html',
  styleUrls: ['./a1a1z-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A1a1zConfirmationDialogComponent {
  formType = FormType;
  @Output() A1choosen = new EventEmitter<FormType>();
  @Output() A1Zchoosen = new EventEmitter<FormType>();

  onA1Click() {
    this.A1Zchoosen.emit(FormType.A1);
  }

  onA1ZClick() {
    this.A1choosen.emit(FormType.A1Z);
  }
}
