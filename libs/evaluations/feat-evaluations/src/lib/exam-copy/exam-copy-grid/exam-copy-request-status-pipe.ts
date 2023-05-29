import { Pipe, PipeTransform } from '@angular/core';
import { ExamCopyRequestStatusEnum } from '@msh/evaluations/domain-evaluations';
@Pipe({ name: 'examCopyRequestStatus', standalone: true })
export class ExamCopyRequestStatusPipe implements PipeTransform {
  transform(status: number): string {
    if (status === ExamCopyRequestStatusEnum.Accepted) return 'Pranuar';

    if (status === ExamCopyRequestStatusEnum.Declined) return 'Refuzuar';

    if (status === ExamCopyRequestStatusEnum.Draft) return 'Procesim';

    return '';
  }
}
