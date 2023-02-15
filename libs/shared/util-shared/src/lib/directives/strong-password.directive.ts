import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
import { STRONG_PASSWORD_REGEXP } from '../constants/validation-regexes';

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = new RegExp(STRONG_PASSWORD_REGEXP).test(control.value);
    if (isValid) {
      return null;
    } else {
      return {
        strongPasswordValidator: {
          valid: false,
        },
      };
    }
  };
}

@Directive({
  selector: '[mshStrongPasswordValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StrongPasswordDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class StrongPasswordDirective implements Validator {
  public validate(control: AbstractControl): ValidationErrors | null {
    return strongPasswordValidator()(control);
  }
}
