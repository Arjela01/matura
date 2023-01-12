import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'msh-manage-administration-office',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-administration-office.component.html',
  styleUrls: ['./manage-administration-office.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageAdministrationOfficeComponent {}
