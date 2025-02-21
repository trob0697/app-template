import { CookieOptions, Request, RequestHandler, Response } from "express";
import { Readable } from "stream";
import Joi from "types-joi";

interface Schema<TBody, TParams, TQuery> {
  body?: Joi.AnySchema<TBody | undefined>;
  params?: Joi.AnySchema<TParams | undefined>;
  query?: Joi.AnySchema<TQuery | undefined>;
}

interface HandlerArguments<TBody, TParams, TQuery> {
  request: Request;
  response: Response;
  body: NonNullable<TBody>;
  params: NonNullable<TParams>;
  query: NonNullable<TQuery>;
}

interface Cookie {
  name: string;
  value: string;
  options: CookieOptions;
}

interface HandlerResponse {
  status?: number;
  cookies?: Cookie[];
  headers?: Headers;
  body?: object;
  stream?: Readable;
  buffer?: Buffer;
  sms?: string;
  redirect?: string;
}

export function controller<
  TBody,
  TParams,
  TQuery,
  TResponse extends HandlerResponse,
>(
  schema: Schema<TBody, TParams, TQuery>,
  handlerFunction: (
    args: HandlerArguments<TBody, TParams, TQuery>,
  ) => Promise<TResponse>,
): RequestHandler {
  return async (request, response, next) => {
    try {
      const body: NonNullable<TBody> =
        schema.body !== undefined
          ? Joi.attempt(
              request.body,
              schema.body.required().strict(true),
              "Body does not match schema",
            )
          : request.body;
      const params: NonNullable<TParams> =
        schema.params !== undefined
          ? Joi.attempt(
              request.params,
              schema.params.required().strict(true),
              "Parameters do not match schema",
            )
          : (request.params as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      const query: NonNullable<TQuery> =
        schema.query !== undefined
          ? Joi.attempt(
              request.query,
              schema.query.required().strict(true),
              "Query does not match schema",
            )
          : (request.query as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const res = await handlerFunction({
        request,
        response,
        body,
        params,
        query,
      });

      if (
        [res.body, res.stream, res.buffer, res.sms, res.redirect].filter(
          (ele) => ele !== undefined,
        ).length !== 1
      ) {
        next(
          "Exactly one of body, stream, buffer, sms, or redirect must be returned",
        );
      }
      res.cookies?.forEach((cookie) => {
        response.cookie(cookie.name, cookie.value, cookie.options);
      });
      if (res.headers) {
        response.setHeaders(res.headers);
      }
      if (res.status) {
        response.status(res.status);
      }
      if (res.body) {
        response.json(res.body);
      } else if (res.stream) {
        res.stream.pipe(response);
      } else if (res.buffer) {
        response.send(res.buffer);
      } else if (res.sms) {
        response.type("text/xml");
        response.send(res.sms);
      } else if (res.redirect) {
        response.redirect(res.redirect);
      }
    } catch (error: unknown) {
      next(error);
    }
  };
}
