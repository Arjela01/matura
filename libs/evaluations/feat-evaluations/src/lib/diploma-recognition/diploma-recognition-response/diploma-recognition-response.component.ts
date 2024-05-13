import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
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
  DashboardItem,
  DiplomaRecognition,
  DiplomaRecognitionDocuments,
  DiplomaRecognitionFiles,
} from '@msh/shared/domain-models';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GlobalToastService } from '@msh/shared/util-shared';
import {
  DiplomaRecognitionDocumentsService,
  DiplomaRecognitionService,
} from '@msh/evaluations/data-access-evaluations';
import {
  CountriesApiService,
  GendersApiService,
} from '@msh/configurations/data-access-configurations';
import { DiplomaRecognitionDocumentsComponent } from '../diploma-recognition-documents/diploma-recognition-documents.component';

@UntilDestroy()
@Component({
  selector: 'msh-diploma-recognition-response',
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
  templateUrl: './diploma-recognition-response.component.html',
  styleUrls: ['./diploma-recognition-response.component.scss'],
})
export class DiplomaRecognitionResponseComponent implements OnInit {
  uploadedResponseDocuments: DiplomaRecognitionDocuments[] = [];
  uploadedRequestDocuments: DiplomaRecognitionDocuments[] = [];
  diplomaRecognitionStatus: DropdownModel<string>[] = [];
  genders: DropdownModel<number>[] = [];
  diplomaRecognitionId!: number;
  displayResponseModal = false;
  displayRequestModal = false;

  @ViewChild('form', { static: true }) form!: NgForm;
  isResponseModal = false;
  isRequestModal = false;

  submitted = false;
  base64!: string;
  maxDate = new Date();
  countriesList: DropdownModel<number>[] = [];
  diplomaRecognitionDocuments: DiplomaRecognitionDocuments = {};

  diplomaRecognition: DiplomaRecognition = {
    address: '',
    cel: '',
    city: '',
    countryOfBirthID: CountryName.Albania,
    countryOfBirthName: '',
    dateOfBirth: this.maxDate,
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

  event: any = {
    first: 0,
    rows: 100,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  constructor(
    private readonly toastService: GlobalToastService,
    private readonly diplomaRecognitionService: DiplomaRecognitionService,
    private readonly router: Router,
    private readonly cd: ChangeDetectorRef,
    private readonly genderService: GendersApiService,
    private countriesService: CountriesApiService,
    private readonly route: ActivatedRoute,
    private readonly documentsService: DiplomaRecognitionDocumentsService
  ) {
    this.diplomaRecognitionId = this.route.snapshot.paramMap.get('id') as any;
  }

  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    this.getOneDiplomaRecognitionRecord();
    this.getDiplomaRecognitionStatus();
    this.getGenders();
    this.getCountries();
    this.getAllResponseFiles();
    this.getAllRequestFiles();
  }

  updateRecognitionAndEquivalency(event: any) {
    this.diplomaRecognition.isRecognitionAndEquivalency = event.checked;
  }

  getDiplomaRecognitionStatus() {
    this.diplomaRecognitionService
      .getStatus()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.diplomaRecognitionStatus = res.data;
        this.cd.detectChanges();
      });
  }
  getGenders() {
    this.genderService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.genders = response.data;
        this.cd.detectChanges();
      });
  }

  getCountries() {
    this.countriesService.loadDropdownList().subscribe(response => {
      this.countriesList = response.data;
      this.diplomaRecognition.countryOfBirthID = this.countriesList.find(
        data => data.additionalValue === 'AL'
      )?.key as number;
      this.diplomaRecognition.nationalityID = this.countriesList.find(
        data => data.additionalValue === 'AL'
      )?.key as number;
      this.cd.detectChanges();
    });
  }

  onCancelClick() {
    this.router.navigate(['/evaluations/diploma-recognition']);
  }

  onResponseModalClick() {
    this.isResponseModal = true;
    this.displayResponseModal = true;
    this.cd.detectChanges();
  }
  onResponseModalClose() {
    this.displayResponseModal = false;
  }

  onRequestModalClick() {
    this.isRequestModal = true;
    this.displayRequestModal = true;
    this.cd.detectChanges();
  }

  onRequestModalClose() {
    this.displayRequestModal = false;
  }

  onFormSave(diplomaRecognitionDocuments: DiplomaRecognitionDocuments) {
    const serviceMethod = this.isResponseModal
      ? this.documentsService.addResponseDocuments
      : this.documentsService.addRequestDocuments;

    serviceMethod
      .call(
        this.documentsService,
        diplomaRecognitionDocuments,
        this.diplomaRecognitionId
      )
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          const message = this.isResponseModal
            ? 'Dokumenti i përgjigjjes'
            : 'Dokumenti i aplikimit';
          this.toastService.showSuccess(`${message} u shtua me sukses!`);
          if (this.isResponseModal) {
            this.displayResponseModal = false;
            this.getAllResponseFiles();
          } else {
            this.displayRequestModal = false;
            this.getAllRequestFiles();
          }
        } else {
          this.toastService.showError(
            response.errorMessage ||
              `Ndodhi një problem gjatë ngarkimit të dokumentit!`
          );
        }
      });
  }

  deleteRequestFiles(fileId: number) {
    this.deleteFiles(fileId, false);
  }

  deleteResponseFiles(fileId: number) {
    this.deleteFiles(fileId, true);
  }

  deleteFiles(fileId: number, isResponse: boolean) {
    const serviceMethod = isResponse
      ? this.documentsService.deleteResponseDocuments
      : this.documentsService.deleteRequestDocuments;

    serviceMethod
      .call(this.documentsService, this.diplomaRecognitionId, fileId)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        if (res.isSuccessful) {
          const message = isResponse
            ? 'Dokumenti i përgjigjjes'
            : 'Dokumenti i aplikimit';
          this.toastService.showSuccess(`${message} u fshi me sukses`);
          isResponse ? this.getAllResponseFiles() : this.getAllRequestFiles();
        } else {
          this.toastService.showError(res.errorMessage);
        }
      });
  }

  getOneDiplomaRecognitionRecord() {
    this.diplomaRecognitionService
      .getOneRecord(this.diplomaRecognitionId)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.diplomaRecognition = {
          ...res.data,
          dateOfBirth: new Date(res.data.dateOfBirth),
          schoolGraduationDate: new Date(res.data.schoolGraduationDate),
          schoolStartDate: new Date(res.data.schoolStartDate),
        };
        this.cd.detectChanges();
      });
  }

  getAllResponseFiles() {
    this.getAllFiles(true);
  }

  getAllRequestFiles() {
    this.getAllFiles(false);
  }

  getAllFiles(isResponse: boolean) {
    const serviceMethod = isResponse
      ? this.documentsService.getResponseFiles
      : this.documentsService.getRequestFiles;

    serviceMethod
      .call(this.documentsService, this.diplomaRecognitionId, this.event)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        const documents = res.data.map((file: DiplomaRecognitionFiles) => ({
          id: file.id,
          fileName: file.fileName,
        }));
        isResponse
          ? (this.uploadedResponseDocuments = documents)
          : (this.uploadedRequestDocuments = documents);
        this.cd.detectChanges();
      });
  }

  updateDiplomaRecognitionForm(diplomaRecognition: DiplomaRecognition) {
    this.diplomaRecognitionService
      .update(diplomaRecognition)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Formulari për njësimin e diplomës u ndryshua me sukses!'
          );
          this.router.navigate(['/evaluations/diploma-recognition']);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të formularit për njësimin e diplomës!'
          );
        this.cd.detectChanges();
      });
  }
  downloadFile(fileId: number, isResponse: boolean) {
    const serviceMethod = isResponse
      ? this.documentsService.getOneResponseFile
      : this.documentsService.getOneRequestFile;

    serviceMethod
      .call(this.documentsService, this.diplomaRecognitionId, fileId)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          if (response.isSuccessful) {
            const decodedData = atob(response.data.data);
            const array = new Uint8Array(decodedData.length);
            for (let i = 0; i < decodedData.length; i++) {
              array[i] = decodedData.charCodeAt(i);
            }
            const blob = new Blob([array], { type: response.data.mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = response.data.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            this.toastService.showError(response.errorMessage);
          }
        },
        (error: string) => {
          this.toastService.showError(error);
        }
      );
  }

  downloadRequestFile(fileId: number) {
    this.downloadFile(fileId, false);
  }

  downloadResponseFile(fileId: number) {
    this.downloadFile(fileId, true);
  }

  onSubmitRequest() {
    this.submitted = true;
    if (this.form.valid) {
      this.updateDiplomaRecognitionForm(this.diplomaRecognition);
    }
  }
}
