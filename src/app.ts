import express, { NextFunction, Request, Response } from "express";
import { validateRequiredFields } from "./middlewares/validateRequiredFields";
import { apiErrorHandler, BadRequest } from "./utils/apiError";

const app: express.Application = express();

function main() {
  // json parser middleware
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: "MY Rule-Validation API",
      status: "success",
      data: {
        name: "Cosmos Appiah",
        github: "@Console45",
        email: "cosmosappiah029@gmail.com",
        mobile: "+233557452509",
        twitter: "@nanalit45",
      },
    });
  });

  app.post(
    "/validate-rule",
    validateRequiredFields,
    ({ body }: Request, res: Response, next: NextFunction) => {
      const { rule, data }: any = body;
      //field validation error
      const fieldError: BadRequest = new BadRequest(
        `field ${rule.field} is missing from data.`,
        null
      );
      //check if nested field
      const isNested = (field: any): boolean => {
        return field.includes(".");
      };

      // get nested fields key
      const getNestedFieldsKey = (field: any): Readonly<Array<string>> => {
        return field.split(".");
      };

      //check if field in rule object exists in data when data is an object
      const checkObjectDataFields = (field: any, data: any): void => {
        const hasField = (field: any, data: any): void => {
          if (!(field in data)) {
            throw fieldError;
          }
        };
        //check for nested fields
        if (typeof field === "string" && isNested(field)) {
          const keys: readonly string[] = getNestedFieldsKey(field);
          if (keys[0] in data) {
            hasField(keys[1], data[keys[0]]);
          } else throw fieldError;
        } else hasField(field, data);
      };

      //check if field in rule object exists in data when data is an array or string
      const checkDataFields = (field: any, data: any): void => {
        if (data[field] === 0) return;
        if (!data[field]) throw fieldError;
      };

      // get field value
      const getFieldValue = (field: any, data: any): any => {
        return typeof data === "object" &&
          typeof field === "string" &&
          isNested(field)
          ? data[getNestedFieldsKey(field)[0]][getNestedFieldsKey(field)[1]]
          : data[field];
      };

      //create route error response
      const createErrorResponse = (rule: any, data: any): void => {
        throw new BadRequest(`field ${rule.field} failed validation.`, {
          validation: {
            error: true,
            field: rule.field,
            field_value: getFieldValue(rule.field, data),
            condition: rule.condition,
            condition_value: rule.condition_value,
          },
        });
      };
      //create a route success response
      const createSuccessResponse = (
        rule: any,
        data: any
      ): Response<any, Record<string, any>> => {
        return res.json({
          message: `field ${rule.field} successfully validated.`,
          status: "success",
          data: {
            validation: {
              error: false,
              field: rule.field,
              field_value: getFieldValue(rule.field, data),
              condition: rule.condition,
              condition_value: rule.condition_value,
            },
          },
        });
      };

      const checkConditions = (rule: any, data: any) => {
        // check for eq condition
        if (rule.condition === "eq") {
          if (data[rule.field] !== rule.condition_value) {
            createErrorResponse(rule, data);
          }
          return createSuccessResponse(rule, data);
        }
        //check for neq condition
        if (rule.condition === "neq") {
          if (data[rule.field] === rule.condition_value) {
            createErrorResponse(rule, data);
          }
          return createSuccessResponse(rule, data);
        }
        //check for gt condtion
        if (rule.condition === "gt") {
          if (data[rule.field] <= rule.condition_value) {
            createErrorResponse(rule, data);
          }
          return createSuccessResponse(rule, data);
        }
        //check for gte condition
        if (rule.condition === "gte") {
          if (data[rule.field] < rule.condition_value) {
            createErrorResponse(rule, data);
          }
          return createSuccessResponse(rule, data);
        }

        //check for contains condition [last condition]
        if (data[rule.field].toString().indexOf(rule.condition_value) === -1) {
          createErrorResponse(rule, data);
        }
        return createSuccessResponse(rule, data);
      };
      try {
        //working with array data
        if (Array.isArray(data) || typeof data === "string") {
          checkDataFields(rule.field, data);
          checkConditions(rule, data);
          return;
        }
        //working with object data
        if (typeof data === "object" && !Array.isArray(data)) {
          checkObjectDataFields(rule.field, data);
          if (isNested(rule.field)) {
            const keys: readonly string[] = getNestedFieldsKey(rule.field);
            // check for eq condition
            if (rule.condition === "eq") {
              if (data[keys[0]][keys[1]] !== rule.condition_value) {
                createErrorResponse(rule, data);
              }
              return createSuccessResponse(rule, data);
            }
            //check for neq condition
            if (rule.condition === "neq") {
              if (data[keys[0]][keys[1]] === rule.condition_value) {
                createErrorResponse(rule, data);
              }
              return createSuccessResponse(rule, data);
            }
            //check for gt condtion
            if (rule.condition === "gt") {
              if (data[keys[0]][keys[1]] <= rule.condition_value) {
                createErrorResponse(rule, data);
              }
              return createSuccessResponse(rule, data);
            }
            //check for gte condition
            if (rule.condition === "gte") {
              if (data[keys[0]][keys[1]] < rule.condition_value) {
                createErrorResponse(rule, data);
              }
              return createSuccessResponse(rule, data);
            }

            //check for contains condition [last condition]
            if (
              data[keys[0]][keys[1]]
                .toString()
                .indexOf(rule.condition_value) === -1
            ) {
              createErrorResponse(rule, data);
            }
            return createSuccessResponse(rule, data);
          }
          checkConditions(rule, data);
          return;
        }

        throw new BadRequest(
          "data should be an object, string or an array.",
          null
        );
      } catch (err) {
        next(err);
      }
    }
  );

  //error handler middleware
  app.use(apiErrorHandler);
  app.listen(process.env.PORT, () => console.log("server is listening"));
}

main();
