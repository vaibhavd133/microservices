import express, { Application, Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Product } from "./entity";
import { Channel, connect } from "amqplib";

AppDataSource.initialize()
  .then((db) => {
    connect("amqp://guest:guest@rabbit:5672").then((conn) => {
      conn.createChannel().then((ch: Channel) => {
        const app: Application = express();

        const productRepository = db.getMongoRepository(Product);

        app.use(express.json());

        app.get("/products", async (req: Request, res: Response) => {
          const products = await productRepository.find();
          res.status(200).json({ products });
        });

        ch.assertQueue("create_product");

        ch.consume(
          "create_product",
          async (msg) => {
            const product = JSON.parse(msg.content.toString());
            const newProduct = new Product();
            newProduct.adminId = product.id;
            newProduct.name = product.name;
            await productRepository.save(product);
          },
          { noAck: false }
        );

        app.listen(3000, () => {
          console.log("Server started on port 3001");
        });
      });
    });
  })
  .catch((e) => {
    console.log("error while connecting to db:", e);
  });
