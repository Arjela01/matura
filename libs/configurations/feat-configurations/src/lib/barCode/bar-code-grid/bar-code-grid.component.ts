import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output, ViewChild,
} from '@angular/core';
import {ArchiveFolder, HighSchool, Student} from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {NgForm} from "@angular/forms";
import {
  AcademicYearApiService, GendersApiService,
  HighSchoolApiService, ProfileApiService,
  StudentsApiService
} from "@msh/configurations/data-access-configurations";
import {Router} from "@angular/router";

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
  ],
  templateUrl: './bar-code-grid.component.html',
  styleUrls: ['./bar-code-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarCodeGridComponent  {
  @Input() archiveFolders: ArchiveFolder[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedArchiveFolders: ArchiveFolder[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ArchiveFolder | ArchiveFolder[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();


  @ViewChild('form', {static: true}) form!: NgForm;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly studentService: StudentsApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService,
    private router: Router
  ) {}


  archiveFolder: ArchiveFolder = {
    id: 0,
    name: "",
  }
  saving = false;



  onSubmit(): void {


    const data = { ...this.archiveFolder };

    this.studentService.save(data).subscribe({
      next: () => {
        this.saving = false;

        this.router.navigate(['/configurations/students']).then();
      },
    });
  }


  onEditClick(archiveFolder: ArchiveFolder) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: archiveFolder,
    } as GridEvent<ArchiveFolder>);
  }

  onDeleteClick(archiveFolder: ArchiveFolder) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: archiveFolder,
    } as GridEvent<ArchiveFolder>);
  }

  onSelectAllClick() {
    if (this.selectedArchiveFolders.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ArchiveFolder>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedArchiveFolders,
      } as GridEvent<ArchiveFolder[]>);
    }
  }

  onRowSelect({ data }: { data: ArchiveFolder }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<ArchiveFolder>);
  }

  onRowUnselect({ data }: { data: ArchiveFolder }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<ArchiveFolder>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}


