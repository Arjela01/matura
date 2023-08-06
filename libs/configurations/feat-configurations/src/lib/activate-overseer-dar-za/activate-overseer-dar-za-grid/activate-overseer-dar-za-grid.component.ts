import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
} from '@msh/shared/util-shared';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import {TableLazyLoadEvent, TableModule, TableRowSelectEvent, TableRowUnSelectEvent} from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AdministrationOffice } from '@msh/shared/domain-models';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdministrationOfficeApiService } from '@msh/configurations/data-access-configurations';

@Component({
  selector: 'msh-activate-overseer-dar-za-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    RouterLink,
    ColumnFilterDirective,
  ],
  templateUrl: './activate-overseer-dar-za-grid.component.html',
  styleUrls: ['./activate-overseer-dar-za-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivateOverseerDarZaGridComponent {
  @Input() administrationOffices: AdministrationOffice[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  @Output() gridEvent = new EventEmitter<
    GridEvent<AdministrationOffice | AdministrationOffice[]>
  >();
  @Input() set administrationOfficeDetails(
    details: AdministrationOffice | null
  ) {
    if (details) {
      this.administrationOffice = Object.assign({}, details);
    }
  }

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private readonly AdministrationOfficeService: AdministrationOfficeApiService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,

    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
  selectedAdministrationOffices: AdministrationOffice[] = [];

  administrationOffice: AdministrationOffice = {
    directorName: '',
    isAllowedToLogin: false,
    isRegionalOffice: false,
    name: '',
  };

  submitted = false;
  id: any;

  changeStatus(administrationOffice: AdministrationOffice): void {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CUSTOM_ACTION2,
      data: administrationOffice,
    } as GridEvent<AdministrationOffice>);
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<AdministrationOffice>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<AdministrationOffice>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
