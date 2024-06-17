import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({ standalone: true, name: 'app_date' })
export class AppDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  format = 'dd.MM.yyyy';

  transform(value: any): string | null {
    if (!value) return '';
    try {
      return this.datePipe.transform(new Date(value), this.format);
    } catch (e) {
      return 'Invalid Date';
    }
  }
}
