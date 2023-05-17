import {Directive, ElementRef, HostListener} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';
import {ALBANIAN_NID_REGEXP} from '../constants/validation-regexes';

export function albanianNidValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === '' || control.value === null) {
      return null;
    }
    const value = control.value.toUpperCase(); // Convert to uppercase
    const isValid = new RegExp(ALBANIAN_NID_REGEXP).test(value);
    if (isValid) {
      return null;
    } else {
      return {
        albanianNidValidator: {
          valid: false,
        },
      };
    }
  };
}

@Directive({
  selector: '[mshAlbanianNidValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AlbanianNidValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class AlbanianNidValidatorDirective implements Validator {
  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  validate(control: AbstractControl): ValidationErrors | null {
    return albanianNidValidator()(control);
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    this.elementRef.nativeElement.value = value.toUpperCase();
  }
}
