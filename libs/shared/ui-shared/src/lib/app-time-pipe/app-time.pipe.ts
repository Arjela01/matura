import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({ standalone: true, name: 'app_time' })
export class AppTimePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  format = 'dd.MM.yyyy HH:mm';

  transform(value: any): string | null {
    if (!value) return '';
    try {
      return this.datePipe.transform(new Date(value), this.format);
    } catch (e) {
      return 'Invalid Date';
    }
  }
}
