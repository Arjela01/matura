import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output, ViewChild,
} from '@angular/core';
import { User } from '@msh/shared/domain-models';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { HttpClient } from '@angular/common/http';
import { UserApiService } from '@msh/configurations/data-access-configurations';
import { ActivatedRoute, Router } from '@angular/router';
import {NgForm} from "@angular/forms";

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
  ],
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGridComponent {
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedUsers: User[] = [];

  @Output() formSave = new EventEmitter<User>();


  @ViewChild('form', { static: true }) form!: NgForm;
  saving = false;





  @Input() users: User[] = [];
  @Input() totalRecords = 0;


  @Output() gridEvent = new EventEmitter<GridEvent<User | User[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();
  @Input() set usersDetails(details: User | null) {
    if (details) {
      this.user = Object.assign({}, details);
    }
  }

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private readonly userService: UserApiService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,

    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  user: User = {
    fileName: '',
    id: '',
    isActive: false,

    lastName: '',
    name: '',
    nid: '',
    overseerCode: '',
    password: '',
    roleId: '',
    universityId: 0,
    isDisabled: false,
  };

  id: any;

  onKeyClick(user: User) {
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

  onRowSelect({ data }: { data: User }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data.id,
    } as GridEvent<User>);
  }

  onRowUnselect({ data }: { data: User }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<User>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
