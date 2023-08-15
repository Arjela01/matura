import { CommonModule } from '@angular/common';
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
@Component({
  selector: 'msh-a1-report-view',
  standalone: true,
  imports: [CommonModule, MenubarModule],
  templateUrl: './a1-report-view.component.html',
  styleUrls: ['./a1-report-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A1ReportViewComponent {
  @Input() a1: A1Z | null = null;
  @Input() studentInfo: Student | null = null;
  @Input() highSchoolInfo: HighSchool | null = null;
  @Input() subjects: string[] | null = [];
  @Input() carriedSubjects: any[] = [];
  items: MenuItem[] | undefined;
  carriedSubjectIndex = 17;
  @ViewChild('content', { static: false }) content: ElementRef | undefined;
  // TODO: change when date time created of form is possible by backend
  todayDate = new Date();

  constructor(private router: Router) {}

  generarPDF() {
    const div = document.getElementById('content') as HTMLElement;
    const options = {
      background: 'white',
      scale: 3,
    };

    html2canvas(div, options)
      .then(canvas => {
        var img = canvas.toDataURL('image/PNG');
        var doc = new jsPDF('p', 'mm', 'a4');
        // Add image Canvas to PDF
        const bufferX = 5;
        const bufferY = 10;
        const imgProps = (<any>doc).getImageProperties(img);
        const pdfWidth = 230;
        const pdfHeight = 220;
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
        doc.save('a1.pdf');
      });
  }

  print() {
    const div = document.getElementById('content') as HTMLElement;
    setTimeout(() => {
      let a = window.open('', 'top=0,left=0,height=100%');
      a?.document.write('');
      a?.document.write(
        `<body onload="window.print();setTimeout(window.close, 0);">${div.innerHTML}</body>`
      );
      a?.document.close();
    });
  }
  ngOnInit() {
    const that = this;
    this.items = [
      {
        label: 'Modifiko Formularin',
        icon: 'pi pi-fw pi-pencil',

        command(event) {
          that.generarPDF();
          that.router.navigate([`/applications/a1/edit/${that.a1?.id}`]);
        },
      },
      {
        label: 'Shkarko Formularin',
        icon: 'pi pi-file-pdf',
        command(event) {
          that.generarPDF();
        },
      },
    ];
  }
}
