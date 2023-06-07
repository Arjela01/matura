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
import RxPostmessenger from 'rx-postmessenger';
import { Subject, first, forkJoin, map, tap } from 'rxjs';
import { IframeAutoHeightDirective } from '../iframe-auto-height.directive';

@Component({
  selector: 'msh-report-renderer',
  standalone: true,
  imports: [CommonModule, IframeAutoHeightDirective, SafePipe, ButtonModule],
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
  yearObj: { value: string | number; key: string } | null = this.findYearID(
    this.route.snapshot.queryParams
  );
  iframeUrl = '';
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

    if (this.id && this.studentObj && this.yearObj) {
      this.iframeUrl = `${this.reports_app_url}/?reportId=${this.id}&${this.studentObj.key}=${this.studentObj.value}`;
    } else if (this.academicYear && this.id) {
      this.iframeUrl = `${this.reports_app_url}/?reportId=${this.id}`;
    }
  }

  goBack(): void {
    if (this.id === '13') {
      this.router.navigate(['applications/a1']).then();
    } else if (this.id === '14') {
      this.router.navigate(['applications/a1z']).then();
    } else {
      this.router.navigate(['reports']).then();
    }
  }
}
