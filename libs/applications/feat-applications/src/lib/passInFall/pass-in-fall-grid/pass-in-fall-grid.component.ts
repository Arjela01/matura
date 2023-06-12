import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FailingStudent } from '@msh/applications/domain-application';
import {ColumnFilterDirective, GRID_ACTIONS, GridEvent} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-pass-in-fall-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ColumnFilterDirective
  ],
  templateUrl: './pass-in-fall-grid.component.html',
  styleUrls: ['./pass-in-fall-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassInFallGridComponent {
  @Input() failingStudents: FailingStudent[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  // selectedFailingStudent: Failin

  @Output() gridEvent = new EventEmitter<
    GridEvent<FailingStudent | FailingStudent[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(failingStudent: FailingStudent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: failingStudent,
    } as GridEvent<FailingStudent>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
