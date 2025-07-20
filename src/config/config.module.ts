import { Global, Module } from "@nestjs/common";
import { CONFIG, configProvider } from "./config.provider";

@Global()
@Module({
  providers: [configProvider],
  exports: [CONFIG],
})
export class ConfigModule {}
