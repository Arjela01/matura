import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFilterService {


  applyDateManipulation(filters: any): any {
    if (filters.date?.length > 0) {
      for (const eventData of filters.date) {
        if (eventData.value !== null) {
          const date = eventData.value;
          date.setHours(date.getHours() + 2);
          eventData.value = date.toISOString().replace('T', ' ').split('.')[0];
        }
      }
    }
    return filters;
  }


}
