import { BadRequest } from "./../utils/apiError";
import { Request, Response, NextFunction } from "express";

// validate the rule field
const checkField = (field: string): void => {
  if (!field) throw new BadRequest("rule field is required.", null);
  if (typeof field !== "string")
    throw new BadRequest("rule field should be a string.", null);
};

// validate the rule condition field
const checkCondition = (condition: string): void => {
  if (!condition) throw new BadRequest("rule condition is required.", null);
  if (!/\beq\b|\bcontains\b|\bgte\b|\bneq\b|\bgt\b/g.test(condition))
    throw new BadRequest(
      "rule condition accepts only 'eq','neq','gt','gte' or 'contains'.",
      null
    );
};

// validate the rule condition value field
const checkConditionValue = (condition_value: number): void => {
  if (!condition_value)
    throw new BadRequest("rule condition value is required.", null);
  if (typeof condition_value !== "number")
    throw new BadRequest("rule condition value should be a number.", null);
};

//validate the rule field
const validateRule = (rule: any): void => {
  if (!rule) throw new BadRequest("rule is required.", null);
  if (typeof rule !== "object")
    throw new BadRequest("rule should be an object.", null);
  checkField(rule.field);
  checkCondition(rule.condition);
  checkConditionValue(rule.condition_value);
};

//validate the data field
const validateData = (data: any): any => {
  if (!data) throw new BadRequest("data is required.", null);
};

// check if fields in rule objects exist in data
const checkFields = (field: string, data: any) => {
  //field validation error
  const fieldError: BadRequest = new BadRequest(
    `field ${field} is missing from data.`,
    null
  );

  if (typeof data === "object") {
    //check if fields in rule objects exist in data object
    const hasField = (field: string, data: any): void => {
      if (!(field in data)) {
        throw fieldError;
      }
    };
    //check for nested fields
    if (field.includes(".")) {
      const keys: string[] = field.split(".");
      if (keys[0] in data) {
        hasField(keys[1], data[keys[0]]);
      } else throw fieldError;
    } else hasField(field, data);
  }
};

export const validateRequiredFields = (
  { body }: Request,
  res: Response,
  next: NextFunction
) => {
  const { rule, data }: any = body;
  try {
    validateRule(rule);
    validateData(data);
    checkFields(rule.field, data);
    next();
  } catch (err) {
    next(err);
  }
};
