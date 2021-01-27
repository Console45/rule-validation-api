import express, { Request, Response } from "express";
import { apiErrorHandler } from "./utils/apiError";

const app: express.Application = express();

function main() {
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
  app.use(apiErrorHandler);
  app.listen(process.env.PORT, () => console.log("server is listening"));
}

main();
