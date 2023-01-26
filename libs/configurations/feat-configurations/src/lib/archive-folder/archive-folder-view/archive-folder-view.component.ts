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
  ArchiveFolder,
  Student,
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
  AcademicYearApiService,
  ArchiveFolderApiService,
  GendersApiService,
  HighSchoolApiService,
  ProfileApiService,
  StudentsApiService,
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
  @Output() formSave = new EventEmitter<Student>();
  @Output() formClose = new EventEmitter<undefined>();

  @Input() archiveFolders: Student[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedArchiveFolders: Student[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<Student | Student[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  @ViewChild('form', { static: true }) form!: NgForm;
  @Input() set studentDetails(details: Student | null) {
    if (details) {
      this.student = Object.assign({}, details);
    }
  }

  showStudent = false;
  submitted = false;

  student: Student = {
    createdName: '',
    createdOn: new Date(),
    modifiedByName: '',
    modifiedOn: new Date(),
    birthDate: new Date(),
    birthPlace: '',
    email: '',
    genderId: 1,
    idCard: '',
    isA2A3: true,
    isEAlbaniaApplication: true,
    isFall: false,
    lastName: '',
    highSchool: '',
    middleName: '',
    mobilePhone: '',
    profileName: '',
    genderName: '',
    oldID: '',
    profileId: 0,
    schoolFinished: '',
    schoolProfile: '',
    highSchoolName: '',
    schoolName: '',
    highSchoolId: 0,
    session: '',
    studentId: '',
    studyClass: '',
    schoolFinishedName: '',
    firstName: '',
    isConfirmedBySupervisor: true,
    graduationYear: undefined,
  };

  fakeDosjeList: any;
  students= null;
  finishedAtSameSchool = true;

  id: string | null;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly studentService: StudentsApiService,
    private readonly archiveFolderService: ArchiveFolderApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService,
    private router: Router,
    private messageService: MessageService,

    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  archiveFolder: ArchiveFolder = {
    id: 0,
    name: '',
  };
  saving = false;

  ngOnInit(): void {
    this.studentService.getById(this.id).subscribe(result => {
      this.student = { ...result.data };
      this.fakeDosjeList =
        [
          {
            numri: 1,
            barcode: "asdaeda2d1",
            emri: "Lenda 1"
          },
          {
            numri: 2,
            barcode: "asdaeda2d12",
            emri: "Lenda 2"
          },
          {
            numri: 3,
            barcode: "asdaeda2d31",
            emri: "Lenda 3"
          }
        ];

      console.log("fakedosje");
      this.finishedAtSameSchool = this.student?.schoolFinished == '' ||
        this.student?.schoolFinished == null;
      this.cd.detectChanges();
    });
  }

  onSubmit(): void {
    const data = { ...this.archiveFolder };

    this.archiveFolderService.save(data).subscribe({
      next: () => {
        this.saving = false;

        this.router.navigate(['/configurations/students']).then();
      },
    });
  }

  ngOnChanges(): void {
    this.showStudent = this.student.highSchoolId != null;
  }
  onEditClick(archiveFolder: Student) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: archiveFolder,
    } as GridEvent<Student>);
  }
  onActivate(archiveFolder: Student) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: archiveFolder,
    } as GridEvent<Student>);
  }
  onDeleteClick(archiveFolder: Student) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: archiveFolder,
    } as GridEvent<Student>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
