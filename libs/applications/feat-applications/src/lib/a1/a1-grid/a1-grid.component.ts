import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'a1-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './a1-grid.component.html',
  styleUrls: ['./a1-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A1GridComponent {}
