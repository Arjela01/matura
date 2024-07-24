import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { GridComponent } from '../grid/grid.component';
import { ProcessesApiService } from '@msh/evaluations/data-access-evaluations';
import { TableLazyLoadEvent } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { Application_Process } from '../grid/grid-type.enum';

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
export class TabularGradeReportComponent implements OnInit {
  filters: TableLazyLoadEvent | null = null;
  processType: Application_Process =
    Application_Process.CreateTabularGradeReport;
  appProcessType!: string;
  executionLog!: string;
  isLoading = false;

  columns = [
    { field: 'processStatus', header: 'Statusi' },
    { field: 'executionTime', header: 'Data e ekzekutimit' },
    { field: 'startTimeToShow', header: 'Koha e fillimit' },
    { field: 'endTimeToShow', header: 'Koha e mbarimit' },
  ];

  calculateGrade$ = this.process.startProcess$.pipe(
    tap(res => {
      this.appProcessType = res[0]?.appProcessType;
      this.executionLog = res[0]?.processStatus;
      return res;
    })
  );

  constructor(private readonly process: ProcessesApiService) {}

  ngOnInit() {
    this.process.loadingState$
      .pipe(untilDestroyed(this))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
      });
  }

  getProcessData($event: TableLazyLoadEvent, processType: number) {
    this.filters = { ...$event };
    this.process.getData($event, processType);
  }

  postProcess() {
    this.process.post(this.processType);
  }
}
