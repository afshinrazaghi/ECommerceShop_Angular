import { Validator } from "fluentvalidation-ts";
import { RegisterUserRequest } from '../models/register-user-request';

export class RegisterUserValidator extends Validator<RegisterUserRequest>{
  constructor() {
    super();

    this.ruleFor('email')
      .notEmpty().withMessage('Email is mandatory')
      .notNull().withMessage('Email is mandatory')
      .emailAddress().withMessage("email address is invalid");

    this.ruleFor('password')
      .notEmpty().withMessage('Password is mandatory')
      .notNull().withMessage('Password is mandatory')
      .minLength(6).withMessage("password must be more than 6 character");

    this.ruleFor('confirmPassword')
      .notEmpty().withMessage('Password is mandatory')
      .notNull().withMessage('Password is mandatory')
      .minLength(6).withMessage("confirm password must be more than 6 character");

    this.ruleFor('confirmPassword')
      .must((confirmPassword, model) => confirmPassword == model.password)
      .withMessage("password and confirm password not match")
      .when((model) => model.password != null && model.confirmPassword != null);
  }

}
