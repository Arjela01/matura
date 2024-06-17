import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { A1Z } from '@msh/applications/domain-application';
import { HighSchool, Student } from '@msh/shared/domain-models';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AppBoolPipe, AppDatePipe, AppTimePipe } from '@msh/shared/ui-shared';
@Component({
  selector: 'msh-a1-report-view',
  standalone: true,
  imports: [CommonModule, MenubarModule, AppDatePipe, AppTimePipe, AppBoolPipe],
  templateUrl: './a1-report-view.component.html',
  styleUrls: ['./a1-report-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class A1ReportViewComponent {
  @Input() a1: A1Z | null = null;
  @Input() studentInfo: Student | null = null;
  @Input() highSchoolInfo: HighSchool | null = null;
  @Input() set carriedSubjects(value: any) {
    this.examSubjects = value.filter((v: any) => {
      return !v.isNotGraded && !v.score;
    });
    this.nonExamSubjects = value.filter((v: any) => {
      return !(!v.isNotGraded && !v.score);
    });
  }

  examSubjects: any = [];
  nonExamSubjects: any = [];

  items: MenuItem[] | undefined;
  carriedSubjectIndex = 18;
  @ViewChild('content', { static: false }) content: ElementRef | undefined;
  // TODO: change when date time created of form is possible by backend
  todayDate = new Date();

  constructor(private router: Router) {}

  generarPDF() {
    const div = document.getElementById('content') as HTMLElement;
    const options = {
      background: 'white',
      scale: 3.5,
    };

    //TODO : refactor to a service
    html2canvas(div, options)
      .then(canvas => {
        const img = canvas.toDataURL('image/jpeg');
        const doc = new jsPDF('p', 'mm', 'a4');
        // Add image Canvas to PDF
        const bufferX = 5;
        const bufferY = 10;
        const imgProps = (<any>doc).getImageProperties(img);
        const pdfWidth = 230;
        const pdfHeight = 240;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );

        return doc;
      })
      .then(doc => {
        this.a1?.isA1
          ? doc.save(
              `a1-${this.studentInfo?.firstName}-${this.studentInfo?.lastName}.pdf`
            )
          : doc.save(
              `a1z-${this.studentInfo?.firstName}-${this.studentInfo?.lastName}.pdf`
            );
      });
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Modifiko Formularin',
        icon: 'pi pi-fw pi-pencil',
        iconStyle: { 'font-size': '1.3rem' },
        style: { 'font-size': '1.1rem' },
        command: event => {
          this.a1?.isA1
            ? this.router.navigate([`/applications/a1/edit/${this.a1?.id}`])
            : this.router.navigate([`/applications/a1z/edit/${this.a1?.id}`]);
        },
      },
      {
        label: 'Shkarko Formularin',
        icon: 'pi pi-print',
        iconStyle: { 'font-size': '1.3rem' },
        style: { 'font-size': '1.1rem', 'margin-left': 'auto' },
        command: event => {
          this.generarPDF();
        },
      },
    ];
  }
}
