import { Validator } from "fluentvalidation-ts";
import { UpdateUserRequest } from "../models/update-user-request";

export class UpdateUservalidator extends Validator<UpdateUserRequest>{
  constructor(){
    super();

    this.ruleFor('firstName')
    .notEmpty().withMessage('First Name is mandatory')
    .notNull().withMessage('First Name is mandatory');

    this.ruleFor('lastName')
    .notEmpty().withMessage('Last Name is mandatory')
    .notNull().withMessage('Last Name is mandatory');

    this.ruleFor('password')
    .notEmpty().withMessage('Password is mandatory')
    .notNull().withMessage('Password is mandatory')
    .minLength(6).withMessage("Password must be at least 6 characters");

  }
}
