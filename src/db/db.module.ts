import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "src/config/config.module";
import { DatabseProvider, DB } from "./db.provider";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DatabseProvider],
  exports: [DB],
})
export class DBModule {}
