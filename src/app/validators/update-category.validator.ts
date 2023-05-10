import { Validator } from "fluentvalidation-ts";
import { UpdateCategoryRequest } from "../models/update-category-request";

export class UpdateCategoryValidator extends Validator<UpdateCategoryRequest>{
  constructor(){
    super();

    this.ruleFor('name')
    .notNull().withMessage('name is mandatory')
    .notEmpty().withMessage('name is mandatory');
  }
}
