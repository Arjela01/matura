import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'msh-manage-report-layout',
  standalone: true,
  imports: [CommonModule, ToolbarModule, ConfirmDialogModule],
  templateUrl: './manage-report-layout.component.html',
  styleUrls: ['./manage-report-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageReportLayoutComponent {}
