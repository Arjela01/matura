import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { GridComponent } from '../grid/grid.component';
import { LazyLoadEvent } from 'primeng/api';
import { UntilDestroy } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { Application_Process } from '../grid/grid-type.enum';
import { ProcessesApiService } from '@msh/evaluations/data-access-evaluations';

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
  templateUrl: './connect-exam-secrets.component.html',
  styleUrls: ['./connect-exam-secrets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectExamSecretsComponent {
  filters: LazyLoadEvent | null = null;
  processType: Application_Process = Application_Process.ConnectExamSecrets;

  appProcessType!: string;
  executionLog!: string;

  columns = [
    { field: 'processStatus', header: 'Statusi' },
    { field: 'executionTime', header: 'Koha e ekzekutimit' },
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
    private readonly process: ProcessesApiService
  ) {}

  getProcessData($event: LazyLoadEvent, processType: number) {
    this.filters = { ...$event };
    this.process.getData($event, processType);
  }

  postProcess() {
    this.process.post(this.processType);
  }
}
