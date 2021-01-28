import { Response } from "express";
import { BadRequest } from "./apiError";

export type SuccessResponse = Response<any, Record<string, any>>;

/**
 * @abstract
 * Class to perform operations on field and data
 */
export abstract class Operations {
  readonly rule: any;
  readonly data: any;
  readonly res: Response;

  /**
   * Creates a new Operations instance
   * @param {Response} res Express response object
   * @param {any} rule Validation rule object
   * @param {any} data Data to validate
   */
  constructor(res: Response, rule: any, data: any) {
    this.res = res;
    this.rule = rule;
    this.data = data;
  }

  /**
   * checks if field in rule object exists in data when data is an object
   */
  checkObjectDataFields(): void {
    const hasField = (field: any, data: any): void => {
      if (!(field in data)) {
        throw this.createErrorResponse("fieldValidation");
      }
    };
    //check for nested fields
    if (typeof this.rule.field === "string" && this.isNested()) {
      const keys: readonly string[] = this.getNestedFieldsKeys();
      if (keys[0] in this.data) {
        hasField(keys[1], this.data[keys[0]]);
      } else throw this.createErrorResponse("fieldValidation");
    } else hasField(this.rule.field, this.data);
  }
  checkDataFields(): void {
    if (
      this.data[this.rule.field] === undefined ||
      this.data[this.rule.field] === null
    )
      throw this.createErrorResponse("fieldValidation");
  }

  /**
   * Checks for a nested data field
   * @returns True or False
   */
  isNested(): boolean {
    return this.rule.field.includes(".");
  }

  /**
   * Get nested fields property keys
   * @returns An array with nested fields property keys
   */
  getNestedFieldsKeys(): Readonly<Array<string>> {
    return this.rule.field.split(".");
  }

  /**
   * Method to return a field value from a data set
   * @returns A field value
   */
  private getFieldValue(): any {
    return typeof this.data === "object" &&
      typeof this.rule.field === "string" &&
      this.isNested()
      ? this.data[this.getNestedFieldsKeys()[0]][this.getNestedFieldsKeys()[1]]
      : this.data[this.rule.field];
  }

  /**
   * Method to send a sucess response
   * @param {Response} res express response object
   * @returns A successful JSON response
   */
  createSuccessResponse(): SuccessResponse {
    return this.res.json({
      message: `field ${this.rule.field} successfully validated.`,
      status: "success",
      data: {
        validation: {
          error: false,
          field: this.rule.field,
          field_value: this.getFieldValue(),
          condition: this.rule.condition,
          condition_value: this.rule.condition_value,
        },
      },
    });
  }

  /**
   *
   * @param fieldValidation error for field validation
   * @throws Bad request Error (HTTP 400)
   */
  createErrorResponse(fieldValidation?: "fieldValidation"): void {
    if (fieldValidation) {
      throw new BadRequest(
        `field ${this.rule.field} is missing from data.`,
        null
      );
    }
    throw new BadRequest(`field ${this.rule.field} failed validation.`, {
      validation: {
        error: true,
        field: this.rule.field,
        field_value: this.getFieldValue(),
        condition: this.rule.condition,
        condition_value: this.rule.condition_value,
      },
    });
  }
}
