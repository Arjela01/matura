import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { UntilDestroy } from '@ngneat/until-destroy';
import { LazyLoadEvent } from 'primeng/api';

@UntilDestroy()
@Component({
  selector: 'msh-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
  ],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  @Input() columns!: any[];
  @Input() gridData: any[] = [];
  @Output() dataEmitted = new EventEmitter<any>();

  loadRows($event: LazyLoadEvent) {
    this.dataEmitted.emit($event);
  }
}
