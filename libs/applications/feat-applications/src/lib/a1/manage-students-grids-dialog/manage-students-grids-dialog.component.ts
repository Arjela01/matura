import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'manage-students-grids-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    TableModule,
  ],
  templateUrl: './manage-students-grids-dialog.component.html',
  styleUrls: ['./manage-students-grids-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ManageStudentsGridsDialogComponent {
  constructor(public config: DynamicDialogConfig) {
    console.log(config.data);
  }
}
