import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@msh/audit-logs/data-access-audit-log';

@Pipe({
  name: 'translation',
  standalone: true,
  pure: false,
})
export class TranslationPipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(value: any): any {
    return this.translationService.translate(value);
  }
}
