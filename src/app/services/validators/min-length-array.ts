import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

export function minLengthArray(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray && control.length >= min) {
      return null; // Válido se tem pelo menos 'min' elementos
    }
    return { minLengthArray: { requiredLength: min, actualLength: (control as FormArray).length || 0 } };
  };
}