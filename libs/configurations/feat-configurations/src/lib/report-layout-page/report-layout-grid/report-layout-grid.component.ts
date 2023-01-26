import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'msh-report-layout-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-layout-grid.component.html',
  styleUrls: ['./report-layout-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportLayoutGridComponent {}
