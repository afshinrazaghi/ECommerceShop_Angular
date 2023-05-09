import { Validator } from "fluentvalidation-ts";
import { LoginUserRequest } from "../models/login-user-request";

export class LoginUserValidator extends Validator<LoginUserRequest>{
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
  }
}
