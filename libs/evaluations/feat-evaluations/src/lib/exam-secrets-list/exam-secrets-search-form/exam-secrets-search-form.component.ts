import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import {DropdownModel} from "@msh/shared/data-access-shared";
import { ExamSecretList} from "@msh/evaluations/domain-evaluations";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {
  AdministrationOfficeApiService, ExamAssignmentApiService,
  ExamDateApiService,
  ExamSiteApiService, ExamSubjectApiService, ExamTypeApiService
} from "@msh/configurations/data-access-configurations";
import {FormsModule, NgForm} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {LazyLoadEvent} from "primeng/api";
@UntilDestroy()
@Component({
  selector: 'msh-exam-secrets-search-form',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule, ButtonModule],
  templateUrl: './exam-secrets-search-form.component.html',
  styleUrls: ['./exam-secrets-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretsSearchFormComponent implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;

  @Input() administrationOffices: DropdownModel<number>[] = [];
  @Input() examSites: DropdownModel<number>[] = [];
  @Input() examDates: DropdownModel<number>[] = [];
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() examSubjects: DropdownModel<string>[] = [];
  @Output() formSave = new EventEmitter<ExamSecretList>();

  @Output() examSubjectChanged = new EventEmitter<ExamSecretList>();
  @Output() loadDates = new EventEmitter<ExamSecretList>();
  @Output() loadExamDates = new EventEmitter<ExamSecretList>();
  @Output() loadBarcode = new EventEmitter<ExamSecretList>();

  @Output() loadExamSubjects = new EventEmitter<ExamSecretList>();
  @Output() administrationOfficeChanged = new EventEmitter<ExamSecretList>();

  submitted = false;
  administrationOfficeId: any;
  @Input() totalRecords = 0;
  filters: LazyLoadEvent | null = null;

  examTypeId: any;
  examSubjectId: any;
  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
  examSecretList: ExamSecretList = {
    administrationOfficeId: 0,
    administrationOfficeName: '',
    examSiteName: '',
    examSiteId: '',
    examDateId: 0,
    examTypeId: 0,
    examTypeName: '',
    examSubjectId: '',
    examSubjectName: '',
  };
  isFall!: any[];
  hasBarcode!: any[];
  examSiteName!: string;


  constructor(
    private readonly administrationOfficeService: AdministrationOfficeApiService,
    private readonly examDateService: ExamDateApiService,
    private readonly examSiteService: ExamSiteApiService,
    private readonly examTypeService: ExamTypeApiService,
    private readonly examSubjectService: ExamSubjectApiService,
    private readonly examAssignmentService: ExamAssignmentApiService,

    private readonly cd: ChangeDetectorRef,

  ) {
    this.isFall = [
      { key: 'Po', value: 'Po' },
      { key: 'Jo', value: 'Jo' },
    ];
    this.isFall = [...this.isFall];

    this.hasBarcode = [
      { key: 'Po', value: 'Po' },
      { key: 'Jo', value: 'Jo' },
    ];
    this.hasBarcode = [...this.hasBarcode];

  }
  ngOnInit() {
    this.getAdministrationOfficeDropdown();
    this.getExamSite();
    this.getExamTypes();
  }
  getAdministrationOfficeDropdown() {
    this.administrationOfficeService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.administrationOffices = response.data;
        this.cd.markForCheck();
      });
  }

    onAdministrationOfficeChanged(): void {
      this.administrationOffices.map(el => {
        if (el.key == this.examSecretList.administrationOfficeId) {
          this.examSecretList.administrationOfficeName = el.value
        }
      })
      this.administrationOfficeChanged.emit(Object.assign({}, this.examSecretList));
  }
  refreshExamDates() {
    this.examSites.map(el => {
      if (el.key == this.examSecretList.examSiteId) {
        this.examSecretList.examSiteName = el.value
      }
    })
    this.loadExamDates.emit(Object.assign({}, this.examSecretList));
    this.getExamDate(this.examSecretList.examSiteId);

  }
  getExamSite() {
    this.examSiteService.loadDropdownList().subscribe(response => {
      this.examSites = response.data;
      this.cd.markForCheck();
    });
  }
  getExamDate(examSiteId: string): void {
    this.examDateService.forExamSiteId(examSiteId).subscribe(response => {
      this.examDates = [...response.data];
      this.cd.markForCheck();
    });
  }

  getExamTypes() {
    this.examTypeService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examTypes = response.data;
        this.cd.markForCheck();
      });
  }

  getExamSubjects(examTypeId?: number) {
    this.examSubjectService
      .forExamType(examTypeId, undefined, undefined, undefined, true)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjects = response.data;
        this.cd.markForCheck();
      });
  }
  onExamSubjectChanged(): void {
    this.examSubjects.map(el => {
      if (el.key == this.examSecretList.examSubjectId) {
        this.examSecretList.examSubjectName = el.value
      }
    })
    this.examSubjectChanged.emit(Object.assign({}, this.examSecretList));
  }

  refreshExamSubject() {
    this.examTypes.map(el => {
      if (el.key == this.examSecretList.examTypeId) {
        this.examSecretList.examTypeName = el.value
      }
    })
    this.loadExamSubjects.emit(Object.assign({}, this.examSecretList));
    this.getExamSubjects(this.examSecretList.examTypeId)
  }
  onDateChange() {
    this.examDates.map(el => {
      if (el.key == this.examSecretList.examDateId) {
        this.examSecretList.examTypeDateTime = el.value as any
      }
    })
    this.loadDates.emit(Object.assign({}, this.examSecretList));
  }
  onBarcodeChanged() {
    this.hasBarcode.map(el => {
      if (el.key == this.examSecretList.barcode) {
        this.examSecretList.barcode = el.value
      }
    })
    this.loadBarcode.emit(Object.assign({}, this.examSecretList));
  }

  onFallChanged() {
    this.isFall.map(el => {
      if (el.key == this.examSecretList.isFall) {
        this.examSecretList.isFall = el.value
      }
    })
    this.loadBarcode.emit(Object.assign({}, this.examSecretList));
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examSecretList);
    }
  }

}
