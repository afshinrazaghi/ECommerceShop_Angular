import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validateConfirmPassword = (
  group: AbstractControl
): ValidationErrors | null => {
  let pass = group.get('password').value;
  let confirmPass = group.get('confirmPassword').value;
  if (!pass || !confirmPass) return null;
  return pass == confirmPass ? null : { confirmPassNotValid: true };
};
