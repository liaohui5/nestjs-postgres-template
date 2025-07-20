import { Logger } from "@nestjs/common";
import { type ConfigType, configSchema } from "./config.schema";
import { ConfigEnum } from "./config.enum";
import { type IConfig } from "config";

// TODO: config not support import syntax
// https://github.com/node-config/node-config/issues/841
const config = require("config") as IConfig;

// TODO: manually throw error when config is invalid
const initConfig = () => configSchema.parse(config);

const initTimezone = () => {
  if (config.has(ConfigEnum.TIMEZONE)) {
    process.env.TZ = config.get(ConfigEnum.TIMEZONE);
  }
};

const printConfig = () => {
  if (config.has(ConfigEnum.IS_DEV) && config.get(ConfigEnum.IS_DEV)) {
    const logger = new Logger("Config");
    logger.verbose("Conifg Initialized:", config);
  }
};

export const configFactory = () => {
  initConfig();
  printConfig();
  initTimezone();
  return config;
};

export type { ConfigType, IConfig };
export const CONFIG = Symbol("CONFIG");
export const configProvider = {
  provide: CONFIG,
  useFactory: configFactory,
};
