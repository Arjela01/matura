import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFilterService {


  applyDateManipulation(filters: any): any {
    const dateFields = ['date', 'dateCreated', 'birthDate', 'decisionDueDate', 'banRemovalDate', 'effectiveDate', 'printedDate', 'startDate', 'endDate', 'studentBirthDate'];

    for (const field of dateFields) {
      if (filters[field]?.length > 0) {
        for (const eventData of filters[field]) {
          if (eventData.value !== null) {
            const date = new Date(eventData.value);
            date.setHours(date.getHours() + 2);
            eventData.value = date.toISOString().replace('T', ' ').split('.')[0];
          }
        }
      }
    }

    return filters;
  }

}
