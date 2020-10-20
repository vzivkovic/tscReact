import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class Post {

  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String ) //ql field
  @Property({ type: "date" }) // db field
  createdAt = new Date();

  @Field(() => String )
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
}
