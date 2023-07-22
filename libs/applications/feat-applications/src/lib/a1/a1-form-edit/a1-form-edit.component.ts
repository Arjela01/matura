import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {A1Z} from "@msh/applications/domain-application";
import {A1FormComponent} from "../a1-form/a1-form.component";
import {ActivatedRoute} from "@angular/router";
import {A1FormModeEnum} from "../a1-form-mode.enum";

@Component({
  selector: 'msh-a1-form-edit',
  standalone: true,
  templateUrl: './a1-form-edit.component.html',
  styleUrls: ['./a1-form-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    A1FormComponent,
  ],
  providers: [],
})
export class A1FormEditComponent {
  id = '';

  constructor(private  route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
  }

  protected readonly A1FormModeEnum = A1FormModeEnum;
}
