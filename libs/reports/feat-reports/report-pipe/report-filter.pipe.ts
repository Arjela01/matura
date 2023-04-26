import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reportFilter',
  standalone: true,
})
export class ReportFilterPipe implements PipeTransform {
  transform(reports: any[], searchValue: string, reportName: string): any[] {
    if (reports && searchValue && reportName) {
      searchValue = searchValue.toLowerCase();
      return reports.filter((el: any) =>
        el[reportName]?.toLowerCase()?.includes(searchValue)
      );
    }
    return reports;
  }
}
