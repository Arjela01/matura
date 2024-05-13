import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import {
  CountryName,
  DiplomaRecognition,
  DiplomaRecognitionDocuments,
} from '@msh/shared/domain-models';
import { Router } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GlobalToastService } from '@msh/shared/util-shared';
import { DiplomaRecognitionService } from '@msh/evaluations/data-access-evaluations';
import {
  CountriesApiService,
  GendersApiService,
} from '@msh/configurations/data-access-configurations';
import { DiplomaRecognitionDocumentsComponent } from '../diploma-recognition-documents/diploma-recognition-documents.component';

@UntilDestroy()
@Component({
  selector: 'msh-diploma-recognition-request',
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
    RippleModule,
    TableModule,
    DialogModule,
    CalendarModule,
    FileUploadModule,
    DiplomaRecognitionDocumentsComponent,
  ],
  templateUrl: './diploma-recognition-application.component.html',
  styleUrls: ['./diploma-recognition-application.component.scss'],
})
export class DiplomaRecognitionRequestComponent implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;
  uploaded = false;

  genders: DropdownModel<number>[] = [];
  submitted = false;
  base64!: string;
  countriesList: DropdownModel<number>[] = [];
  displayRequestModal = false;

  diplomaRecognition: DiplomaRecognition = {
    address: '',
    cel: '',
    city: '',
    countryOfBirthID: CountryName.Albania,
    countryOfBirthName: '',
    dateOfBirth: new Date(),
    diplomaName: '',
    diplomaRecognitionsRequestStatusID: 0,
    diplomaRecognitionsRequestStatusName: '',
    email: '',
    fatherName: '',
    firstName: '',
    genderID: 0,
    genderName: '',
    id: '',
    idCard: '',
    isRecognitionAndEquivalency: false,
    lastName: '',
    municipality: '',
    nationalityID: CountryName.Albania,
    nationalityName: '',
    postalCode: '',
    schoolAddress: '',
    schoolCity: '',
    schoolEmail: '',
    schoolGraduationDate: new Date(),
    schoolName: '',
    schoolPostalCode: '',
    schoolStartDate: new Date(),
    schoolTelFix: '',
    schoolWebSite: '',
    telFix: '',
    yearsOfStudy: 0,
  };

  constructor(
    private readonly toastService: GlobalToastService,
    private readonly diplomaRecognitionService: DiplomaRecognitionService,
    private readonly router: Router,
    private readonly cd: ChangeDetectorRef,
    private readonly genderService: GendersApiService,
    private countriesService: CountriesApiService
  ) {}

  ngOnInit() {
    this.genderService.loadDropdownList().subscribe(response => {
      this.genders = response.data;
      this.cd.detectChanges();
    });
    this.countriesService.loadDropdownList().subscribe(response => {
      this.countriesList = response.data;
      this.diplomaRecognition.nationalityID = this.countriesList.find(
        data => data.additionalValue === 'AL'
      )?.key as number;
      this.diplomaRecognition.countryOfBirthID = this.countriesList.find(
        data => data.additionalValue === 'AL'
      )?.key as number;
      this.cd.detectChanges();
    });
  }

  updateRecognitionAndEquivalency(event: any) {
    this.diplomaRecognition.isRecognitionAndEquivalency = event.checked;
  }

  onRequestModalClose() {
    this.displayRequestModal = false;
  }

  onCancelClick() {
    this.router.navigate(['/evaluations/diploma-recognition']);
  }

  addDiplomaRecognitionForm(diplomaRecognition: DiplomaRecognition) {
    this.diplomaRecognitionService
      .save(diplomaRecognition)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Formulari për njësimin e diplomës u shtua me sukses!'
          );
          this.router.navigate(['/evaluations/diploma-recognition']);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të formularit për njësimin e diplomës!'
          );
      });
  }

  onUpload(event: any) {
    for (const file of event.files) {
      if (!this.isFileUploaded(file)) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const result = fileReader.result;
          if (result) {
            const parts = result.toString().split(';base64,');
            const parsedBase64 = parts[1];
            if (!this.diplomaRecognition.files) {
              this.diplomaRecognition.files = [];
            }
            this.diplomaRecognition.files.push({
              data: parsedBase64,
              fileName: file.name,
              mimeType: file.type,
            });
            this.uploaded = true;
          }
        };

        fileReader.readAsDataURL(file);
      }
    }
  }

  isFileUploaded(file: File) {
    return (
      this.diplomaRecognition.files &&
      this.diplomaRecognition.files.some(f => f.fileName === file.name)
    );
  }

  onSubmit() {
    this.submitted = true;
    this.addDiplomaRecognitionForm(this.diplomaRecognition);
  }
}
