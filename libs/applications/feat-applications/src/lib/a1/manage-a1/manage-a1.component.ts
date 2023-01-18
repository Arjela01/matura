import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'manage-a1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-a1.component.html',
  styleUrls: ['./manage-a1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageA1Component {}
