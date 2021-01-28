import { Response } from "express";
import { Operations, SuccessResponse } from "./operations";

/**
 * Class to validate data against rule
 */
export class ValidateData extends Operations {
  /**
   * Creates a new ValidateData instance
   * @param {Response} res Express response object
   * @param {any} rule Validation rule object
   * @param {any} data Data to validate
   */
  constructor(res: Response, rule: any, data: any) {
    super(res, rule, data);
  }

  /**
   *  Check data against the condition value
   * @returns A Success Response
   */
  checkConditions(): SuccessResponse {
    // check for eq condition
    if (this.rule.condition === "eq") {
      if (this.data[this.rule.field] !== this.rule.condition_value) {
        this.createErrorResponse();
      }
      return this.createSuccessResponse();
    }
    //check for neq condition
    if (this.rule.condition === "neq") {
      if (this.data[this.rule.field] === this.rule.condition_value) {
        this.createErrorResponse();
      }
      return this.createSuccessResponse();
    }
    //check for gt condtion
    if (this.rule.condition === "gt") {
      if (this.data[this.rule.field] <= this.rule.condition_value) {
        this.createErrorResponse();
      }
      return this.createSuccessResponse();
    }
    //check for gte condition
    if (this.rule.condition === "gte") {
      if (this.data[this.rule.field] < this.rule.condition_value) {
        this.createErrorResponse();
      }
      return this.createSuccessResponse();
    }

    //check for contains condition [last condition]
    if (
      this.data[this.rule.field]
        .toString()
        .indexOf(this.rule.condition_value) === -1
    ) {
      this.createErrorResponse();
    }
    return this.createSuccessResponse();
  }

  /**
   *  Check nested field data against the condition value
   * @returns A Success Response
   */
  checkNestedFieldConditions(): SuccessResponse {
    const keys: readonly string[] = this.getNestedFieldsKeys();
    // check for eq condition
    if (this.rule.condition === "eq") {
      if (this.data[keys[0]][keys[1]] !== this.rule.condition_value) {
        this.createErrorResponse();
      }
      return this.createSuccessResponse();
    }
    //check for neq condition
    if (this.rule.condition === "neq") {
      if (this.data[keys[0]][keys[1]] === this.rule.condition_value) {
        this.createErrorResponse();
      }
      return this.createSuccessResponse();
    }
    //check for gt condtion
    if (this.rule.condition === "gt") {
      if (this.data[keys[0]][keys[1]] <= this.rule.condition_value) {
        this.createErrorResponse();
      }
      return this.createSuccessResponse();
    }
    //check for gte condition
    if (this.rule.condition === "gte") {
      if (this.data[keys[0]][keys[1]] < this.rule.condition_value) {
        this.createErrorResponse();
      }
      return this.createSuccessResponse();
    }

    //check for contains condition [last condition]
    if (
      this.data[keys[0]][keys[1]]
        .toString()
        .indexOf(this.rule.condition_value) === -1
    ) {
      this.createErrorResponse();
    }
    return this.createSuccessResponse();
  }
}
