import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Student, User } from '@msh/shared/domain-models';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
} from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import {
  TableLazyLoadEvent,
  TableModule,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
} from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { RoleName } from '../user-form/role-list';
import { DialogModule } from 'primeng/dialog';
import { UserHistoryComponent } from '../user-history/user-history.component';

@Component({
  selector: 'msh-user-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ColumnFilterDirective,
    DialogModule,
    UserHistoryComponent,
  ],
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGridComponent {
  @Input() set usersDetails(details: User | null) {
    if (details) {
      this.user = Object.assign({}, details);
    }
  }
  @Input() loading = false;
  selectedUsers: User[] = [];

  @ViewChild('form', { static: true }) form!: NgForm;
  @Input() users: User[] = [];
  @Input() totalRecords = 0;
  @Input() userId: any;
  @Input() recordId: any;
  @Input() headerText = '';
  @Input() displayHistoryForm = true;
  @Input() selectedRecord: any;

  @Output() formSave = new EventEmitter<User>();
  @Output() gridEvent = new EventEmitter<GridEvent<User | User[]>>();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  user: User = {
    fileName: '',
    id: '',
    name: '',
    lastName: '',
    nid: '',
    overseerCode: '',
    password: '',
    roleId: '',
    universityId: 0,
    highSchoolId: 0,
    isDisabled: false,
  };

  id: any;

  onChangePassClick(user: User) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CUSTOM_ACTION1,
      data: user,
    } as GridEvent<User>);
  }

  changeUserStatus(user: User): void {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CUSTOM_ACTION2,
      data: user,
    } as GridEvent<User>);
  }

  onHistoryClick(user: User) {
    this.displayHistoryForm = true;
    this.gridEvent.emit({
      action: GRID_ACTIONS.HISTORY,
      data: user,
    } as GridEvent<User>);
  }

  onEditClick(user: User) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: user,
    } as GridEvent<User>);
  }

  onDeleteClick(user: User) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: user,
    } as GridEvent<User>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }

  protected readonly RoleName = RoleName;
}
