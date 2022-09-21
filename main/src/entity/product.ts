import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class Product {
  @ObjectIdColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  adminId: number;
}
