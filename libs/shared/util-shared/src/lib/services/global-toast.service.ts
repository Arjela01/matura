import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastDefaultTitle, ToastSeverity } from '../constants/toast.enum';

@Injectable({
  providedIn: 'root',
})
export class GlobalToastService {
  constructor(private messageService: MessageService) {}

  showInfo(message: string, title: string | null = null) {
    title !== null
      ? this.messageService.add({
          severity: ToastSeverity.INFO,
          summary: title,
          detail: message,
          life: 4000,
          closable: true,
        })
      : this.messageService.add({
          severity: ToastSeverity.INFO,
          summary: ToastDefaultTitle.INFO,
          detail: message,
          life: 4000,
          closable: true,
        });
  }

  showSuccess(message: string, title: string | null = null) {
    title !== null
      ? this.messageService.add({
          severity: ToastSeverity.SUCCESS,
          summary: title,
          detail: message,
          life: 4000,
          closable: true,
        })
      : this.messageService.add({
          severity: ToastSeverity.SUCCESS,
          summary: ToastDefaultTitle.SUCCESS,
          detail: message,
          life: 4000,
          closable: true,
        });
  }

  showError(message: string, title: string | null = null) {
    title !== null
      ? this.messageService.add({
          severity: ToastSeverity.ERROR,
          summary: title,
          detail: message,
          life: 4000,
          closable: true,
        })
      : this.messageService.add({
          severity: ToastSeverity.ERROR,
          summary: ToastDefaultTitle.ERROR,
          detail: message,
          life: 4000,
          closable: true,
        });
  }

  showWarning(message: string, title: string | null = null) {
    title !== null
      ? this.messageService.add({
          severity: ToastSeverity.WARN,
          summary: title,
          detail: message,
          life: 4000,
          closable: true,
        })
      : this.messageService.add({
          severity: ToastSeverity.WARN,
          summary: ToastDefaultTitle.WARN,
          detail: message,
          life: 4000,
          closable: true,
        });
  }

  remove() {
    this.messageService.clear();
  }
}
