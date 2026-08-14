import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const myDataSource: DataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  schema: "jersy_shop",
  username: "postgres",
  password: "shahar1423",
  database: "postgres",
  entities: ["./**/*.entity.ts"],
  logging: true,
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
});
