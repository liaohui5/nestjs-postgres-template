import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "./config/config.module";
import { DBModule } from "./db/db.module";
import { LoggerModule } from "nestjs-pino";
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule,
    DBModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            {
              target: "pino-roll",
              options: {
                file: "logs/app",
                dateFormat: "yyyy-MM-dd-hh",
                extension: "log",
                frequency: "daily",
                size: "10M",
                mkdir: true,
              },
            },
          ],
        },
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
