import express, { Application, Request, Response } from "express";
import { Channel, connect } from "amqplib";
import { AppDataSource } from "./data-source";
import { Product } from "./entity";

AppDataSource.initialize()
  .then((db) => {
    connect("amqp://guest:guest@rabbit:5672").then((conn) => {
      conn.createChannel().then((ch: Channel) => {
        const app: Application = express();

        app.use(express.json());
        const productRepository = db.getRepository(Product);

        app.get("/products", async (req: Request, res: Response) => {
          const products = await productRepository.find();
          res.status(200).json({ products });
        });

        app.post("/products", async (req: Request, res: Response) => {
          const product = productRepository.create(req.body);
          const result = await productRepository.save(product);
          ch.sendToQueue("create_product", Buffer.from(JSON.stringify(result)));
          res.status(201).json({ result });
        });
        app.get("/products/:id", async (req: Request, res: Response) => {
          const product = await productRepository.findOne({
            where: { id: +req.params.id }
          });
          res.status(201).json({ product });
        });

        app.listen(3000, () => {
          console.log("Server started on port 3000");
        });
      });
    });
  })
  .catch((e) => {
    console.log("error while connecting to db:", e);
  });
