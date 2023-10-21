import { FilterService, FilterMatchMode } from 'primeng/api';

export class CustomFilterService extends FilterService {
  override filter(
    value: any[],
    fields: any[],
    filterValue: any,
    filterMatchMode: FilterMatchMode
  ): any[] {
    return super.filter(value, fields, filterValue, <string>filterMatchMode);
  }
}
