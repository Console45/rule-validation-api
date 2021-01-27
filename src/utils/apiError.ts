import { NextFunction, Request, Response } from "express";

enum HttpErrorCodes {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
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
 * Class representing an Internal server(500) error
 * @class
 * @extends ApiError Api Error class
 */
export class InternalServerError extends ApiError {
  /**
   *creates a new Internal server error
   * @param {string} message error message
   * @param {any} data error data
   */
  constructor(message: string, data: any) {
    super(HttpErrorCodes.INTERNAL_SERVER, message, data);
  }
}
/**
 * Class representing a Forbidden request(403) error
 * @class
 * @extends ApiError Api Error class
 */
export class ForbiddenRequest extends ApiError {
  /**
   *creates a new Forbidden request error
   * @param {string} message error message
   * @param {any} data error data
   */
  constructor(message: string, data: any) {
    super(HttpErrorCodes.FORBIDDEN, message, data);
  }
}
/**
 * Class representing a Not found (404) error
 * @class
 * @extends ApiError Api Error class
 */
export class NotFoundError extends ApiError {
  /**
   *creates a new Not found error
   * @param {string} message error message
   * @param {any} data error data
   */
  constructor(message: string, data: any) {
    super(HttpErrorCodes.NOT_FOUND, message, data);
  }
}
/**
 * Class representing a Unauthorized request(401) error
 * @class
 * @extends ApiError Api Error class
 */
export class UnAuthorizedRequest extends ApiError {
  /**
   *creates a new unauthorized request error
   * @param {string} message error message
   * @param {any} data error data
   */
  constructor(message: string, data: any) {
    super(HttpErrorCodes.UNAUTHORIZED, message, data);
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
  if (err instanceof ApiError) {
    return res
      .status(err.code)
      .json({ status: "error", message: err.message, data: err.data });
  }
  res
    .status(HttpErrorCodes.INTERNAL_SERVER)
    .json({ status: "error", message: err.message, data: null });
};
