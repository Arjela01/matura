import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ACADEMIC_YEAR_KEY } from '@msh/configurations/data-access-configurations';
import { REPORTS_APP_URL, SafePipe } from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import RxPostmessenger from 'rx-postmessenger';
import { Subject, combineLatest, first, forkJoin, map, skip, tap } from 'rxjs';
import { IframeAutoHeightDirective } from '../iframe-auto-height.directive';
import { Report } from '../../../../reports-enum';
import { Path } from './paths-enum';

@Component({
  selector: 'msh-report-renderer',
  standalone: true,
  imports: [
    CommonModule,
    IframeAutoHeightDirective,
    SafePipe,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './report-renderer.component.html',
  styleUrls: ['./report-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportRendererComponent implements OnInit {
  @ViewChild('reportRenderer', { static: true })
  iframe!: ElementRef<HTMLIFrameElement>;
  id: string = this.route.snapshot.params['id'];
  academicYear: any;
  studentObj: { value: string | number; key: string } | null =
    this.findStudentID(this.route.snapshot.queryParams);
  folderObj: { value: string | number; key: string } | null =
    this.findArchiveFolderNr(this.route.snapshot.queryParams);
  yearObj: { value: string | number; key: string } | null = this.findYearID(
    this.route.snapshot.queryParams
  );
  displayModal = false;
  iframeUrl = '';
  a1Report: Report = Report.A1Form_Report;
  a1ZReport: Report = Report.A1ZForm_Report;
  reportsPath: Path = Path.Reports;
  a1Path: Path = Path.ApplicationsA1;
  a1ZPath: Path = Path.ApplicationsA1Z;

  private readonly iframeLoaded$$ = new Subject<boolean>();
  private readonly iframeLoaded$ = this.iframeLoaded$$
    .asObservable()
    .pipe(first());
  private readonly userToken$ = this.authFacade.token$.pipe(first());

  sendMessage$ = forkJoin([this.iframeLoaded$, this.userToken$]).pipe(
    map(([_, token]: [boolean, string]) => token),
    tap(token => {
      const childMessenger = RxPostmessenger.connect(
        this.iframe.nativeElement.contentWindow as Window,
        this.reports_app_url
      );
      childMessenger.notify('report', {
        userToken: token,
      });
    })
  );
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([data]) => {
      this.router.navigate([`reports`]);
    }),
    tap()
  );

  showDiplomasButton = false;

  findStudentID(obj: { [x: string]: string | number }) {
    const key = Object.keys(obj).find(k => k.toLowerCase() === 'studentid');
    if (key) {
      return { key: key, value: obj[key] };
    }
    return null;
  }
  findYearID(obj: { [x: string]: string | number }) {
    const key = Object.keys(obj).find(
      k => k.toLowerCase() === 'academicyearid'
    );
    if (key) {
      return { key: key, value: obj[key] };
    }
    return null;
  }
  findArchiveFolderNr(obj: { [x: string]: string | number }) {
    const key = Object.keys(obj).find(k => k.toLowerCase() === 'foldernr');
    if (key) {
      return { key: key, value: obj[key] };
    }
    return null;
  }

  constructor(
    @Inject(REPORTS_APP_URL) readonly reports_app_url: string,
    private readonly authFacade: AuthFacade,
    private readonly route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}
  onIframeLoad(): void {
    this.iframeLoaded$$.next(true);
  }

  ngOnInit() {
    const academicYearFilter = localStorage.getItem(ACADEMIC_YEAR_KEY);
    if (academicYearFilter) {
      this.academicYear = JSON.parse(academicYearFilter).id;
    }
    if (this.id === '16') {
      this.showDiplomasButton = true;
    }

    if (this.id && this.studentObj && this.yearObj) {
      this.iframeUrl = `${this.reports_app_url}/?reportId=${this.id}&${this.studentObj.key}=${this.studentObj.value}&${this.yearObj.key}=${this.yearObj.value}`;
    } else if (this.id && this.folderObj && this.yearObj) {
      this.iframeUrl = `${this.reports_app_url}/?reportId=${this.id}&${this.folderObj.key}=${this.folderObj.value}&${this.yearObj.key}=${this.yearObj.value}`;
    } else {
      this.iframeUrl = `${this.reports_app_url}/?reportId=${this.id}&academicyearid=${this.academicYear}`;
    }
  }

  goBack(): void {
    const currentUrl = this.router.url;
    let destinationPath = ''
    if (this.id === this.a1Report.toString()) {
      destinationPath =
        currentUrl === `/${this.reportsPath}/${this.a1Report}`
          ? this.reportsPath
          : this.a1Path;
    } else if (this.id === this.a1ZReport.toString()) {
      destinationPath =
        currentUrl === `/${this.reportsPath}/${this.a1ZReport}`
          ? this.reportsPath
          : this.a1ZPath;
    } else {
      destinationPath = this.reportsPath
    }
    this.router.navigate([destinationPath]).then();
  }
}
