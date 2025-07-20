import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { SchemaType } from "./schema";
import { CONFIG, IConfig } from "src/config/config.provider";
import { Logger } from "@nestjs/common";
import { DefaultLogger, LogWriter } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schemas } from "./schema";
import { ConfigEnum } from "src/config/config.enum";

export class ConnectionManager {
  // for manually contol connect and disconnect actions
  private connection: Pool | null = null;
  private logger: DefaultLogger;
  private config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
    this.logger = this.createLogger(config);
    this.connection = this.createConnection(config);
  }

  private createConnection(config: IConfig) {
    if (this.connection) {
      return this.connection;
    }
    const dbURL = <string>config.get(ConfigEnum.DB_URL);
    return new Pool({
      connectionString: dbURL,
    });
  }

  private createLogger(config: IConfig) {
    if (this.logger) {
      return this.logger;
    }

    // print connection info when connecting
    const logger = new Logger("DB");
    const dbURL = <string>config.get(ConfigEnum.DB_URL);
    logger.debug(`Connecting to ${dbURL}`);

    class CustomDbLogWriter implements LogWriter {
      write(message: string) {
        logger.verbose(message);
      }
    }

    return new DefaultLogger({
      writer: new CustomDbLogWriter(),
    });
  }

  async connect() {
    if (!this.connection) {
      this.connection = this.createConnection(this.config);
    }
    return drizzle({
      client: this.connection,
      schema: schemas,
      logger: this.logger,
    });
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}

export const DB = Symbol("DB");
export const DatabseProvider = {
  provide: DB,
  inject: [CONFIG],
  useFactory: async (config: IConfig) => {
    return new ConnectionManager(config).connect();
  },
};

export type DBType = NodePgDatabase<SchemaType>;
