import { BadRequest } from "./../utils/apiError";
import { Request, Response, NextFunction } from "express";

// validate the rule field
const checkField = (field: any): any => {
  if (!field) throw new BadRequest("rule field is required.", null);
  if (typeof field !== "string")
    throw new BadRequest("rule field should be a string.", null);
};

// validate the rule condition
const checkCondition = (condition: any): any => {
  if (!condition) throw new BadRequest("rule condition is required.", null);
  if (!/\beq\b|\bcontains\b|\bgte\b|\bneq\b|\bgt\b/g.test(condition))
    throw new BadRequest(
      "rule condition accepts only 'eq','neq','gt','gte' or 'contains'.",
      null
    );
};

// validate the condition value
const checkConditionValue = (condition_value: any): any => {
  if (!condition_value)
    throw new BadRequest("rule condition value is required.", null);
  if (typeof condition_value !== "number")
    throw new BadRequest("rule condition value should be a number.", null);
};

//validate the rule object
const validateRule = (rule: any): any => {
  if (!rule) throw new BadRequest("rule is required.", null);
  if (typeof rule !== "object")
    throw new BadRequest("rule should be an object.", null);
  checkField(rule.field);
  checkCondition(rule.condition);
  checkConditionValue(rule.condition_value);
};

const validateData = (data: any): any => {
  if (!data) throw new BadRequest("data is required.", null);
};

export const validateRequiredFields = (
  { body }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRule(body.rule);
    validateData(body.data);
    next();
  } catch (err) {
    next(err);
  }
};
