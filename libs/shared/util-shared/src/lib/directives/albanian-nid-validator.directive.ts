import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
import { ALBANIAN_NID_REGEXP } from '../constants/validation-regexes';

export function albanianNidValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === '' || control.value === null) {
      return null;
    }
    const isValid = new RegExp(ALBANIAN_NID_REGEXP).test(control.value);
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
  public validate(control: AbstractControl): ValidationErrors | null {
    return albanianNidValidator()(control);
  }
}
