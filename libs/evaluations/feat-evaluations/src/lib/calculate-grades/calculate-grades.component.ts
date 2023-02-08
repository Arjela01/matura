import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { GridComponent } from '../grid/grid.component';
import { CalculateGradeApiService } from '@msh/evaluations/data-access-evaluations';
import { LazyLoadEvent } from 'primeng/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { CalculateGrade } from '@msh/evaluations/domain-evaluations';

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
  templateUrl: './calculate-grades.component.html',
  styleUrls: ['./calculate-grades.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculateGradesComponent {
  @Output() dataEmitted = new EventEmitter<any>();
  private calculateGrade$$ = new BehaviorSubject<CalculateGrade[]>([]);
  calculateGrade$ = this.calculateGrade$$.asObservable();
  filters: LazyLoadEvent | null = null;

  appProcessType!: string | undefined;
  executionLog: string | undefined = '';
  endTime: any;

  columns = [
    { field: '', header: 'Emri i Tabelës' },
    { field: 'executionLog', header: 'Veprimi i kryer' },
    { field: 'processStatus', header: 'Statusi' },
    { field: 'executionTime', header: 'Koha e ekzekutimit' },
  ];

  constructor(
    private readonly calculateGradesService: CalculateGradeApiService
  ) {}

  getCalculatedGrades($event: LazyLoadEvent) {
    this.filters = { ...$event };

    this.calculateGradesService
      .loadCalculatedGrades($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const dataArray = response.data;
        this.endTime = formatDate(
          new Date(dataArray.endTime),
          'dd/MM/yyyy',
          'en'
        );
        const differenceInMs =
          new Date(dataArray.endTime).getTime() -
          new Date(dataArray.startTime).getTime();
        const hours = Math.floor(differenceInMs / 3600000);
        const minutes = Math.floor((differenceInMs % 3600000) / 60000);
        const seconds = Math.floor(((differenceInMs % 360000) % 60000) / 1000);
        dataArray.executionTime = `${this.endTime} ${hours}:${minutes}:${seconds}`;

        this.calculateGrade$$.next([dataArray]);
        this.appProcessType = dataArray.appProcessType;
        this.executionLog = dataArray.executionLog;

        this.dataEmitted.emit(response.data);
      });
  }
}
