import { NextFunction, Request, Response } from "express";

enum HttpErrorCodes {
  BAD_REQUEST = 400,
  INTERNAL_SERVER = 500,
}

/**
 * Class representing an Api Error
 * @class Api Error
 *
 */
export default class ApiError {
  public readonly code: HttpErrorCodes | number;
  public readonly message: string;
  public readonly data: any;
  /**
   * Creates a new Aou error
   * @param {HttpErrorCodes} code error code
   * @param {string} message error message
   * @param {any} data error data
   */
  constructor(code: HttpErrorCodes, message: string, data: any) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

/**
 * Class representing a bad request(400) error
 * @class
 * @extends ApiError Api Error class
 */
export class BadRequest extends ApiError {
  /**
   * creates a new Bad request error
   * @param {string} message error message
   * @param {any} data error data
   */
  constructor(message: string, data: any) {
    super(HttpErrorCodes.BAD_REQUEST, message, data);
  }
}

/**
 * Server error middleware
 * @param {Error} err error object
 * @param {Request} req express request object
 * @param {Response} res express response object
 * @param {NextFunction} next express next function
 * @returns error response from server
 */
export const apiErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // api error response
  if (err instanceof ApiError) {
    return res
      .status(err.code)
      .json({ message: err.message, status: "error", data: err.data });
  }
  //invalid payload response
  if (
    err instanceof SyntaxError &&
    (err as any).status === 400 &&
    "body" in err
  ) {
    return res.status(HttpErrorCodes.BAD_REQUEST).json({
      message: "Invalid JSON payload passed.",
      status: "error",
      data: null,
    });
  }

  res
    .status(HttpErrorCodes.INTERNAL_SERVER)
    .json({ message: err.message, status: "error", data: null });
};
