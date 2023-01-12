import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'msh-administration-office-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administration-office-form.component.html',
  styleUrls: ['./administration-office-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationOfficeFormComponent {}
