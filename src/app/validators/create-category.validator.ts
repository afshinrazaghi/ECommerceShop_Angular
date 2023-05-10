import { Validator } from "fluentvalidation-ts";
import { CreateCategoryRequest } from "../models/create-category-response";

export class CreateCategoryValidator extends Validator<CreateCategoryRequest>
{
  constructor() {
    super();
    this.ruleFor('name')
      .notEmpty().withMessage('Name is mandatory')
      .notNull().withMessage('Name is mandatory');

  }
}
