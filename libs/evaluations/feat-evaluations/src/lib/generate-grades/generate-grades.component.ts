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
import { GenerateGradeApiService } from '@msh/evaluations/data-access-evaluations';
import { LazyLoadEvent } from 'primeng/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { GenerateGrade } from '@msh/evaluations/domain-evaluations';

@UntilDestroy()
@Component({
  selector: 'msh-generate-grades',
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
  templateUrl: './generate-grades.component.html',
  styleUrls: ['./generate-grades.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerateGradesComponent {
  @Output() dataEmitted = new EventEmitter<any>();
  private generateGrade$$ = new BehaviorSubject<GenerateGrade[]>([]);
  generateGrade$ = this.generateGrade$$.asObservable();
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
    private readonly generateGradesService: GenerateGradeApiService
  ) {}

  getGeneratedGrades($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.generateGradesService
      .loadGeneratedGrades($event)
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

        this.generateGrade$$.next([dataArray]);
        this.appProcessType = dataArray.appProcessType;
        this.executionLog = dataArray.executionLog;

        this.dataEmitted.emit(response.data);
      });
  }
}
