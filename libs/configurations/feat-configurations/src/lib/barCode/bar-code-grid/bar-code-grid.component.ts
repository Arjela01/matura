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
  ArchiveFolder, City, Student, StudentClassModel, StudentSectionModel,
} from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import {LazyLoadEvent, MessageService} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AddBarcodeApiService} from "@msh/configurations/data-access-configurations";
import {DropdownModel} from "@msh/shared/data-access-shared";

@Component({
  selector: 'msh-bar-code-grid',
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
  ],
  templateUrl: './bar-code-grid.component.html',
  styleUrls: ['./bar-code-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarCodeGridComponent {




  @ViewChild('form', { static: true }) form!: NgForm;


  @Input() set studentDetails(details: AddBarcode | null) {
    if (details) {
      this.barCode = Object.assign({}, details);
    }
  }
  @Input() barCodes: AddBarcode[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  selectedBarCodes: AddBarcode[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<AddBarcode | AddBarcode[]>
  >();

  @Output() formClose = new EventEmitter<undefined>();


  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();
  @Output() formSave = new EventEmitter<AddBarcode>();

  submitted= false;
  id: string | null;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly barCodesService: AddBarcodeApiService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
  private activatedRoute: ActivatedRoute,

) {
    this.id = this.route.snapshot.paramMap.get('id');
  }




  barCode: AddBarcode = {
    barCode: "",
  };
   onSubmit(): void {

    const data = { ...this.barCode };

    this.barCodesService.save(data).subscribe({
      next: () => {
        this.submitted = false;
        if (this.form.valid) {
          this.formSave.emit(this.barCode);
          const id = this.activatedRoute.snapshot.paramMap.get('id');

        }
      },
    });
  }

  onclick() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.barCode);
    }
  }



  changeStatus(barcode: AddBarcode): void {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CHANGE,
      data: barcode,
    } as GridEvent<AddBarcode>);
  }
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
