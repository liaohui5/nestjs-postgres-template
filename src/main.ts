import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { applyGlobalMiddlewares } from "./common/index";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix("api", {
    exclude: ["/", "/test"],
  });

  applyGlobalMiddlewares(app);
  await app.listen(3000);
}

bootstrap();
