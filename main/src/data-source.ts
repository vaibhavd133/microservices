import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entity";

export const AppDataSource = new DataSource({
  type: "mongodb",
  database: "admin",
  host: "mongo",
  port: 27017,
  username: "mongo",
  password: "pwd",
  useUnifiedTopology: true,
  synchronize: true,
  logging: false,
  entities: [Product],
  migrations: [],
  subscribers: []
});
