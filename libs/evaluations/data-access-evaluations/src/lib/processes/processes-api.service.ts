import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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
  startProcess$ = this.calculateGrade$$.asObservable();
  private loadingState$$ = new Subject<boolean>();
  loadingState$ = this.loadingState$$.asObservable();
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

  post(processType: number, examTypeId?: any) {
    this.loadingState$$.next(true);
    this.calculateGradesService
      .loadProcess(processType, examTypeId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: response => {
          this.loadingState$$.next(false);
          if (response.isSuccessful) {
            this.toastService.showSuccess('Procesi mbaroi me sukses!');
            const dataArray = this.format(response.data);
            this.calculateGrade$$.next(dataArray);
          } else {
            this.loadingState$$.next(false);
            this.toastService.showError(
              response.errorMessage || 'Dicka shkoi keq!'
            );
          }
        },
        error: () => {
          this.loadingState$$.next(false);
          this.toastService.showError('Dicka shkoi keq!');
        },
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
