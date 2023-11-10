import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FailingStudent } from '@msh/applications/domain-application';
import { Student } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import {
  PermissionCheckService,
  PermissionEnum,
} from '@msh/auth/data-access-auth';

@Component({
  selector: 'msh-failing-students-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ChipModule,
    ColumnFilterDirective,
  ],
  templateUrl: './failing-students-grid.component.html',
  styleUrls: ['./failing-students-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FailingStudentsGridComponent implements OnInit {
  @Input() failingStudents: FailingStudent[] = [];
  @Input() students: Student[] = [];
  @Input() totalRecords = 0;
  showEditButton = false;
  @Input() loading = false;

  constructor(
    private readonly permissionCheckService: PermissionCheckService
  ) {}

  @Output() gridEvent = new EventEmitter<
    GridEvent<FailingStudent | FailingStudent[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  ngOnInit() {
    this.showEditButton = this.permissionCheckService.hasPermission(
      PermissionEnum.EditFailingStudents as any
    );
  }
  onEditClick(failingStudent: FailingStudent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: failingStudent,
    } as GridEvent<FailingStudent>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
