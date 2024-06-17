import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: true, name: 'app_bool' })
export class AppBoolPipe implements PipeTransform {
  transform(value: any): string | null {
    return value ? 'Po' : 'Jo';
  }
}
