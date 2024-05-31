import { Directive, HostListener } from '@angular/core';
import { DefaultValueAccessor } from '@angular/forms';

@Directive({
  standalone: true,
  selector: 'input[toUppercase]',
})
export class UpperCaseInputDirective extends DefaultValueAccessor {
  @HostListener('input', ['$event']) input($event: InputEvent) {
    const target = $event.target as HTMLInputElement;
    const start = target.selectionStart;

    target.value = target.value.toUpperCase();
    target.setSelectionRange(start, start);

    this.onChange(target.value);
  }
}
