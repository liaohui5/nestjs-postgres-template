import { INestApplication } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception.filter";
import { ResponseFormatterInterceptor } from "./formatter.interceptor";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ZodValidationPipe } from "nestjs-zod";

export function applyGlobalMiddlewares(app: INestApplication) {
  // be careful: nestjs-zod is not working with zod v4.x
  // https://github.com/BenLorantfy/nestjs-zod/issues/167
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseFormatterInterceptor());
}

export function setupSwagger(app: INestApplication) {
  SwaggerModule.setup("/swagger", app, () => {
    const options = new DocumentBuilder()
      .setTitle("API Docs")
      .setDescription("The API Docs Description example")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    return SwaggerModule.createDocument(app, options, {
      ignoreGlobalPrefix: true,
    });
  });
}
