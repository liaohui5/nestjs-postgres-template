import { isObject } from "lodash-es";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { ZodValidationException } from "nestjs-zod";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const response = exception.getResponse();
    const message = exception.message ?? this.formatErrorMessage(status);

    const body = {
      code: status,
      data: {
        requestURL: req.url,
        requestMethod: req.method,
        requestTimestampe: new Date().toISOString(),
        validationErrors: [],
      },
      message,
    };

    if (isObject(response)) {
      if (response.hasOwnProperty("message")) {
        body.message = response["message"];
      }

      if (exception instanceof ZodValidationException) {
        body.data.validationErrors = (response as any).errors;
      }
    }

    res.status(status).json(body);
  }

  formatErrorMessage(status: number) {
    return status >= 500 ? "Internal server error" : "Client error";
  }
}
