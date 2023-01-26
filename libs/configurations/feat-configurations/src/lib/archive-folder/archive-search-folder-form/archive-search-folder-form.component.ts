import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {ArchiveFolder, HighSchool} from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import {Router} from "@angular/router";
import {takeUntil} from "rxjs";
import {
  AcademicYearApiService, ArchiveFolderApiService, GendersApiService,
  HighSchoolApiService, ProfileApiService,
  StudentsApiService
} from "@msh/configurations/data-access-configurations";

@Component({
  selector: 'msh-archive-search-folder-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
  ],
  templateUrl: './archive-search-folder-form.component.html',
  styleUrls: ['./archive-search-folder-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveSearchFolderFormComponent  implements OnChanges {
  @Input() cities: DropdownModel<number>[] = [];
  @Input() regions: DropdownModel<number>[] = [];
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() examVersion: DropdownModel<number>[] = [];

  @Input() set archiveFolders(details: ArchiveFolder | null) {
    if (details) {
      this.archiveFolder = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<ArchiveFolder>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  examTypesFiltered: DropdownModel<number>[] = [];
  searching= true;

  archiveFolder: ArchiveFolder = {
    id: 0,
    name: "",

  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor( private cd: ChangeDetectorRef,
               private readonly academicYearService: AcademicYearApiService,
               private readonly studentService: StudentsApiService,
               private readonly highSchoolService: HighSchoolApiService,
               private readonly profileService: ProfileApiService,
               private readonly genderService: GendersApiService,
               private router: Router,
               private archiveFolderService: ArchiveFolderApiService
  ) {}

  ngOnChanges(): void {
    if (this.examTypes && this.archiveFolder.id) {
      this.onExamTypeChange({ value: this.archiveFolder.id });
    }
  }

  onCancelClick() {
    this.formClose.emit();
  }


  onSearchClick(): void {
    const data = { ...this.archiveFolder };

    this.archiveFolderService.save(data).subscribe({
      next: () => {
        this.searching = true;

        this.router.navigate(['/configurations/add-barCode', ['id']]).then();
      },
    });
  }





  onExamTypeChange($event: any) {
    // eslint-disable-next-line max-len
    this.examTypesFiltered = this.examTypes.filter(c => c.parentKey == $event.value);
  }
}
