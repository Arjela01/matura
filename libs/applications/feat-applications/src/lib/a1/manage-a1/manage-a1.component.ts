import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'manage-a1',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-a1.component.html',
  styleUrls: ['./manage-a1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageA1Component {
  constructor() {}
}
