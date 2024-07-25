import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'msh-custom-switch',
  standalone: true,
  templateUrl: './app-custom-switch.component.html',
  styleUrls: ['./app-custom-switch.component.scss'],
  imports: [InputSwitchModule, FormsModule, NgClass, CommonModule],
})
export class CustomSwitchComponent {
  @Input() isOn = false;
  @Input() label = 'Label';
  @Output() isOnChange = new EventEmitter<boolean>();

  onSwitchChange(event: any) {
    this.isOn = event.checked;
    this.isOnChange.emit(this.isOn);
  }
}
