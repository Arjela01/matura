import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AddBarcode,
  ArchiveFolder, Student,
} from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, NgForm } from '@angular/forms';
import {
  AcademicYearApiService, AddBarcodeApiService,
  ArchiveFolderApiService,
  GendersApiService,
  HighSchoolApiService,
  ProfileApiService,
} from '@msh/configurations/data-access-configurations';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'msh-archive-folder-view',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    FormsModule,
    ToolbarModule,
  ],
  templateUrl: './archive-folder-view.component.html',
  styleUrls: ['./archive-folder-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveFolderViewComponent {
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Input() barcodes: AddBarcode[] = [];

  //Keep it local state because of Table Header checkbox not syncing
  selectedBarcodes: AddBarcode[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<AddBarcode>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  @ViewChild('form', { static: true }) form!: NgForm;
  @Input() set barCodeDetails(details: AddBarcode | null) {
    if (details) {
      this.barCode = Object.assign({}, details);
    }
  }
  showBarcodes = false;
  submitted = false;


  id: string | null;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly archiveFolderService: ArchiveFolderApiService,
    private readonly addBarcodeService: AddBarcodeApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,



    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  barCode: AddBarcode = {
    barCode: "",
    archiveFolderId: 0,
  };


  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
  }
    // this.addBarcodeService.ba.subscribe(result => {
    //   this.barCode = { ...result.data };
    //   this.cd.detectChanges();
    // });




  onRowUnselect({ data }: { data: AddBarcode }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<AddBarcode>);
  }
  onRowSelect({ data }: { data: AddBarcode }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<AddBarcode>);
  }

  onEditClick(barcode: AddBarcode) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: barcode,
    } as GridEvent<AddBarcode>);
  }
  onDeleteClick(barcode: AddBarcode) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: barcode,
    } as GridEvent<AddBarcode>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
