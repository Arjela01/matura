import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { GridComponent } from '../grid/grid.component';
import {
  CalculationProcessesApiService,
  ProcessesApiService,
} from '@msh/evaluations/data-access-evaluations';
import { LazyLoadEvent } from 'primeng/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { Application_Process } from '../grid/grid-type.enum';
import { GlobalToastService } from '@msh/shared/util-shared';
import * as FileSaver from 'file-saver';

@UntilDestroy()
@Component({
  selector: 'msh-calculate-grades',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    RippleModule,
    GridComponent,
  ],
  templateUrl: './tabular-grade-report.component.html',
  styleUrls: ['./tabular-grade-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabularGradeReportComponent {
  filters: LazyLoadEvent | null = null;
  processType: Application_Process =
    Application_Process.CreateTabularGradeReport;
  appProcessType!: string;
  executionLog!: string;

  columns = [
    { field: 'processStatus', header: 'Statusi' },
    { field: 'executionTime', header: 'Data e ekzekutimit' },
    { field: 'startTimeToShow', header: 'Koha e fillimit' },
    { field: 'endTimeToShow', header: 'Koha e mbarimit' },
  ];

  calculateGrade$ = this.process.calculateGrade$.pipe(
    tap(res => {
      this.appProcessType = res[0]?.appProcessType;
      this.executionLog = res[0]?.processStatus;
      return res;
    })
  );

  constructor(
    private readonly calculateGradesService: CalculationProcessesApiService,
    private readonly toastService: GlobalToastService,
    private readonly process: ProcessesApiService
  ) {}

  getProcessData($event: LazyLoadEvent, processType: number) {
    this.filters = { ...$event };
    this.process.getData($event, processType);
  }

  postProcess() {
    this.process.post(this.processType);
  }

  downloadFile() {
    this.calculateGradesService
      .export()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        const blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'TabelaT');
      });
  }
}
