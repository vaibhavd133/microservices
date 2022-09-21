import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "postgres",
  password: "pwd",
  database: "admin",
  synchronize: false,
  logging: true,
  entities: [Product],
  migrations: [],
  subscribers: []
});
