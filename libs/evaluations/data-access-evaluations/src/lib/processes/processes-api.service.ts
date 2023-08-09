import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobalToastService } from '@msh/shared/util-shared';
import { CalculationProcessesApiService } from '../calculation-processes/calculation-processes-api.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { formatDate } from '@angular/common';
import { ApplicationProcess } from '@msh/shared/domain-models';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class ProcessesApiService {
  private calculateGrade$$ = new BehaviorSubject<ApplicationProcess[]>([]);
  calculateGrade$ = this.calculateGrade$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  appProcessType!: string;
  executionLog!: string;
  endDate: any;

  constructor(
    private readonly calculateGradesService: CalculationProcessesApiService,
    private readonly toastService: GlobalToastService
  ) {}

  getData($event: TableLazyLoadEvent, processType: number) {
    this.filters = { ...$event };
    this.calculateGradesService
      .loadProcessData(processType)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const dataArray = this.format(response.data);
        this.calculateGrade$$.next(dataArray);
      });
  }

  post(processType: number) {
    this.calculateGradesService
      .loadProcess(processType)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Procesi rifilloi me sukses!');
          const dataArray = this.format(response.data);
          this.calculateGrade$$.next(dataArray);
        }
        if (response.isBadRequest) {
          this.toastService.showError('Dicka shkoi keq!');
        }
        if (!response.isSuccessful) {
          this.toastService.showError(response.errorMessage);
        }
      });
  }

  format(data: any) {
    const dataArray = [data] as ApplicationProcess[];
    dataArray.forEach(item => {
      if (item === null) {
        this.toastService.showError('Nuk u gjet procedura e ruajtur');
      }
      this.endDate = formatDate(
        new Date(item.endTime as Date),
        'dd/MM/yyyy',
        'en'
      );
      const startTime = new Date(item.startTime);
      const endTime = new Date(item.endTime);
      item.startTimeToShow = `${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()} `;
      item.endTimeToShow = `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()} `;
      this.appProcessType = item.appProcessType;
      this.executionLog = item.executionLog;
      item.executionTime = this.endDate;
    });
    return dataArray;
  }
}
