import express, { NextFunction, Request, Response } from "express";
import { validateRequiredFields } from "./middlewares/validateRequiredFields";
import { apiErrorHandler, BadRequest } from "./utils/apiError";
import { ValidateData } from "./utils/validateData";

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
      const validateData: ValidateData = new ValidateData(res, rule, data);
      try {
        //working with array or string data
        if (Array.isArray(data) || typeof data === "string") {
          validateData.checkDataFields();
          validateData.checkConditions();
          return;
        }
        //working with object data
        if (typeof data === "object" && !Array.isArray(data)) {
          validateData.checkObjectDataFields();
          if (validateData.isNested()) {
            validateData.checkNestedFieldConditions();
          }
          validateData.checkConditions();
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
