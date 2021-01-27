import { BadRequest } from "./../utils/apiError";
import { Request, Response, NextFunction } from "express";

// validate the rule field
const checkField = (field: any): void => {
  if (!field) throw new BadRequest("rule field is required.", null);
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
const checkConditionValue = (condition_value: string | number): void => {
  if (!condition_value)
    throw new BadRequest("rule condition value is required.", null);
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

export const validateRequiredFields = (
  { body }: Request,
  res: Response,
  next: NextFunction
) => {
  const { rule, data }: any = body;
  try {
    validateRule(rule);
    validateData(data);
    next();
  } catch (err) {
    next(err);
  }
};
